# UK Compliant News Aggregator

A GDPR and UK cyber law compliant news and media aggregation service built with Node.js and Express.

## 🛡️ Legal Compliance

This project is designed to be fully compliant with UK cyber laws and regulations:

- **GDPR (General Data Protection Regulation)**
- **Data Protection Act 2018**
- **Computer Misuse Act 1990**
- **Online Safety Act 2023**
- **PECR (Privacy and Electronic Communications Regulations)**

## 🚀 Features

### Core Functionality
- **News Aggregation**: Collects news from trusted UK sources
- **Multiple Categories**: General, Business, Technology, Sports, Politics
- **Source Verification**: Only trusted and verified news sources
- **Real-time Updates**: Fresh news content with timestamps

### GDPR Compliance
- **Explicit Consent**: Clear consent mechanisms for data processing
- **Data Minimization**: Only collects necessary data
- **Right to Access**: Users can access their personal data
- **Right to Erasure**: Users can delete their accounts and data
- **Data Portability**: Users can export their data
- **Consent Withdrawal**: Easy consent withdrawal mechanisms

### Security Features
- **HTTPS Enforcement**: Secure data transmission
- **Input Validation**: Protection against injection attacks
- **Rate Limiting**: Protection against abuse
- **Security Headers**: Comprehensive security headers
- **Data Sanitization**: Protection against XSS and injection
- **Session Management**: Secure session handling

### Accessibility
- **WCAG 2.1 AA Compliance**: Full accessibility support
- **Screen Reader Support**: Proper ARIA labels and roles
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast Support**: Support for high contrast mode
- **Reduced Motion Support**: Respects user motion preferences

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Modern web browser

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd uk-compliant-news-aggregator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `SESSION_SECRET` | Session secret key | Required |
| `JWT_SECRET` | JWT secret key | Required |
| `ALLOWED_ORIGINS` | CORS allowed origins | http://localhost:3000 |

### Security Configuration

The application includes comprehensive security measures:

- **Helmet.js**: Security headers
- **Rate Limiting**: Request rate limiting
- **Input Validation**: Express-validator for input sanitization
- **CORS**: Configurable cross-origin resource sharing
- **Session Security**: Secure session configuration

## 📊 API Endpoints

### News Endpoints
- `GET /api/news` - Get news articles
- `GET /api/news/sources` - Get available news sources
- `GET /api/news/article` - Get specific article content

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `DELETE /api/auth/profile` - Delete user account

### Privacy Endpoints
- `GET /api/privacy/policy` - Privacy policy
- `GET /api/privacy/data-processing` - Data processing information
- `GET /api/privacy/cookies` - Cookie policy
- `GET /api/privacy/rights` - User rights information

### Consent Endpoints
- `POST /api/consent/give` - Give consent
- `POST /api/consent/withdraw` - Withdraw consent
- `GET /api/consent/status/:userId` - Get consent status
- `GET /api/consent/history/:userId` - Get consent history

## 🔒 GDPR Compliance Features

### Data Processing
- **Lawful Basis**: Consent-based processing (Article 6(1)(a))
- **Data Minimization**: Only necessary data collected
- **Purpose Limitation**: Clear purposes for data processing
- **Storage Limitation**: Automatic data retention policies

### User Rights Implementation
- **Right to Access**: Full data access through API
- **Right to Rectification**: Data correction capabilities
- **Right to Erasure**: Account and data deletion
- **Right to Portability**: Data export functionality
- **Right to Object**: Opt-out mechanisms
- **Right to Restriction**: Data processing restrictions

### Consent Management
- **Explicit Consent**: Clear consent mechanisms
- **Granular Consent**: Different consent types
- **Consent Withdrawal**: Easy withdrawal process
- **Consent Records**: Full consent history tracking

## 🛡️ Security Measures

### Data Protection
- **Encryption**: Data encrypted in transit and at rest
- **Access Control**: Role-based access control
- **Audit Logging**: Comprehensive activity logging
- **Data Sanitization**: Input validation and sanitization

### Network Security
- **HTTPS**: Enforced secure connections
- **Security Headers**: Comprehensive security headers
- **Rate Limiting**: Protection against abuse
- **CORS**: Configurable cross-origin policies

## ♿ Accessibility Features

### WCAG 2.1 AA Compliance
- **Semantic HTML**: Proper semantic structure
- **ARIA Labels**: Comprehensive ARIA support
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper screen reader support
- **Color Contrast**: Sufficient color contrast ratios

### Responsive Design
- **Mobile First**: Mobile-first design approach
- **Responsive Layout**: Adaptive layouts for all devices
- **Touch Friendly**: Touch-friendly interface elements
- **High DPI Support**: Support for high-resolution displays

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Internet Explorer 11+ (with polyfills)

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint
```

## 🚀 Deployment

### Production Checklist
- [ ] Update environment variables
- [ ] Configure HTTPS
- [ ] Set up proper logging
- [ ] Configure database (if using external)
- [ ] Set up monitoring
- [ ] Configure backup procedures
- [ ] Review security settings
- [ ] Test accessibility features
- [ ] Verify GDPR compliance

### Docker Deployment
```bash
# Build Docker image
docker build -t uk-news-aggregator .

# Run container
docker run -p 3000:3000 uk-news-aggregator
```

## 📚 Legal Documentation

### Privacy Policy
The application includes a comprehensive privacy policy covering:
- Data collection and processing
- Legal basis for processing
- User rights
- Data retention policies
- Contact information

### Cookie Policy
Detailed cookie policy including:
- Essential cookies
- Analytics cookies
- Preference cookies
- Third-party cookies (none used)

### Terms of Service
Terms of service covering:
- Service usage
- User responsibilities
- Intellectual property
- Limitation of liability

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure GDPR compliance
5. Test accessibility features
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- **Privacy Questions**: privacy@newsaggregator.co.uk
- **Technical Support**: support@newsaggregator.co.uk
- **Data Protection Officer**: dpo@newsaggregator.co.uk

## 🔗 Legal Resources

- [ICO (Information Commissioner's Office)](https://ico.org.uk)
- [UK Data Protection](https://www.gov.uk/data-protection)
- [GDPR Guidelines](https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/)
- [Online Safety Act](https://www.gov.uk/government/publications/online-safety-bill)

## 📈 Compliance Monitoring

The application includes built-in compliance monitoring:
- Consent tracking
- Data processing logs
- Security event logging
- Privacy impact assessments

## 🔄 Updates and Maintenance

Regular updates ensure continued compliance with:
- Changing regulations
- Security patches
- Accessibility improvements
- Performance optimizations

---

**Disclaimer**: This application is designed for educational purposes and demonstrates GDPR compliance principles. For production use, consult with legal experts to ensure full compliance with all applicable laws and regulations.
