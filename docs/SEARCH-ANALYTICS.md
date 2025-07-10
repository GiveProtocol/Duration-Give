# Search Analytics and Monitoring Guide

## Overview

This guide provides comprehensive instructions for implementing analytics and monitoring for the Give Protocol documentation search functionality.

## Analytics Implementation

### Basic Search Tracking

#### Google Analytics 4 Integration
```javascript
// Add to documentation.html after the search functionality
function trackSearchEvent(query, resultCount, searchTime) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'search', {
      search_term: query,
      search_results: resultCount,
      search_time_ms: searchTime,
      page_title: document.title,
      page_location: window.location.href
    });
  }
}

// Add to performSearch function
function performSearch(query) {
  const startTime = performance.now();
  
  // ... existing search logic ...
  
  const endTime = performance.now();
  const searchTime = Math.round(endTime - startTime);
  
  // Track the search
  trackSearchEvent(query, results.length, searchTime);
}
```

#### Custom Analytics Integration
```javascript
// For other analytics platforms (Mixpanel, Adobe Analytics, etc.)
function trackCustomAnalytics(event, data) {
  // Mixpanel example
  if (typeof mixpanel !== 'undefined') {
    mixpanel.track(event, data);
  }
  
  // Adobe Analytics example
  if (typeof s !== 'undefined') {
    s.linkTrackVars = 'events,eVar1,eVar2';
    s.events = 'event1';
    s.eVar1 = data.search_term;
    s.eVar2 = data.search_results;
    s.tl(true, 'o', 'Documentation Search');
  }
  
  // Custom endpoint
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, data })
  }).catch(() => {}); // Silent fail
}
```

### Advanced Search Metrics

#### Search Quality Metrics
```javascript
function trackSearchQuality(query, results, userAction) {
  const metrics = {
    query: query,
    total_results: results.length,
    has_results: results.length > 0,
    query_length: query.length,
    query_words: query.split(' ').length,
    timestamp: new Date().toISOString(),
    user_action: userAction, // 'clicked', 'refined', 'abandoned'
    session_id: getSessionId()
  };
  
  // Track different quality indicators
  if (results.length === 0) {
    trackCustomAnalytics('search_no_results', metrics);
  } else if (results.length === 1) {
    trackCustomAnalytics('search_single_result', metrics);
  } else {
    trackCustomAnalytics('search_multiple_results', metrics);
  }
}
```

#### User Interaction Tracking
```javascript
// Track which search results users click
function trackResultClick(result, position, query) {
  const clickData = {
    search_term: query,
    result_title: result.title,
    result_url: result.url,
    result_position: position,
    result_category: result.category,
    click_timestamp: new Date().toISOString()
  };
  
  trackCustomAnalytics('search_result_click', clickData);
}

// Add click tracking to search results
function renderSearchResults(results, query) {
  return results.map((result, index) => `
    <div class="docs-search-item" 
         onclick="handleResultClick('${result.url}', ${index}, '${query}', ${JSON.stringify(result).replace(/'/g, '\\'')}')">
      <!-- result content -->
    </div>
  `).join('');
}

function handleResultClick(url, position, query, result) {
  trackResultClick(result, position, query);
  window.location.href = url;
}
```

## Performance Monitoring

### Search Performance Metrics

#### Response Time Monitoring
```javascript
class SearchPerformanceMonitor {
  constructor() {
    this.metrics = {
      searchTimes: [],
      loadTimes: [],
      errorCount: 0,
      totalSearches: 0
    };
  }
  
  recordSearchTime(duration) {
    this.metrics.searchTimes.push(duration);
    this.metrics.totalSearches++;
    
    // Keep only last 100 measurements
    if (this.metrics.searchTimes.length > 100) {
      this.metrics.searchTimes.shift();
    }
    
    // Alert if performance degrades
    if (duration > 100) { // ms
      console.warn(`Slow search detected: ${duration}ms`);
      this.trackPerformanceIssue('slow_search', duration);
    }
  }
  
  recordLoadTime(duration) {
    this.metrics.loadTimes.push(duration);
    
    if (duration > 5000) { // 5 seconds
      console.warn(`Slow search index load: ${duration}ms`);
      this.trackPerformanceIssue('slow_load', duration);
    }
  }
  
  recordError(error) {
    this.metrics.errorCount++;
    console.error('Search error:', error);
    this.trackPerformanceIssue('search_error', error.message);
  }
  
  getAverageSearchTime() {
    const times = this.metrics.searchTimes;
    return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  }
  
  trackPerformanceIssue(type, details) {
    trackCustomAnalytics('search_performance_issue', {
      issue_type: type,
      details: details,
      avg_search_time: this.getAverageSearchTime(),
      total_searches: this.metrics.totalSearches,
      error_rate: this.metrics.errorCount / this.metrics.totalSearches
    });
  }
}

const performanceMonitor = new SearchPerformanceMonitor();
```

#### Real User Monitoring (RUM)
```javascript
// Monitor real user search experience
function initializeRUM() {
  // Track Core Web Vitals impact
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          trackCustomAnalytics('page_performance', {
            load_time: entry.loadEventEnd - entry.loadEventStart,
            dom_content_loaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
            has_search: document.getElementById('search-input') !== null
          });
        }
      });
    });
    observer.observe({ entryTypes: ['navigation'] });
  }
  
  // Track search-specific timing
  window.addEventListener('load', () => {
    const searchLoadStart = performance.now();
    
    // Measure search index load time
    fetch('./search.json')
      .then(() => {
        const searchLoadEnd = performance.now();
        performanceMonitor.recordLoadTime(searchLoadEnd - searchLoadStart);
      })
      .catch((error) => {
        performanceMonitor.recordError(error);
      });
  });
}
```

## Error Monitoring

### Error Tracking and Alerting

#### JavaScript Error Monitoring
```javascript
// Catch and report search-related errors
window.addEventListener('error', (event) => {
  if (event.filename && event.filename.includes('search')) {
    trackCustomAnalytics('search_javascript_error', {
      message: event.message,
      filename: event.filename,
      line: event.lineno,
      column: event.colno,
      stack: event.error ? event.error.stack : null
    });
  }
});

// Promise rejection handling
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.toString().includes('search')) {
    trackCustomAnalytics('search_promise_rejection', {
      reason: event.reason.toString(),
      stack: event.reason.stack || null
    });
  }
});
```

#### Network Error Monitoring
```javascript
function monitorNetworkErrors() {
  const originalFetch = window.fetch;
  
  window.fetch = function(...args) {
    return originalFetch.apply(this, args)
      .then(response => {
        // Monitor search.json requests specifically
        if (args[0].includes('search.json')) {
          if (!response.ok) {
            trackCustomAnalytics('search_network_error', {
              status: response.status,
              statusText: response.statusText,
              url: args[0]
            });
          }
        }
        return response;
      })
      .catch(error => {
        if (args[0].includes('search.json')) {
          trackCustomAnalytics('search_fetch_error', {
            error: error.message,
            url: args[0]
          });
        }
        throw error;
      });
  };
}
```

## Data Collection and Storage

### Data Schema

#### Search Event Schema
```json
{
  "event_type": "search",
  "timestamp": "2025-07-09T21:00:00.000Z",
  "session_id": "abc123def456",
  "user_id": "anonymous_user_789",
  "search_data": {
    "query": "volunteer opportunities",
    "query_normalized": "volunteer opportunities",
    "query_length": 21,
    "query_words": 2,
    "result_count": 5,
    "response_time_ms": 45,
    "has_results": true,
    "top_result": {
      "title": "Volunteer Safety",
      "url": "/safety-security/volunteer-safety/",
      "category": "Documentation",
      "relevance_score": 67
    }
  },
  "context": {
    "page_url": "https://docs.giveprotocol.io/",
    "page_title": "Give Protocol Documentation",
    "user_agent": "Mozilla/5.0...",
    "referrer": "https://giveprotocol.io",
    "language": "en-US",
    "screen_resolution": "1920x1080",
    "viewport_size": "1200x800"
  }
}
```

#### Click Event Schema
```json
{
  "event_type": "search_result_click",
  "timestamp": "2025-07-09T21:00:05.000Z",
  "session_id": "abc123def456",
  "search_id": "search_xyz789",
  "click_data": {
    "result_position": 1,
    "result_title": "Volunteer Safety",
    "result_url": "/safety-security/volunteer-safety/",
    "result_category": "Documentation",
    "time_to_click_ms": 5000,
    "original_query": "volunteer opportunities"
  }
}
```

### Data Storage Options

#### Local Storage (Development)
```javascript
class LocalAnalyticsStorage {
  constructor() {
    this.storageKey = 'docs_search_analytics';
  }
  
  store(event) {
    const existing = this.getAll();
    existing.push({
      ...event,
      id: this.generateId(),
      stored_at: new Date().toISOString()
    });
    
    // Keep only last 1000 events
    if (existing.length > 1000) {
      existing.splice(0, existing.length - 1000);
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(existing));
  }
  
  getAll() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    } catch {
      return [];
    }
  }
  
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
```

#### Remote Analytics Service
```javascript
class RemoteAnalyticsService {
  constructor(endpoint, apiKey) {
    this.endpoint = endpoint;
    this.apiKey = apiKey;
    this.batchSize = 10;
    this.batch = [];
    this.flushInterval = 30000; // 30 seconds
    
    this.startBatchFlush();
  }
  
  track(event) {
    this.batch.push({
      ...event,
      api_key: this.apiKey,
      timestamp: new Date().toISOString()
    });
    
    if (this.batch.length >= this.batchSize) {
      this.flush();
    }
  }
  
  flush() {
    if (this.batch.length === 0) return;
    
    const payload = {
      events: [...this.batch],
      metadata: {
        source: 'documentation_search',
        version: '1.0.0',
        user_agent: navigator.userAgent
      }
    };
    
    fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey
      },
      body: JSON.stringify(payload)
    }).catch(error => {
      console.warn('Analytics tracking failed:', error);
    });
    
    this.batch = [];
  }
  
  startBatchFlush() {
    setInterval(() => this.flush(), this.flushInterval);
    
    // Flush on page unload
    window.addEventListener('beforeunload', () => this.flush());
  }
}
```

## Dashboard and Reporting

### Analytics Dashboard Queries

#### Most Popular Search Queries
```sql
SELECT 
  search_term,
  COUNT(*) as search_count,
  AVG(result_count) as avg_results,
  AVG(response_time_ms) as avg_response_time
FROM search_events 
WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY search_term
ORDER BY search_count DESC
LIMIT 20;
```

#### Search Success Rate
```sql
SELECT 
  DATE(timestamp) as date,
  COUNT(*) as total_searches,
  SUM(CASE WHEN result_count > 0 THEN 1 ELSE 0 END) as successful_searches,
  (SUM(CASE WHEN result_count > 0 THEN 1 ELSE 0 END) / COUNT(*)) * 100 as success_rate
FROM search_events
WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY DATE(timestamp)
ORDER BY date;
```

#### Performance Trends
```sql
SELECT 
  DATE(timestamp) as date,
  AVG(response_time_ms) as avg_response_time,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_time_ms) as p95_response_time,
  MAX(response_time_ms) as max_response_time
FROM search_events
WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(timestamp)
ORDER BY date;
```

### Key Performance Indicators (KPIs)

#### Search Health Metrics
- **Search Success Rate**: % of searches returning results (target: >85%)
- **Average Response Time**: Time to return results (target: <100ms)
- **Error Rate**: % of failed searches (target: <1%)
- **User Engagement**: % of searches leading to clicks (target: >60%)

#### Content Discovery Metrics
- **Coverage**: % of pages found via search vs direct navigation
- **Popular Content**: Most searched and clicked pages
- **Content Gaps**: Frequently searched terms with no/poor results
- **Search Depth**: Average number of searches per session

#### Technical Performance Metrics
- **Index Load Time**: Time to load search.json (target: <2s)
- **Memory Usage**: Client-side memory consumption (target: <1MB)
- **Cache Hit Rate**: % of cached vs fresh search.json requests
- **Mobile Performance**: Search performance on mobile devices

## Implementation Guide

### Getting Started

1. **Choose Analytics Platform**
   - Google Analytics 4 (free, comprehensive)
   - Mixpanel (advanced user analytics)
   - Custom solution (full control)

2. **Implement Basic Tracking**
   ```javascript
   // Add to documentation.html
   <script>
   // Insert analytics code here
   </script>
   ```

3. **Set Up Error Monitoring**
   - Sentry, Bugsnag, or custom error tracking
   - Alert thresholds for critical issues

4. **Create Dashboard**
   - Use analytics platform dashboard
   - Or build custom dashboard with charts

### Maintenance Tasks

#### Daily
- Monitor error alerts
- Check performance metrics

#### Weekly  
- Review popular search queries
- Analyze user behavior patterns
- Check for new error patterns

#### Monthly
- Generate comprehensive report
- Optimize based on usage patterns
- Update search relevance based on clicks

#### Quarterly
- Performance optimization review
- Content gap analysis
- User experience improvements

## Privacy and Compliance

### Privacy Considerations

#### Data Minimization
- Collect only necessary search data
- Anonymous user tracking when possible
- Regular data cleanup and retention policies

#### GDPR Compliance
```javascript
// Check for user consent before tracking
function shouldTrackAnalytics() {
  // Check for consent cookie/localStorage
  return localStorage.getItem('analytics_consent') === 'true' ||
         getCookie('analytics_consent') === 'true';
}

function trackSearchEvent(query, results) {
  if (!shouldTrackAnalytics()) {
    return; // Don't track without consent
  }
  
  // Proceed with tracking
}
```

#### Data Retention
- Search queries: 90 days
- Performance metrics: 1 year  
- Error logs: 6 months
- Aggregated reports: Indefinite

### Security Best Practices

- Sanitize all search input before logging
- Use HTTPS for all analytics endpoints
- Encrypt sensitive analytics data
- Implement rate limiting on analytics endpoints
- Regular security audits of tracking code

---

**With proper analytics and monitoring, you can continuously improve the search experience and ensure optimal performance for your users.**