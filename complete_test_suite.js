const request = require('supertest');
const app = require('../server');

describe('Corporate Credit Intelligence API', () => {
  
  describe('Health Endpoints', () => {
    test('GET /api/health should return healthy status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('version');
    });
  });

  describe('Companies Endpoints', () => {
    test('GET /api/companies should return list of companies', async () => {
      const response = await request(app)
        .get('/api/companies')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0]).toHaveProperty('ticker');
      expect(response.body.data[0]).toHaveProperty('name');
    });

    test('GET /api/company/AAPL should return Apple data', async () => {
      const response = await request(app)
        .get('/api/company/AAPL')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('companyInfo');
      expect(response.body.data).toHaveProperty('creditMetrics');
      expect(response.body.data.companyInfo.ticker).toBe('AAPL');
    });

    test('GET /api/company/INVALID should return 404', async () => {
      const response = await request(app)
        .get('/api/company/INVALID')
        .expect(404);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });
  });

  describe('Real-time Score Endpoints', () => {
    test('GET /api/company/AAPL/score should return score data', async () => {
      const response = await request(app)
        .get('/api/company/AAPL/score')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('score');
      expect(response.body.data).toHaveProperty('change');
      expect(response.body.data).toHaveProperty('ticker', 'AAPL');
      expect(typeof response.body.data.score).toBe('number');
    });

    test('GET /api/company/INVALID/score should return 404', async () => {
      const response = await request(app)
        .get('/api/company/INVALID/score')
        .expect(404);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });
  });

  describe('Risk Drivers Endpoints', () => {
    test('GET /api/company/AAPL/drivers should return risk drivers', async () => {
      const response = await request(app)
        .get('/api/company/AAPL/drivers')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.drivers)).toBe(true);
      expect(response.body.data).toHaveProperty('summary');
      expect(response.body.data.summary).toHaveProperty('total');
      expect(response.body.data.summary).toHaveProperty('positive');
      expect(response.body.data.summary).toHaveProperty('negative');
    });

    test('GET /api/company/INVALID/drivers should return 404', async () => {
      const response = await request(app)
        .get('/api/company/INVALID/drivers')
        .expect(404);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });
  });

  describe('Market Events Endpoints', () => {
    test('GET /api/company/AAPL/events should return market events', async () => {
      const response = await request(app)
        .get('/api/company/AAPL/events')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.events)).toBe(true);
      expect(response.body.data).toHaveProperty('summary');
    });

    test('GET /api/company/AAPL/events with date filter should work', async () => {
      const response = await request(app)
        .get('/api/company/AAPL/events?startDate=2024-01-01&endDate=2024-12-31')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.events)).toBe(true);
    });
  });

  describe('Historical Data Endpoints', () => {
    test('GET /api/company/AAPL/history should return historical scores', async () => {
      const response = await request(app)
        .get('/api/company/AAPL/history')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.history)).toBe(true);
      expect(response.body.data).toHaveProperty('analytics');
      expect(response.body.data.analytics).toHaveProperty('averageScore');
    });

    test('GET /api/company/AAPL/history?days=30 should respect days parameter', async () => {
      const response = await request(app)
        .get('/api/company/AAPL/history?days=30')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.history)).toBe(true);
      // Should return approximately 30 days of data (allowing for weekends/holidays)
      expect(response.body.data.history.length).toBeLessThanOrEqual(30);
    });

    test('GET /api/company/AAPL/history with invalid days parameter should handle gracefully', async () => {
      const response = await request(app)
        .get('/api/company/AAPL/history?days=invalid')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      // Should default to standard history length when invalid parameter is provided
    });

    test('GET /api/company/INVALID/history should return 404', async () => {
      const response = await request(app)
        .get('/api/company/INVALID/history')
        .expect(404);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });
  });

  describe('Comparison Endpoints', () => {
    test('GET /api/compare?companies=AAPL,MSFT should return comparison data', async () => {
      const response = await request(app)
        .get('/api/compare?companies=AAPL,MSFT')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.companies)).toBe(true);
      expect(response.body.data.companies).toHaveLength(2);
      expect(response.body.data).toHaveProperty('comparison');
    });

    test('GET /api/compare with missing companies parameter should return 400', async () => {
      const response = await request(app)
        .get('/api/compare')
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('companies parameter required');
    });
  });

  describe('Watchlist Endpoints', () => {
    test('GET /api/watchlist should return watchlist', async () => {
      const response = await request(app)
        .get('/api/watchlist')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.companies)).toBe(true);
    });

    test('POST /api/watchlist should add company to watchlist', async () => {
      const response = await request(app)
        .post('/api/watchlist')
        .send({ ticker: 'AAPL' })
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('added to watchlist');
    });

    test('DELETE /api/watchlist/AAPL should remove company from watchlist', async () => {
      const response = await request(app)
        .delete('/api/watchlist/AAPL')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('removed from watchlist');
    });
  });

  describe('Error Handling', () => {
    test('GET /api/nonexistent-endpoint should return 404', async () => {
      const response = await request(app)
        .get('/api/nonexistent-endpoint')
        .expect(404);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    test('Should handle malformed requests gracefully', async () => {
      const response = await request(app)
        .post('/api/watchlist')
        .send({ invalid: 'data' })
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('Rate Limiting', () => {
    test('Should respect rate limits', async () => {
      // Make multiple rapid requests to test rate limiting
      const promises = Array(10).fill().map(() => 
        request(app).get('/api/health')
      );
      
      const responses = await Promise.all(promises);
      
      // All requests should complete successfully for health endpoint
      responses.forEach(response => {
        expect([200, 429]).toContain(response.status);
      });
    });
  });

  describe('Performance Tests', () => {
    test('Response time should be reasonable', async () => {
      const start = Date.now();
      
      await request(app)
        .get('/api/company/AAPL/score')
        .expect(200);
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(5000); // Should respond within 5 seconds
    });
  });
});