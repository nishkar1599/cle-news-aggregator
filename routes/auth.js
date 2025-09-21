const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Mock user database (in production, use proper database)
const users = [];

// JWT secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-change-in-production';

// Registration with GDPR compliance
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('consent').equals('true').withMessage('Consent to data processing required'),
  body('age').isInt({ min: 13 }).withMessage('Must be at least 13 years old')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password, consent, age } = req.body;

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User already exists',
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user with GDPR compliance data
    const user = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      consent: {
        dataProcessing: consent === 'true',
        timestamp: new Date().toISOString(),
        ipAddress: req.ip
      },
      age,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      dataRetention: {
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
        purpose: 'Service provision'
      }
    };

    users.push(user);

    // Log registration for compliance
    console.log(`User registered: ${email}, IP: ${req.ip}, Consent: ${consent}`);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt
      },
      gdpr: {
        dataProcessing: 'Consent-based',
        retention: '1 year or until account deletion',
        rights: 'Access, rectification, erasure, portability'
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Registration failed',
      message: 'Please try again later'
    });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Invalid credentials',
        message: 'Please check your email and password'
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Update last login
    user.lastLogin = new Date().toISOString();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Log login for compliance
    console.log(`User login: ${email}, IP: ${req.ip}`);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        lastLogin: user.lastLogin
      },
      gdpr: {
        dataProcessing: 'Authentication and service provision',
        retention: 'Session data deleted after logout'
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Login failed',
      message: 'Please try again later'
    });
  }
});

// Logout
router.post('/logout', (req, res) => {
  // In a real application, you might want to blacklist the token
  console.log(`User logout: IP: ${req.ip}`);
  
  res.json({
    message: 'Logout successful',
    gdpr: {
      dataProcessing: 'Session data cleared',
      retention: 'No persistent data retained'
    }
  });
});

// Get user data (GDPR right to access)
router.get('/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      consent: user.consent,
      dataRetention: user.dataRetention
    },
    gdpr: {
      rights: [
        'Right to access your data',
        'Right to rectification',
        'Right to erasure',
        'Right to data portability',
        'Right to object to processing'
      ]
    }
  });
});

// Delete user account (GDPR right to erasure)
router.delete('/profile', authenticateToken, (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.user.userId);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const user = users[userIndex];
  
  // Log deletion for compliance
  console.log(`User account deleted: ${user.email}, IP: ${req.ip}`);
  
  // Remove user from array
  users.splice(userIndex, 1);

  res.json({
    message: 'Account deleted successfully',
    gdpr: {
      dataProcessing: 'Account and associated data permanently deleted',
      retention: 'No data retained after deletion'
    }
  });
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

module.exports = router;
