# Budget Tracker - Personal Finance Manager

A comprehensive personal budget tracking application with advanced features including analytics, budgeting, reports, and user authentication.

## Features

### 🧩 Core Features
- ✅ **Transaction Management**: Add, edit, delete income and expense transactions
- ✅ **Categories**: Organize transactions by custom categories (Food, Rent, Bills, Salary, etc.)
- ✅ **Filtering**: Filter transactions by date range, type, and category
- ✅ **Search**: Quick search through transaction descriptions and categories
- ✅ **Real-time Summaries**: Dynamic display of total income, expenses, and balance

### 📊 Analytics Dashboard
- **Monthly Income vs Expense**: Bar chart comparing income and expenses by month
- **Category-wise Expenses**: Pie chart showing expense distribution by category
- **Spending Trends**: Line chart tracking daily spending patterns
- **Top Categories**: List of highest spending categories

### 🎯 Budgeting & Goals
- Set monthly or yearly budgets by category
- Visual progress bars showing budget utilization
- Color-coded alerts when spending exceeds budget limits
- Track remaining budget amounts

### 🔔 Reminders & Notifications
- Budget alerts when categories exceed limits
- Visual indicators for over-budget categories

### 🧾 Reports & Data Export
- **Monthly Reports**: Detailed breakdown of income, expenses, and savings by month
- **Yearly Reports**: Comprehensive annual financial summary with monthly breakdown
- **CSV Export**: Export all transactions to CSV format

### 🧠 Smart Insights
- Top spending categories identification
- Spending trend analysis
- Budget progress tracking

### 🪪 Authentication & Security
- User signup and login system
- JWT-based session management
- Password hashing with bcrypt
- User-specific data isolation

### 🌐 UI/UX Features
- Modern, responsive design
- Dark/Light mode toggle
- Clean typography and spacing
- Mobile-friendly interface
- Smooth animations and transitions

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing

### Frontend
- **Vanilla JavaScript** (ES6 modules)
- **Chart.js** for data visualization
- **CSS3** with CSS Variables for theming
- **Responsive Design**

## Project Structure

```
bt/
├── server/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── models/
│   │   ├── Transaction.js        # Transaction schema
│   │   ├── User.js               # User schema
│   │   └── Budget.js             # Budget schema
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   ├── transactions.js       # Transaction CRUD routes
│   │   ├── budgets.js            # Budget management routes
│   │   ├── analytics.js          # Analytics data routes
│   │   └── reports.js            # Report generation routes
│   └── server.js                  # Main server file
├── public/
│   ├── js/
│   │   ├── api.js                # API communication helper
│   │   ├── auth.js               # Authentication logic
│   │   ├── transactions.js        # Transaction management
│   │   ├── analytics.js          # Charts and analytics
│   │   ├── budgets.js            # Budget management
│   │   ├── reports.js            # Reports and export
│   │   └── theme.js              # Dark/light mode
│   ├── index.html                # Main HTML file
│   ├── style.css                 # Styles with dark mode
│   └── script.js                 # Main app initialization
├── package.json
└── README.md
```

## MongoDB Schemas

### User
```javascript
{
  username: String (unique, required),
  password: String (hashed, required),
  email: String (optional),
  createdAt: Date
}
```

### Transaction
```javascript
{
  userId: ObjectId (ref: User, required),
  description: String (required),
  amount: Number (required, min: 0),
  type: String (enum: ['income', 'expense'], required),
  category: String (required),
  date: Date (required),
  createdAt: Date
}
```

### Budget
```javascript
{
  userId: ObjectId (ref: User, required),
  category: String (required),
  amount: Number (required, min: 0),
  period: String (enum: ['monthly', 'yearly'], default: 'monthly'),
  month: Number (1-12, optional),
  year: Number (required),
  createdAt: Date
}
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### Steps

1. **Clone or navigate to the project directory**
   ```bash
   cd bt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Update `MONGODB_URI` with your MongoDB connection string
   - Change `JWT_SECRET` to a secure random string

4. **Start MongoDB** (if using local MongoDB)
   ```bash
   # On Windows
   mongod
   
   # On Mac/Linux
   sudo systemctl start mongod
   ```

5. **Start the server**
   ```bash
   npm start
   # Or for development with auto-reload:
   npm run dev
   ```

6. **Open your browser**
   - Navigate to `http://localhost:3000`
   - Create an account or login
   - Start tracking your budget!

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Transactions
- `GET /api/transactions` - Get all transactions (with filters)
- `GET /api/transactions/:id` - Get transaction by ID
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/stats/summary` - Get transaction summary
- `GET /api/transactions/categories/list` - Get all categories

### Budgets
- `GET /api/budgets` - Get all budgets
- `GET /api/budgets/:id` - Get budget by ID
- `POST /api/budgets` - Create or update budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget
- `GET /api/budgets/progress/current` - Get budget progress

### Analytics
- `GET /api/analytics/monthly-comparison` - Monthly income vs expense
- `GET /api/analytics/category-expenses` - Category-wise expenses
- `GET /api/analytics/spending-trends` - Spending trends over time
- `GET /api/analytics/top-categories` - Top spending categories

### Reports
- `GET /api/reports/export/csv` - Export transactions to CSV
- `GET /api/reports/monthly` - Generate monthly report
- `GET /api/reports/yearly` - Generate yearly report

## Usage Guide

### Adding Transactions
1. Navigate to the Transactions tab
2. Fill in the form:
   - Description: What the transaction is for
   - Amount: Transaction amount
   - Type: Income or Expense
   - Category: Choose or create a category
   - Date: Transaction date
3. Click "Add Transaction"

### Setting Budgets
1. Go to the Budgets tab
2. Fill in the budget form:
   - Category: Which category to budget for
   - Amount: Budget limit
   - Period: Monthly or Yearly
   - Month/Year: Time period
3. Click "Set Budget"
4. View progress bars showing budget utilization

### Viewing Analytics
1. Navigate to the Analytics tab
2. View charts showing:
   - Monthly income vs expenses
   - Category expense distribution
   - Spending trends over time
   - Top spending categories

### Generating Reports
1. Go to the Reports tab
2. For monthly report: Enter month and year, click "Generate Report"
3. For yearly report: Enter year, click "Generate Report"
4. To export: Set date range (optional) and click "Export to CSV"

## Deployment

### MongoDB Atlas Setup
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env`

### Backend Deployment (Render/Heroku)
1. Push code to GitHub
2. Connect repository to Render/Heroku
3. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PORT` (usually auto-set)
4. Deploy

### Frontend Deployment (Netlify/Vercel)
1. Build static files (if needed)
2. Deploy `public` folder
3. Update API_BASE_URL in `public/js/api.js` to point to your backend

## Security Notes

- **Change JWT_SECRET** in production to a strong, random string
- Use **HTTPS** in production
- Consider adding **rate limiting** for API endpoints
- Implement **input validation** on both client and server
- Use **environment variables** for sensitive data

## Future Enhancements

- [ ] Recurring transactions
- [ ] Bill reminders with notifications
- [ ] Multi-currency support
- [ ] Data backup/restore
- [ ] Mobile app version
- [ ] Email reports
- [ ] Advanced predictions using ML
- [ ] Budget templates
- [ ] Financial goals tracking

## License

This project is open source and available for personal and educational use.

## Support

For issues or questions, please check the code comments or create an issue in the repository.

---

**Happy Budgeting! 💰**

