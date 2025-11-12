# Project Structure

## Updated File Structure

```
bt/
├── server/
│   ├── config/
│   │   └── database.js              # MongoDB connection configuration
│   ├── middleware/
│   │   └── auth.js                   # JWT authentication middleware
│   ├── models/
│   │   ├── Transaction.js           # Transaction schema (updated with category, date, userId)
│   │   ├── User.js                   # User schema (new)
│   │   └── Budget.js                 # Budget schema (new)
│   ├── routes/
│   │   ├── auth.js                   # Authentication routes (signup, login, me)
│   │   ├── transactions.js           # Transaction CRUD + filters + stats
│   │   ├── budgets.js                # Budget management + progress tracking
│   │   ├── analytics.js              # Analytics data endpoints
│   │   └── reports.js                # Report generation + CSV export
│   └── server.js                      # Main Express server (refactored)
│
├── public/
│   ├── js/
│   │   ├── api.js                    # API communication helper (centralized)
│   │   ├── auth.js                   # Authentication logic
│   │   ├── transactions.js           # Transaction management UI
│   │   ├── analytics.js              # Chart.js integration + analytics
│   │   ├── budgets.js                 # Budget management UI
│   │   ├── reports.js                 # Reports and CSV export
│   │   └── theme.js                   # Dark/light mode toggle
│   ├── index.html                    # Main HTML (completely redesigned)
│   ├── style.css                     # Modern CSS with dark mode support
│   └── script.js                      # Main app initialization
│
├── package.json                       # Updated with new dependencies
├── .gitignore                         # Git ignore file
├── README.md                          # Comprehensive documentation
└── PROJECT_STRUCTURE.md               # This file
```

## MongoDB Schema Updates

### Transaction Schema (Updated)
```javascript
{
  userId: ObjectId,        // NEW: Links to User
  description: String,
  amount: Number,
  type: 'income' | 'expense',
  category: String,        // NEW: Transaction category
  date: Date,              // NEW: Transaction date
  createdAt: Date
}
```

### User Schema (New)
```javascript
{
  username: String (unique),
  password: String (hashed),
  email: String (optional),
  createdAt: Date
}
```

### Budget Schema (New)
```javascript
{
  userId: ObjectId,
  category: String,
  amount: Number,
  period: 'monthly' | 'yearly',
  month: Number (1-12, optional),
  year: Number,
  createdAt: Date
}
```

## Key Changes Summary

### Backend
1. ✅ Modular route structure (`/routes`)
2. ✅ Authentication system with JWT
3. ✅ User-specific data isolation
4. ✅ Enhanced transaction model (category, date, userId)
5. ✅ Budget management system
6. ✅ Analytics endpoints
7. ✅ Report generation and CSV export
8. ✅ Centralized database configuration

### Frontend
1. ✅ Complete UI redesign with modern styling
2. ✅ Dark/light mode support
3. ✅ Modular JavaScript (ES6 modules)
4. ✅ Chart.js integration for analytics
5. ✅ Transaction filtering and search
6. ✅ Budget progress visualization
7. ✅ Responsive design
8. ✅ Authentication UI (login/signup modal)

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Transactions
- `GET /api/transactions` - List transactions (with filters)
- `GET /api/transactions/:id` - Get transaction
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/stats/summary` - Get summary stats
- `GET /api/transactions/categories/list` - List categories

### Budgets
- `GET /api/budgets` - List budgets
- `GET /api/budgets/:id` - Get budget
- `POST /api/budgets` - Create/update budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget
- `GET /api/budgets/progress/current` - Get budget progress

### Analytics
- `GET /api/analytics/monthly-comparison` - Monthly income vs expense
- `GET /api/analytics/category-expenses` - Category breakdown
- `GET /api/analytics/spending-trends` - Spending trends
- `GET /api/analytics/top-categories` - Top spending categories

### Reports
- `GET /api/reports/export/csv` - Export to CSV
- `GET /api/reports/monthly` - Monthly report
- `GET /api/reports/yearly` - Yearly report

## Next Steps for Deployment

1. **Set up MongoDB Atlas** (if not using local)
   - Create account at mongodb.com/cloud/atlas
   - Create cluster and get connection string
   - Update MONGODB_URI in .env

2. **Deploy Backend** (Render/Heroku/Railway)
   - Push code to GitHub
   - Connect repository
   - Set environment variables:
     - `MONGODB_URI`
     - `JWT_SECRET` (strong random string)
     - `PORT` (usually auto-set)

3. **Deploy Frontend** (Netlify/Vercel)
   - Update `API_BASE_URL` in `public/js/api.js` to production URL
   - Deploy `public` folder or build static files
   - Configure CORS on backend if needed

4. **Security Checklist**
   - ✅ Change JWT_SECRET in production
   - ✅ Use HTTPS
   - ✅ Add rate limiting (consider express-rate-limit)
   - ✅ Validate all inputs
   - ✅ Use environment variables for secrets

## Development Commands

```bash
# Install dependencies
npm install

# Start server (production)
npm start

# Start server (development with auto-reload)
npm run dev
```

## Testing the Application

1. Start MongoDB (local or use Atlas)
2. Run `npm install` to install dependencies
3. Create `.env` file with MongoDB URI and JWT_SECRET
4. Run `npm start` or `npm run dev`
5. Open `http://localhost:3000`
6. Create an account
7. Start adding transactions and budgets!

