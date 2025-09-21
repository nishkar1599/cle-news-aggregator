const express = require('express');
const router = express.Router();

// Privacy Policy endpoint (GDPR Article 13 & 14)
router.get('/policy', (req, res) => {
  res.json({
    privacyPolicy: {
      lastUpdated: new Date().toISOString(),
      version: "1.0",
      controller: {
        name: "UK Compliant News Aggregator",
        contact: "privacy@newsaggregator.co.uk",
        address: "United Kingdom"
      },
      dataProcessing: {
        purposes: [
          "Providing news aggregation services",
          "User authentication and account management",
          "Improving service quality",
          "Legal compliance"
        ],
        legalBasis: "Consent (Article 6(1)(a) GDPR)",
        dataTypes: [
          "Email address (for account creation)",
          "Password (hashed and encrypted)",
          "IP address (for security and analytics)",
          "Consent records",
          "Usage data (anonymized)"
        ],
        retention: {
          accountData: "Until account deletion or 1 year of inactivity",
          sessionData: "24 hours or until logout",
          analyticsData: "26 months (anonymized)",
          consentRecords: "7 years (legal requirement)"
        }
      },
      userRights: {
        access: "Right to obtain confirmation of data processing",
        rectification: "Right to correct inaccurate personal data",
        erasure: "Right to delete personal data ('right to be forgotten')",
        portability: "Right to receive data in a structured format",
        objection: "Right to object to data processing",
        restriction: "Right to restrict data processing",
        complaint: "Right to lodge a complaint with the ICO"
      },
      dataSharing: {
        thirdParties: "No personal data shared with third parties",
        newsSources: "Only public news content aggregated",
        analytics: "Anonymized usage statistics only"
      },
      security: {
        encryption: "All data encrypted in transit and at rest",
        access: "Limited access to authorized personnel only",
        monitoring: "Regular security audits and monitoring"
      },
      cookies: {
        essential: "Session cookies for authentication",
        analytics: "Anonymized usage tracking",
        preferences: "User interface preferences"
      },
      contact: {
        dataProtectionOfficer: "dpo@newsaggregator.co.uk",
        general: "privacy@newsaggregator.co.uk",
        ico: "https://ico.org.uk/concerns/"
      }
    }
  });
});

// Data Processing Information (GDPR Article 13)
router.get('/data-processing', (req, res) => {
  res.json({
    dataProcessingInfo: {
      controller: "UK Compliant News Aggregator",
      purposes: [
        "Service provision and delivery",
        "User authentication and security",
        "Legal compliance and regulatory requirements"
      ],
      legalBasis: "Consent (GDPR Article 6(1)(a))",
      legitimateInterests: "Service improvement and security",
      dataCategories: [
        "Identity data (email address)",
        "Authentication data (password hash)",
        "Technical data (IP address, device info)",
        "Usage data (anonymized)",
        "Consent data (explicit consent records)"
      ],
      recipients: "No third-party data sharing",
      transfers: "No international data transfers",
      retention: "As specified in privacy policy",
      rights: "Full GDPR rights available",
      automatedDecisionMaking: "No automated decision-making or profiling"
    }
  });
});

// Cookie Policy
router.get('/cookies', (req, res) => {
  res.json({
    cookiePolicy: {
      essential: {
        description: "Required for basic website functionality",
        examples: ["Session cookies", "Authentication cookies"],
        retention: "Session duration or 24 hours"
      },
      analytics: {
        description: "Help us understand how users interact with our service",
        examples: ["Page views", "User interactions"],
        retention: "26 months (anonymized)",
        optOut: "Available through user preferences"
      },
      preferences: {
        description: "Remember user settings and preferences",
        examples: ["Language settings", "Display preferences"],
        retention: "Until user changes preferences"
      },
      thirdParty: {
        description: "We do not use third-party cookies",
        compliance: "No tracking or advertising cookies"
      }
    }
  });
});

// Data Breach Information
router.get('/breach-procedure', (req, res) => {
  res.json({
    breachProcedure: {
      detection: "Automated monitoring and manual review",
      assessment: "Risk assessment within 24 hours",
      notification: {
        ico: "Within 72 hours if high risk",
        users: "Within 72 hours if high risk to individuals",
        public: "If high risk to many individuals"
      },
      mitigation: "Immediate containment and security measures",
      documentation: "Full incident documentation maintained",
      contact: "security@newsaggregator.co.uk"
    }
  });
});

// User Rights Implementation
router.get('/rights', (req, res) => {
  res.json({
    userRights: {
      access: {
        description: "Right to know what personal data we hold",
        implementation: "Profile endpoint provides full data access",
        timeframe: "Within 30 days of request"
      },
      rectification: {
        description: "Right to correct inaccurate data",
        implementation: "User can update profile information",
        timeframe: "Immediate for user-initiated changes"
      },
      erasure: {
        description: "Right to delete personal data",
        implementation: "Account deletion endpoint available",
        timeframe: "Within 30 days of request"
      },
      portability: {
        description: "Right to receive data in portable format",
        implementation: "Data export functionality available",
        timeframe: "Within 30 days of request"
      },
      objection: {
        description: "Right to object to data processing",
        implementation: "Opt-out mechanisms available",
        timeframe: "Immediate effect"
      },
      restriction: {
        description: "Right to restrict data processing",
        implementation: "Account suspension or limited processing",
        timeframe: "Within 7 days of request"
      }
    }
  });
});

module.exports = router;
