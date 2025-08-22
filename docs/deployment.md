# Deployment Guide - TarefasNG

## Azure Static Web Apps Deployment

This project is configured for Azure Static Web Apps deployment with the existing GitHub Actions workflow.

### Frontend (Static Web App)

The frontend React application is built and deployed as a static web app.

**Build Settings:**
- App location: `/frontend`
- Output location: `build`
- Build command: `npm run build`

### Backend API (Mock Setup)

Currently using mock data for demonstration. For production deployment:

1. **Set up MongoDB Atlas** or Azure Cosmos DB
2. **Deploy backend API** to Azure Functions or Azure App Service
3. **Update environment variables** in frontend

### Environment Variables

**Frontend (.env):**
```env
REACT_APP_API_URL=https://your-backend-api.azurewebsites.net/api
```

**Backend (.env):**
```env
NODE_ENV=production
PORT=80
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tarefas-ng
JWT_SECRET=your-production-jwt-secret
STRIPE_SECRET_KEY=sk_live_your_stripe_secret
FRONTEND_URL=https://your-app.azurestaticapps.net
```

## Local Development

### Prerequisites
- Node.js 16+
- MongoDB (or use mock data)
- Git

### Setup
1. Clone repository
2. Install dependencies: `npm install && cd frontend && npm install && cd ../backend && npm install`
3. Set up environment variables
4. Start development: `npm run dev` (from root)

### Development URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Production Considerations

### Security
- Use HTTPS for all communications
- Implement proper JWT token rotation
- Set up rate limiting and DDoS protection
- Use Azure Key Vault for secrets

### Database
- Set up MongoDB Atlas with proper indexing
- Configure database backup and recovery
- Implement data retention policies

### Monitoring
- Set up Application Insights
- Configure error tracking and logging
- Implement health check endpoints

### Performance
- Enable CDN for static assets
- Implement caching strategies
- Use compression middleware
- Optimize database queries

## CI/CD Pipeline

The project includes GitHub Actions workflow for automatic deployment:

1. **On Push to Main:**
   - Frontend builds and deploys to Azure Static Web Apps
   - Backend can be deployed to Azure Functions/App Service

2. **Environment Management:**
   - Development: Feature branches
   - Staging: Staging branch
   - Production: Main branch

## Scaling Considerations

### Multi-Tenant Architecture
- Each tenant has isolated data via `tenantId`
- Horizontal scaling supported
- Database sharding can be implemented

### Load Balancing
- Azure Load Balancer for backend services
- Multiple backend instances supported
- Session-less design for easy scaling