# Corporate Credit Intelligence API - Environment Configuration

# Server Configuration
NODE_ENV=development
PORT=3000
HOST=localhost

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/credtech_db
REDIS_URL=redis://localhost:6379

# API Keys and External Services
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
FINANCIAL_MODELING_PREP_KEY=your_fmp_key_here
NEWS_API_KEY=your_news_api_key_here
TWITTER_BEARER_TOKEN=your_twitter_bearer_token_here
SEC_EDGAR_API_KEY=your_sec_edgar_key_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_characters
JWT_EXPIRE=24h
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
REFRESH_TOKEN_EXPIRE=7d

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=1000

# Email Configuration (for alerts and notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
FROM_EMAIL=noreply@credtech.ai
FROM_NAME=CreditTech Platform

# Logging Configuration
LOG_LEVEL=info
LOG_FILE_PATH=./logs/

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,https://monish07236.github.io

# ML Model Configuration
MODEL_UPDATE_INTERVAL=3600000
MODEL_VERSION=v1.2.0
PREDICTION_CONFIDENCE_THRESHOLD=0.75

# Cache Configuration
CACHE_TTL=300
CACHE_CHECK_PERIOD=60

# Monitoring and Analytics
SENTRY_DSN=your_sentry_dsn_here
GOOGLE_ANALYTICS_ID=your_ga_tracking_id_here
NEW_RELIC_LICENSE_KEY=your_new_relic_key_here

# Feature Flags
ENABLE_REAL_TIME_UPDATES=true
ENABLE_ML_PREDICTIONS=true
ENABLE_SOCIAL_SENTIMENT=true
ENABLE_NEWS_ANALYSIS=true
ENABLE_WEBHOOK_NOTIFICATIONS=false

# Security Configuration
BCRYPT_ROUNDS=12
SESSION_SECRET=your_session_secret_here
CORS_CREDENTIALS=true

# Development Only
DEBUG_MODE=true
MOCK_DATA_ENABLED=true
API_DOCS_ENABLED=true