# Backend Performance Optimization Guide

## Current Performance Issues Identified

### 1. **Database Connection Issues**
- No connection pooling configuration
- Database connection established on every request
- Missing connection optimization settings

### 2. **Email Service Bottlenecks**
- Email sending is synchronous and blocking
- No email queue system
- Connection timeouts causing delays

### 3. **Missing Caching**
- No Redis or in-memory caching
- Repeated database queries for same data
- No query result caching

### 4. **GraphQL Performance Issues**
- No DataLoader implementation
- Potential N+1 query problems
- Missing query complexity limits

### 5. **Deployment Configuration**
- Using free Render plan (limited resources)
- No performance monitoring
- Missing compression and optimization

## Optimization Solutions

### Phase 1: Database Optimization (Immediate Impact)

#### 1.1 Optimize MongoDB Connection
```typescript
// Enhanced database connection with pooling
const mongoose = require('mongoose');

const connectToDb = async () => {
  try {
    const options = {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false, // Disable mongoose buffering
    };
    
    await mongoose.connect(process.env.MONGODB_URL, options);
    console.log('✅ Connected to MongoDB with optimized settings');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    throw error;
  }
};
```

#### 1.2 Add Database Indexes
```javascript
// Add these indexes to improve query performance
db.users.createIndex({ "email": 1 }, { unique: true, sparse: true })
db.users.createIndex({ "userName": 1 }, { unique: true })
db.users.createIndex({ "createdAt": -1 })
db.users.createIndex({ "role": 1 })
db.reports.createIndex({ "userId": 1 })
db.reports.createIndex({ "psychologistId": 1 })
db.reports.createIndex({ "createdAt": -1 })
```

### Phase 2: Email Optimization (High Impact)

#### 2.1 Make Email Sending Asynchronous
```typescript
// Queue-based email system
export const sendOTPEmailAsync = async (email: string, otp: string): Promise<void> => {
  // Don't wait for email to be sent
  setImmediate(async () => {
    try {
      await sendEmailWithRetry(mailOptions);
      console.log(`✅ OTP email sent to ${email}`);
    } catch (error) {
      console.error(`❌ Failed to send OTP to ${email}:`, error);
      // Could store failed emails for retry later
    }
  });
};
```

#### 2.2 Add Email Queue System
```typescript
// Simple in-memory queue for emails
class EmailQueue {
  private queue: Array<{email: string, otp: string, type: 'otp' | 'verification'}> = [];
  private processing = false;

  async add(email: string, otp: string, type: 'otp' | 'verification') {
    this.queue.push({ email, otp, type });
    if (!this.processing) {
      this.processQueue();
    }
  }

  private async processQueue() {
    this.processing = true;
    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (item) {
        try {
          if (item.type === 'otp') {
            await sendOTPEmail(item.email, item.otp);
          } else {
            await sendVerificationEmail(item.email, item.otp);
          }
        } catch (error) {
          console.error('Email queue processing error:', error);
        }
      }
    }
    this.processing = false;
  }
}
```

### Phase 3: GraphQL Optimization (Medium Impact)

#### 3.1 Implement DataLoader
```typescript
// Prevent N+1 queries
import DataLoader from 'dataloader';

const userLoader = new DataLoader(async (userIds: string[]) => {
  const users = await User.find({ _id: { $in: userIds } });
  return userIds.map(id => users.find(user => user._id.toString() === id));
});

const reportLoader = new DataLoader(async (userIds: string[]) => {
  const reports = await Report.find({ userId: { $in: userIds } });
  return userIds.map(id => reports.filter(report => report.userId.toString() === id));
});
```

#### 3.2 Add Query Complexity Limits
```typescript
// Prevent expensive queries
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    {
      requestDidStart() {
        return {
          didResolveOperation({ request, operation }) {
            const complexity = calculateComplexity(request);
            if (complexity > 1000) {
              throw new GraphQLError('Query too complex', {
                extensions: { code: 'QUERY_TOO_COMPLEX' }
              });
            }
          }
        };
      }
    }
  ]
});
```

### Phase 4: Caching Implementation (High Impact)

#### 4.1 Add Redis Caching
```typescript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Cache user data
export const getCachedUser = async (userId: string) => {
  const cached = await redis.get(`user:${userId}`);
  if (cached) return JSON.parse(cached);
  
  const user = await User.findById(userId);
  if (user) {
    await redis.setex(`user:${userId}`, 300, JSON.stringify(user)); // 5 min cache
  }
  return user;
};
```

#### 4.2 Query Result Caching
```typescript
// Cache expensive queries
export const getCachedReports = async (userId: string) => {
  const cacheKey = `reports:${userId}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const reports = await Report.find({ userId });
  await redis.setex(cacheKey, 600, JSON.stringify(reports)); // 10 min cache
  return reports;
};
```

### Phase 5: Deployment Optimization

#### 5.1 Upgrade Render Plan
- Move from Free to Starter plan ($7/month)
- Get dedicated resources and better performance
- Remove cold start issues

#### 5.2 Add Performance Monitoring
```typescript
// Add request timing middleware
const performanceMiddleware = (req: NextRequest) => {
  const start = Date.now();
  
  req.headers.set('x-request-start', start.toString());
  
  return (response: Response) => {
    const duration = Date.now() - start;
    console.log(`⏱️ Request completed in ${duration}ms`);
    
    if (duration > 1000) {
      console.warn(`🐌 Slow request detected: ${duration}ms`);
    }
    
    response.headers.set('x-response-time', duration.toString());
    return response;
  };
};
```

## Implementation Priority

### 🔥 **Immediate (Do First)**
1. Optimize database connection pooling
2. Make email sending asynchronous
3. Add database indexes
4. Upgrade Render plan

### ⚡ **High Priority (This Week)**
1. Implement email queue system
2. Add basic caching for user data
3. Add performance monitoring
4. Optimize GraphQL queries

### 📈 **Medium Priority (Next Week)**
1. Implement DataLoader
2. Add Redis caching
3. Add query complexity limits
4. Optimize image handling

### 🚀 **Long Term (Next Month)**
1. Implement CDN for static assets
2. Add database read replicas
3. Implement horizontal scaling
4. Add advanced monitoring and alerting

## Expected Performance Improvements

- **Database queries**: 50-70% faster
- **Email sending**: Non-blocking (immediate response)
- **API response times**: 60-80% improvement
- **Cold starts**: Eliminated with dedicated resources
- **Overall user experience**: Significantly better

## Monitoring and Metrics

Track these key metrics:
- API response times
- Database query performance
- Memory usage
- Error rates
- Email delivery success rates

## Cost Considerations

- Render Starter plan: $7/month
- Redis addon: $3-10/month
- Total additional cost: ~$10-17/month
- Performance improvement: 5-10x better user experience
