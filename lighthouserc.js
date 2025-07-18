module.exports = {
  ci: {
    collect: {
      // Start a local server before running Lighthouse
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'Ready',
      startServerReadyTimeout: 30000,
      
      // URLs to test
      url: [
        'http://localhost:3000',
        'http://localhost:3000/directory',
        'http://localhost:3000/events',
        'http://localhost:3000/photos',
        'http://localhost:3000/announcements',
        'http://localhost:3000/profile',
        'http://localhost:3000/sign-in',
        'http://localhost:3000/sign-up',
      ],
      
      // Number of runs per URL
      numberOfRuns: 3,
      
      // Additional Chrome flags
      chromeFlags: [
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
      ],
    },
    
    assert: {
      // Performance budgets
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.8 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'categories:pwa': ['warn', { minScore: 0.6 }],
        
        // Core Web Vitals
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        'speed-index': ['warn', { maxNumericValue: 2500 }],
        'interactive': ['warn', { maxNumericValue: 3000 }],
        
        // Resource budgets
        'resource-summary:document:size': ['error', { maxNumericValue: 50000 }],
        'resource-summary:script:size': ['error', { maxNumericValue: 300000 }],
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 50000 }],
        'resource-summary:image:size': ['warn', { maxNumericValue: 200000 }],
        'resource-summary:total:size': ['warn', { maxNumericValue: 500000 }],
        
        // Network requests
        'network-requests': ['warn', { maxNumericValue: 30 }],
        'unused-javascript': ['warn', { maxNumericValue: 100000 }],
        'unused-css-rules': ['warn', { maxNumericValue: 20000 }],
        
        // Security and best practices
        'is-on-https': 'error',
        'uses-https': 'error',
        'no-vulnerable-libraries': 'error',
        'csp-xss': 'warn',
        
        // Accessibility
        'color-contrast': 'error',
        'image-alt': 'error',
        'link-name': 'error',
        'button-name': 'error',
        'document-title': 'error',
        'html-has-lang': 'error',
        'meta-viewport': 'error',
        
        // SEO
        'meta-description': 'error',
        'hreflang': 'warn',
        'canonical': 'warn',
        'robots-txt': 'warn',
      },
    },
    
    upload: {
      // Upload results to Lighthouse CI server or temporary storage
      target: 'temporary-public-storage',
      
      // Optional: Upload to your own LHCI server
      // serverBaseUrl: 'https://your-lhci-server.com',
      // token: 'your-lhci-token',
    },
    
    server: {
      // Optional: Configuration for running your own LHCI server
      // port: 9001,
      // storage: {
      //   storageMethod: 'sql',
      //   sqlDialect: 'sqlite',
      //   sqlDatabasePath: './lhci.db',
      // },
    },
    
    wizard: {
      // Configuration for the setup wizard
      // This is not used in CI, but can be helpful for local development
    },
  },
  
  // Optional: Custom audit configurations
  extends: [
    'lighthouse:default',
    '@lighthouse/ci:recommended',
  ],
  
  // Optional: Settings to pass to Lighthouse
  settings: {
    // Emulate a mobile device
    emulatedFormFactor: 'mobile',
    
    // Throttling settings
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
    
    // Skip certain audits that might not be relevant
    skipAudits: [
      'canonical',
      'structured-data',
      'installable-manifest',
      'splash-screen',
      'themed-omnibox',
      'content-width',
    ],
    
    // Only run certain categories
    onlyCategories: [
      'performance',
      'accessibility',
      'best-practices',
      'seo',
    ],
  },
} 