# TarefasNG

A modern SaaS task management application based on the Eisenhower Matrix methodology for prioritizing tasks by urgency and importance.

## 🎯 Features

### Eisenhower Matrix Implementation
- **Q1 (Do First)**: Urgent & Important tasks
- **Q2 (Schedule)**: Not Urgent but Important tasks  
- **Q3 (Delegate)**: Urgent but Not Important tasks
- **Q4 (Eliminate)**: Not Urgent and Not Important tasks

### Task Management
- ✅ Automatic classification into matrix quadrants
- ✅ Priority levels (Low, Medium, High, Critical)
- ✅ Due date tracking with overdue detection
- ✅ Task status management (Pending, In Progress, Completed, Cancelled)
- ✅ Tags and categorization
- ✅ Time estimation and tracking

### SaaS Features
- 🏢 Multi-tenant architecture
- 👥 User roles (Owner, Admin, User)
- 💳 Subscription management ready
- 🔐 JWT authentication
- 🔒 Secure API with rate limiting

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/wilvison/TarefasNG.git
   cd TarefasNG
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```

3. **Set up environment variables**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your MongoDB URI and other settings
   ```

4. **Start development servers**
   ```bash
   # From root directory
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 🏗️ Architecture

### Backend (Node.js + TypeScript + Express)
```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & validation
│   └── server.ts        # App entry point
```

**Key Features:**
- RESTful API design
- MongoDB with Mongoose ODM
- JWT authentication
- Multi-tenant data isolation
- Automatic task classification
- Express rate limiting

### Frontend (React + TypeScript + Tailwind CSS)
```
frontend/
├── src/
│   ├── components/      # React components
│   ├── services/        # API client
│   ├── types/          # TypeScript types
│   ├── context/        # React context
│   └── App.tsx         # Main component
```

**Key Features:**
- Responsive Eisenhower Matrix grid
- Modern UI with Tailwind CSS
- TypeScript for type safety
- Axios for API communication

## 📊 Eisenhower Matrix Logic

The system automatically classifies tasks based on:

```typescript
// Urgency calculation
isUrgent = dueDate <= (today + 3 days)

// Quadrant assignment
if (isUrgent && isImportant) → Q1 (Do First)
if (!isUrgent && isImportant) → Q2 (Schedule)  
if (isUrgent && !isImportant) → Q3 (Delegate)
if (!isUrgent && !isImportant) → Q4 (Eliminate)
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Tasks
- `GET /api/tasks` - List tasks with filtering
- `GET /api/tasks/quadrants` - Get tasks grouped by quadrant
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## 🗄️ Database Models

### Task Schema
```typescript
{
  title: string
  description?: string
  dueDate?: Date
  priority: 'low' | 'medium' | 'high' | 'critical'
  isUrgent: boolean (auto-calculated)
  isImportant: boolean
  eisenhowerQuadrant: 'Q1' | 'Q2' | 'Q3' | 'Q4' (auto-assigned)
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  tenantId: string (multi-tenant isolation)
  createdBy: string
  assignedTo?: string
  tags?: string[]
  estimatedTime?: number
  actualTime?: number
}
```

### User Schema
```typescript
{
  name: string
  email: string
  password: string (hashed)
  tenantId: string
  role: 'admin' | 'user' | 'owner'
  subscription: {
    plan: 'free' | 'pro' | 'enterprise'
    status: 'active' | 'inactive' | 'trial' | 'cancelled'
  }
}
```

## 🎨 UI Components

- **EisenhowerMatrix**: Main 2x2 grid layout
- **TaskCard**: Individual task display with actions
- **CreateTaskModal**: Task creation form
- **QuadrantView**: Each matrix quadrant

## 🚧 Roadmap

### Phase 1 ✅ (Current)
- [x] Core Eisenhower Matrix functionality
- [x] Task CRUD operations
- [x] Automatic classification
- [x] Multi-tenant architecture
- [x] Basic authentication

### Phase 2 (Next)
- [ ] Complete authentication flow
- [ ] User management
- [ ] Subscription billing (Stripe)
- [ ] Admin dashboard
- [ ] Team collaboration features

### Phase 3 (Future)
- [ ] Brazilian payment integration (Pagar.me)
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Integrations (Calendar, Email)
- [ ] AI-powered task prioritization

## 🛠️ Development

### Available Scripts

**Root:**
- `npm run dev` - Start both frontend and backend
- `npm run build` - Build both applications
- `npm run test` - Run all tests

**Frontend:**
- `npm start` - Development server
- `npm run build` - Production build
- `npm test` - Run tests

**Backend:**
- `npm run dev` - Development with hot reload
- `npm run build` - Compile TypeScript
- `npm start` - Production server

### Environment Variables

**Backend (.env):**
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/tarefas-ng
JWT_SECRET=your-super-secret-jwt-key
STRIPE_SECRET_KEY=sk_test_...
FRONTEND_URL=http://localhost:3000
```

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support, email support@tarefasng.com or join our Slack channel.

---

Built with ❤️ by the TarefasNG Team
