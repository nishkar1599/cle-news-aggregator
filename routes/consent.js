const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Mock consent database (in production, use proper database)
const consentRecords = [];

// Consent Management (GDPR Article 7)
router.post('/give', [
  body('userId').notEmpty().withMessage('User ID required'),
  body('consentType').isIn(['dataProcessing', 'analytics', 'marketing', 'cookies']).withMessage('Valid consent type required'),
  body('consent').isBoolean().withMessage('Consent must be true or false'),
  body('purpose').notEmpty().withMessage('Purpose of processing required')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Invalid consent data',
        details: errors.array()
      });
    }

    const { userId, consentType, consent, purpose } = req.body;

    // Create consent record with full GDPR compliance
    const consentRecord = {
      id: Date.now().toString(),
      userId,
      consentType,
      consent,
      purpose,
      timestamp: new Date().toISOString(),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      version: "1.0",
      legalBasis: "GDPR Article 6(1)(a) - Consent",
      withdrawal: {
        available: true,
        method: "Contact us or use withdrawal endpoint",
        timeframe: "Immediate effect"
      },
      retention: {
        period: "7 years from consent date",
        reason: "Legal compliance requirement"
      }
    };

    consentRecords.push(consentRecord);

    // Log consent for compliance
    console.log(`Consent recorded: User ${userId}, Type: ${consentType}, Consent: ${consent}, IP: ${req.ip}`);

    res.status(201).json({
      message: 'Consent recorded successfully',
      consent: {
        id: consentRecord.id,
        type: consentType,
        given: consent,
        timestamp: consentRecord.timestamp,
        withdrawal: consentRecord.withdrawal
      },
      gdpr: {
        compliance: "Consent recorded in accordance with GDPR Article 7",
        withdrawal: "You can withdraw consent at any time",
        retention: "Consent records retained for 7 years for legal compliance"
      }
    });

  } catch (error) {
    console.error('Consent recording error:', error);
    res.status(500).json({ 
      error: 'Failed to record consent',
      message: 'Please try again later'
    });
  }
});

// Withdraw Consent (GDPR Article 7(3))
router.post('/withdraw', [
  body('userId').notEmpty().withMessage('User ID required'),
  body('consentType').isIn(['dataProcessing', 'analytics', 'marketing', 'cookies']).withMessage('Valid consent type required')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Invalid withdrawal request',
        details: errors.array()
      });
    }

    const { userId, consentType } = req.body;

    // Find and update consent record
    const consentIndex = consentRecords.findIndex(
      record => record.userId === userId && record.consentType === consentType
    );

    if (consentIndex === -1) {
      return res.status(404).json({ 
        error: 'Consent record not found',
        message: 'No consent record found for this user and type'
      });
    }

    // Update consent to withdrawn
    consentRecords[consentIndex].consent = false;
    consentRecords[consentIndex].withdrawnAt = new Date().toISOString();
    consentRecords[consentIndex].withdrawalIp = req.ip;

    // Log withdrawal for compliance
    console.log(`Consent withdrawn: User ${userId}, Type: ${consentType}, IP: ${req.ip}`);

    res.json({
      message: 'Consent withdrawn successfully',
      consent: {
        type: consentType,
        withdrawn: true,
        timestamp: consentRecords[consentIndex].withdrawnAt
      },
      gdpr: {
        compliance: "Consent withdrawal processed in accordance with GDPR Article 7(3)",
        effect: "Data processing will cease for this purpose",
        retention: "Withdrawal record maintained for legal compliance"
      }
    });

  } catch (error) {
    console.error('Consent withdrawal error:', error);
    res.status(500).json({ 
      error: 'Failed to withdraw consent',
      message: 'Please try again later'
    });
  }
});

// Get Consent Status
router.get('/status/:userId', (req, res) => {
  try {
    const { userId } = req.params;

    const userConsents = consentRecords.filter(record => record.userId === userId);

    if (userConsents.length === 0) {
      return res.status(404).json({ 
        error: 'No consent records found',
        message: 'No consent records found for this user'
      });
    }

    const consentStatus = userConsents.map(record => ({
      type: record.consentType,
      given: record.consent,
      timestamp: record.timestamp,
      withdrawn: record.withdrawnAt || null,
      purpose: record.purpose
    }));

    res.json({
      userId,
      consents: consentStatus,
      gdpr: {
        rights: [
          "Right to withdraw consent at any time",
          "Right to access consent records",
          "Right to data portability",
          "Right to erasure"
        ],
        contact: "privacy@newsaggregator.co.uk"
      }
    });

  } catch (error) {
    console.error('Consent status error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve consent status',
      message: 'Please try again later'
    });
  }
});

// Consent History
router.get('/history/:userId', (req, res) => {
  try {
    const { userId } = req.params;

    const userConsents = consentRecords.filter(record => record.userId === userId);

    if (userConsents.length === 0) {
      return res.status(404).json({ 
        error: 'No consent history found',
        message: 'No consent history found for this user'
      });
    }

    // Sort by timestamp (newest first)
    const sortedConsents = userConsents.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      userId,
      history: sortedConsents.map(record => ({
        id: record.id,
        type: record.consentType,
        given: record.consent,
        timestamp: record.timestamp,
        withdrawn: record.withdrawnAt || null,
        purpose: record.purpose,
        ipAddress: record.ipAddress
      })),
      gdpr: {
        compliance: "Full consent history maintained for legal compliance",
        retention: "Records retained for 7 years as required by law"
      }
    });

  } catch (error) {
    console.error('Consent history error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve consent history',
      message: 'Please try again later'
    });
  }
});

// Cookie Consent Management
router.post('/cookies', [
  body('userId').notEmpty().withMessage('User ID required'),
  body('essential').isBoolean().withMessage('Essential cookies consent required'),
  body('analytics').isBoolean().withMessage('Analytics cookies consent required'),
  body('preferences').isBoolean().withMessage('Preferences cookies consent required')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Invalid cookie consent data',
        details: errors.array()
      });
    }

    const { userId, essential, analytics, preferences } = req.body;

    // Record cookie consents
    const cookieConsents = [
      { type: 'essential', consent: essential, required: true },
      { type: 'analytics', consent: analytics, required: false },
      { type: 'preferences', consent: preferences, required: false }
    ];

    cookieConsents.forEach(cookieConsent => {
      const consentRecord = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        userId,
        consentType: 'cookies',
        consent: cookieConsent.consent,
        purpose: `Cookie consent for ${cookieConsent.type} cookies`,
        timestamp: new Date().toISOString(),
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        cookieType: cookieConsent.type,
        required: cookieConsent.required
      };

      consentRecords.push(consentRecord);
    });

    // Log cookie consent for compliance
    console.log(`Cookie consent recorded: User ${userId}, Essential: ${essential}, Analytics: ${analytics}, Preferences: ${preferences}, IP: ${req.ip}`);

    res.json({
      message: 'Cookie consent recorded successfully',
      cookies: {
        essential: { consent: essential, required: true },
        analytics: { consent: analytics, required: false },
        preferences: { consent: preferences, required: false }
      },
      gdpr: {
        compliance: "Cookie consent recorded in accordance with GDPR and PECR",
        withdrawal: "You can change cookie preferences at any time",
        retention: "Consent records maintained for legal compliance"
      }
    });

  } catch (error) {
    console.error('Cookie consent error:', error);
    res.status(500).json({ 
      error: 'Failed to record cookie consent',
      message: 'Please try again later'
    });
  }
});

module.exports = router;
