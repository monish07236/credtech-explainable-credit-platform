const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, param, validationResult } = require('express-validator');
const winston = require('winston');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://monish07236.github.io'] 
    : ['http://localhost:3000', 'http://127.0.0.1:5500']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Enhanced mock data with more realistic financial metrics
const enhancedCompanyData = {
  AAPL: {
    companyInfo: {
      name: "Apple Inc.",
      ticker: "AAPL",
      sector: "Technology",
      industry: "Consumer Electronics",
      marketCap: 3000000000000, // $3T
      employees: 164000,
      founded: 1976,
      headquarters: "Cupertino, CA"
    },
    creditMetrics: {
      score: 92,
      change: 2.1,
      trend: "stable",
      rating: "AAA",
      riskLevel: "Very Low",
      probabilityOfDefault: 0.02,
      recoveryRate: 0.85,
      beta: 1.2,
      volatility: 0.25
    },
    financialHealth: {
      revenue: 394328000000, // $394.3B
      netIncome: 99803000000,  // $99.8B
      totalDebt: 109280000000, // $109.3B
      cashAndEquivalents: 166300000000, // $166.3B
      debtToEquity: 1.73,
      currentRatio: 0.93,
      quickRatio: 0.83,
      interestCoverage: 28.5,
      returnOnEquity: 0.26,
      operatingMargin: 0.25
    },
    riskDrivers: [
      {
        id: "revenue_growth",
        name: "Strong Revenue Diversification",
        category: "Operational",
        impact: "positive",
        value: "+15%",
        weight: 0.25,
        description: "Consistent growth across iPhone, Services, and emerging markets",
        confidence: 0.92,
        lastUpdated: "2025-08-22T14:30:00Z"
      },
      {
        id: "cash_position",
        name: "Exceptional Liquidity Position",
        category: "Financial",
        impact: "positive",
        value: "+12%",
        weight: 0.20,
        description: "$166B+ in cash provides substantial financial flexibility",
        confidence: 0.98,
        lastUpdated: "2025-08-22T14:15:00Z"
      },
      {
        id: "supply_chain",
        name: "Supply Chain Vulnerabilities",
        category: "Operational",
        impact: "negative",
        value: "-8%",
        weight: 0.15,
        description: "Dependency on Asian suppliers poses geopolitical risks",
        confidence: 0.76,
        lastUpdated: "2025-08-22T13:45:00Z"
      },
      {
        id: "regulatory_pressure",
        name: "Antitrust Regulatory Pressure",
        category: "Regulatory",
        impact: "negative",
        value: "-5%",
        weight: 0.10,
        description: "Ongoing investigations in EU and US regarding App Store practices",
        confidence: 0.84,
        lastUpdated: "2025-08-22T12:20:00Z"
      }
    ],
    marketEvents: [
      {
        id: "earnings_q3_2025",
        title: "Q3 2025 Earnings Beat Expectations",
        date: "2025-08-22T09:00:00Z",
        category: "earnings",
        impact: "positive",
        severity: "high",
        scoreChange: +3.2,
        description: "Apple reported Q3 revenue of $85.8B vs expected $84.5B, driven by strong iPhone 15 sales and services growth.",
        source: "SEC Filing 10-Q",
        verified: true
      },
      {
        id: "ai_announcement",
        title: "Apple Intelligence Platform Launch",
        date: "2025-08-21T16:30:00Z",
        category: "product",
        impact: "positive",
        severity: "medium",
        scoreChange: +1.8,
        description: "Comprehensive AI integration across iOS 18 ecosystem positioning Apple for next-gen computing.",
        source: "Apple Press Release",
        verified: true
      },
      {
        id: "china_sales_warning",
        title: "China Sales Softness Warning",
        date: "2025-08-20T11:15:00Z",
        category: "market",
        impact: "negative",
        severity: "medium",
        scoreChange: -2.1,
        description: "Management warned of continued headwinds in Greater China region affecting Q4 guidance.",
        source: "Earnings Call Transcript",
        verified: true
      }
    ],
    historicalScores: [
      { date: "2025-08-15", score: 89.5, volume: 1250000 },
      { date: "2025-08-16", score: 90.2, volume: 1180000 },
      { date: "2025-08-17", score: 89.8, volume: 1340000 },
      { date: "2025-08-18", score: 91.1, volume: 1420000 },
      { date: "2025-08-19", score: 90.7, volume: 1380000 },
      { date: "2025-08-20", score: 90.0, volume: 1560000 },
      { date: "2025-08-21", score: 91.8, volume: 1480000 },
      { date: "2025-08-22", score: 92.0, volume: 1520000 }
    ],
    dataSourceHealth: {
      secFilings: { status: "healthy", latency: 145, lastUpdate: "2025-08-22T14:30:00Z" },
      marketData: { status: "healthy", latency: 23, lastUpdate: "2025-08-22T14:35:12Z" },
      newsAnalytics: { status: "degraded", latency: 1240, lastUpdate: "2025-08-22T14:10:30Z" },
      socialSentiment: { status: "healthy", latency: 340, lastUpdate: "2025-08-22T14:34:45Z" },
      macroEconomic: { status: "healthy", latency: 890, lastUpdate: "2025-08-22T14:25:15Z" },
      creditRatings: { status: "offline", latency: null, lastUpdate: "2025-08-22T10:15:00Z" }
    },
    alerts: []
  },
  
  TSLA: {
    companyInfo: {
      name: "Tesla, Inc.",
      ticker: "TSLA",
      sector: "Consumer Discretionary",
      industry: "Electric Vehicles",
      marketCap: 850000000000,
      employees: 140473,
      founded: 2003,
      headquarters: "Austin, TX"
    },
    creditMetrics: {
      score: 68,
      change: -4.7,
      trend: "declining",
      rating: "BB+",
      riskLevel: "Medium-High",
      probabilityOfDefault: 0.08,
      recoveryRate: 0.65,
      beta: 2.1,
      volatility: 0.45
    },
    financialHealth: {
      revenue: 96773000000,
      netIncome: 14997000000,
      totalDebt: 9616000000,
      cashAndEquivalents: 25460000000,
      debtToEquity: 0.17,
      currentRatio: 1.84,
      quickRatio: 1.34,
      interestCoverage: 15.2,
      returnOnEquity: 0.19,
      operatingMargin: 0.12
    },
    riskDrivers: [
      {
        id: "production_scaling",
        name: "Production Scaling Challenges",
        category: "Operational",
        impact: "negative",
        value: "-18%",
        weight: 0.30,
        description: "Cybertruck and Semi production significantly behind original timelines",
        confidence: 0.89,
        lastUpdated: "2025-08-22T13:20:00Z"
      },
      {
        id: "fsd_regulatory",
        name: "FSD Regulatory Headwinds",
        category: "Regulatory",
        impact: "negative",
        value: "-12%",
        weight: 0.20,
        description: "Full Self-Driving approval delays in key European and Asian markets",
        confidence: 0.82,
        lastUpdated: "2025-08-22T12:45:00Z"
      },
      {
        id: "energy_business",
        name: "Energy Storage Growth Surge",
        category: "Strategic",
        impact: "positive",
        value: "+14%",
        weight: 0.25,
        description: "Megapack deployments up 200% YoY, diversifying revenue streams",
        confidence: 0.91,
        lastUpdated: "2025-08-22T14:10:00Z"
      },
      {
        id: "china_expansion",
        name: "China Market Dominance",
        category: "Geographic",
        impact: "positive",
        value: "+8%",
        weight: 0.15,
        description: "Shanghai Gigafactory at full capacity, Model Y leading EV sales",
        confidence: 0.87,
        lastUpdated: "2025-08-22T11:30:00Z"
      }
    ],
    marketEvents: [
      {
        id: "production_warning_q4",
        title: "Q4 Production Targets at Risk",
        date: "2025-08-22T10:30:00Z",
        category: "guidance",
        impact: "negative",
        severity: "high",
        scoreChange: -5.2,
        description: "CEO Musk warned that Q4 vehicle delivery targets may be missed due to manufacturing bottlenecks.",
        source: "Earnings Call",
        verified: true
      },
      {
        id: "energy_milestone",
        title: "Record Energy Storage Deployments",
        date: "2025-08-19T14:00:00Z",
        category: "product",
        impact: "positive",
        severity: "medium",
        scoreChange: +2.8,
        description: "Tesla deployed 9.4 GWh of energy storage in Q3, setting new quarterly record.",
        source: "Company Update",
        verified: true
      }
    ],
    historicalScores: [
      { date: "2025-08-15", score: 75.2, volume: 890000 },
      { date: "2025-08-16", score: 73.8, volume: 920000 },
      { date: "2025-08-17", score: 72.1, volume: 1100000 },
      { date: "2025-08-18", score: 71.5, volume: 1250000 },
      { date: "2025-08-19", score: 69.8, volume: 1340000 },
      { date: "2025-08-20", score: 68.9, volume: 1480000 },
      { date: "2025-08-21", score: 67.2, volume: 1520000 },
      { date: "2025-08-22", score: 68.0, volume: 1380000 }
    ],
    dataSourceHealth: {
      secFilings: { status: "healthy", latency: 167, lastUpdate: "2025-08-22T14:20:00Z" },
      marketData: { status: "healthy", latency: 28, lastUpdate: "2025-08-22T14:35:08Z" },
      newsAnalytics: { status: "healthy", latency: 245, lastUpdate: "2025-08-22T14:32:15Z" },
      socialSentiment: { status: "healthy", latency: 412, lastUpdate: "2025-08-22T14:33:22Z" },
      macroEconomic: { status: "healthy", latency: 890, lastUpdate: "2025-08-22T14:25:15Z" },
      creditRatings: { status: "offline", latency: null, lastUpdate: "2025-08-22T09:45:00Z" }
    },
    alerts: [
      {
        id: "production_risk",
        type: "warning",
        severity: "high",
        title: "Manufacturing Risk Alert",
        message: "Cybertruck production delays may significantly impact Q4 delivery targets and cash flow projections.",
        timestamp: "2025-08-22T13:45:00Z",
        acknowledged: false
      }
    ]
  }

  // Similar detailed structure for MSFT, AMZN, GOOGL, META, NVDA...
  // Truncated for brevity, but would include all companies
};

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  logger.info('Health check requested');
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime()
  });
});

// Get all available companies
app.get('/api/companies', (req, res) => {
  try {
    const companies = Object.keys(enhancedCompanyData).map(ticker => ({
      ticker,
      name: enhancedCompanyData[ticker].companyInfo.name,
      sector: enhancedCompanyData[ticker].companyInfo.sector,
      currentScore: enhancedCompanyData[ticker].creditMetrics.score,
      riskLevel: enhancedCompanyData[ticker].creditMetrics.riskLevel
    }));
    
    logger.info(`Companies list requested, returning ${companies.length} companies`);
    res.json({
      success: true,
      data: companies,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error fetching companies list:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch companies data'
    });
  }
});

// Get detailed company data
app.get('/api/company/:ticker', 
  param('ticker').isAlpha().isLength({ min: 1, max: 10 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    try {
      const ticker = req.params.ticker.toUpperCase();
      const companyData = enhancedCompanyData[ticker];
      
      if (!companyData) {
        logger.warn(`Company data not found for ticker: ${ticker}`);
        return res.status(404).json({
          success: false,
          error: `Company data not found for ticker: ${ticker}`
        });
      }

      // Add some real-time simulation
      const simulatedData = {
        ...companyData,
        creditMetrics: {
          ...companyData.creditMetrics,
          score: companyData.creditMetrics.score + (Math.random() - 0.5) * 2,
          lastUpdated: new Date().toISOString()
        }
      };

      logger.info(`Company data requested for: ${ticker}`);
      res.json({
        success: true,
        data: simulatedData,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Error fetching company data for ${req.params.ticker}:`, error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch company data'
      });
    }
  }
);

// Get real-time score updates
app.get('/api/company/:ticker/score', (req, res) => {
  try {
    const ticker = req.params.ticker.toUpperCase();
    const companyData = enhancedCompanyData[ticker];
    
    if (!companyData) {
      return res.status(404).json({
        success: false,
        error: 'Company not found'
      });
    }

    // Simulate real-time score fluctuations
    const baseScore = companyData.creditMetrics.score;
    const fluctuation = (Math.random() - 0.5) * 3;
    const currentScore = Math.max(0, Math.min(100, baseScore + fluctuation));
    const change = fluctuation;

    res.json({
      success: true,
      data: {
        ticker,
        score: Math.round(currentScore * 100) / 100,
        change: Math.round(change * 100) / 100,
        timestamp: new Date().toISOString(),
        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
      }
    });
  } catch (error) {
    logger.error('Error fetching real-time score:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch real-time score'
    });
  }
});

// Get company risk drivers
app.get('/api/company/:ticker/drivers', (req, res) => {
  try {
    const ticker = req.params.ticker.toUpperCase();
    const companyData = enhancedCompanyData[ticker];
    
    if (!companyData) {
      return res.status(404).json({
        success: false,
        error: 'Company not found'
      });
    }

    res.json({
      success: true,
      data: {
        drivers: companyData.riskDrivers,
        summary: {
          total: companyData.riskDrivers.length,
          positive: companyData.riskDrivers.filter(d => d.impact === 'positive').length,
          negative: companyData.riskDrivers.filter(d => d.impact === 'negative').length
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error fetching risk drivers:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch risk drivers'
    });
  }
});

// Get market events timeline
app.get('/api/company/:ticker/events', (req, res) => {
  try {
    const ticker = req.params.ticker.toUpperCase();
    const companyData = enhancedCompanyData[ticker];
    
    if (!companyData) {
      return res.status(404).json({
        success: false,
        error: 'Company not found'
      });
    }

    // Sort events by date (most recent first)
    const sortedEvents = companyData.marketEvents.sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );

    res.json({
      success: true,
      data: {
        events: sortedEvents,
        summary: {
          total: sortedEvents.length,
          positive: sortedEvents.filter(e => e.impact === 'positive').length,
          negative: sortedEvents.filter(e => e.impact === 'negative').length,
          lastUpdate: sortedEvents[0]?.date || null
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error fetching market events:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch market events'
    });
  }
});

// Get historical score data
app.get('/api/company/:ticker/history', (req, res) => {
  try {
    const ticker = req.params.ticker.toUpperCase();
    const companyData = enhancedCompanyData[ticker];
    const days = parseInt(req.query.days) || 7;
    
    if (!companyData) {
      return res.status(404).json({
        success: false,
        error: 'Company not found'
      });
    }

    const historicalData = companyData.historicalScores.slice(-days);

    res.json({
      success: true,
      data: {
        history: historicalData,
        analytics: {
          averageScore: historicalData.reduce((sum, item) => sum + item.score, 0) / historicalData.length,
          volatility: calculateVolatility(historicalData.map(item => item.score)),
          trend: calculateTrend(historicalData.map(item => item.score))
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error fetching historical data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch historical data'
    });
  }
});

// Get data source health status
app.get('/api/system/health', (req, res) => {
  try {
    // Aggregate health status across all companies
    const allSources = Object.values(enhancedCompanyData).map(company => 
      company.dataSourceHealth
    );

    const healthSummary = {
      secFilings: { healthy: 0, degraded: 0, offline: 0 },
      marketData: { healthy: 0, degraded: 0, offline: 0 },
      newsAnalytics: { healthy: 0, degraded: 0, offline: 0 },
      socialSentiment: { healthy: 0, degraded: 0, offline: 0 },
      macroEconomic: { healthy: 0, degraded: 0, offline: 0 },
      creditRatings: { healthy: 0, degraded: 0, offline: 0 }
    };

    allSources.forEach(source => {
      Object.keys(source).forEach(key => {
        if (healthSummary[key]) {
          healthSummary[key][source[key].status]++;
        }
      });
    });

    res.json({
      success: true,
      data: {
        summary: healthSummary,
        overallHealth: calculateOverallHealth(healthSummary),
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Error fetching system health:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch system health'
    });
  }
});

// WebSocket endpoint for real-time updates (simplified HTTP endpoint)
app.get('/api/stream/:ticker', (req, res) => {
  const ticker = req.params.ticker.toUpperCase();
  
  if (!enhancedCompanyData[ticker]) {
    return res.status(404).json({
      success: false,
      error: 'Company not found'
    });
  }

  // Set headers for Server-Sent Events
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  // Send initial data
  const sendUpdate = () => {
    const baseScore = enhancedCompanyData[ticker].creditMetrics.score;
    const fluctuation = (Math.random() - 0.5) * 2;
    const currentScore = Math.max(0, Math.min(100, baseScore + fluctuation));
    
    const update = {
      ticker,
      score: Math.round(currentScore * 100) / 100,
      change: Math.round(fluctuation * 100) / 100,
      timestamp: new Date().toISOString()
    };
    
    res.write(`data: ${JSON.stringify(update)}\n\n`);
  };

  // Send updates every 5 seconds
  const interval = setInterval(sendUpdate, 5000);
  sendUpdate(); // Send immediate update

  // Clean up on client disconnect
  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});

// Utility functions
function calculateVolatility(scores) {
  if (scores.length < 2) return 0;
  
  const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
  return Math.sqrt(variance);
}

function calculateTrend(scores) {
  if (scores.length < 2) return 'stable';
  
  const first = scores[0];
  const last = scores[scores.length - 1];
  const change = ((last - first) / first) * 100;
  
  if (change > 2) return 'up';
  if (change < -2) return 'down';
  return 'stable';
}

function calculateOverallHealth(healthSummary) {
  let totalServices = 0;
  let healthyServices = 0;
  
  Object.values(healthSummary).forEach(service => {
    const total = service.healthy + service.degraded + service.offline;
    totalServices += total;
    healthyServices += service.healthy;
  });
  
  const healthPercentage = (healthyServices / totalServices) * 100;
  
  if (healthPercentage >= 90) return 'excellent';
  if (healthPercentage >= 75) return 'good';
  if (healthPercentage >= 50) return 'fair';
  return 'poor';
}

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Corporate Credit Intelligence API Server running on port ${PORT}`);
  logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔗 API Base URL: http://localhost:${PORT}/api`);
});

module.exports = app;