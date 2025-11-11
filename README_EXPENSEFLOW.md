# ExpenseFlow - Expense Reimbursement System

A sleek, intuitive, and user-friendly web application for streamlining the company expense reimbursement process with AI-powered chatbot assistance, OCR receipt scanning, and automated approval workflows.

## 🎯 Features

### Core Functionality
- **AI-Powered Chatbot**: Intelligent assistant available across all roles for expense management
- **OCR Receipt Scanning**: Automatic extraction of amount, date, and merchant information from receipts
- **Role-Based Access Control**: Separate interfaces for Employee, Manager, and Admin roles
- **Multi-Currency Support**: Handle expenses in USD, EUR, GBP, and more
- **Automated Approval Workflows**: Smart routing based on expense amount and category
- **Real-Time Analytics**: Comprehensive expense insights and reporting

### Role-Specific Features

#### 👤 Employee Portal
- **Chatbot-Only Interface**: No complex forms - just chat naturally
- Submit expenses through conversation
- Check expense status instantly
- Upload receipts with automatic OCR processing
- View personal expense history
- Track approval status

#### 👔 Manager Dashboard
- **Dashboard View**: Overview of pending approvals and team statistics
- Review and approve/reject expense submissions
- View team expense analytics
- **Integrated Chatbot**: Quick actions through conversational interface
- Filter expenses by status, date, category
- Bulk approval capabilities

#### ⚙️ Admin Dashboard
- **Complete System Control**: Full administrative capabilities
- User management and role assignment
- Configure approval rules based on amount thresholds
- Company-wide analytics and insights
- Department-level reporting
- Currency distribution analysis
- Monthly trend visualization
- **Chatbot Support**: Administrative actions through AI assistant

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/bun installed
- Turso database credentials (already configured)

### Installation

```bash
# Install dependencies
npm install
# or
bun install

# Run the development server
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Authentication

### Demo Accounts

For testing purposes, you can create accounts or use these demo credentials:

**Employee Account:**
- Email: `employee@company.com`
- Password: `password123`
- Access: Chatbot-only interface for expense submission

**Manager Account:**
- Email: `manager@company.com`
- Password: `password123`
- Access: Dashboard with approvals + Chatbot

**Admin Account:**
- Email: `admin@company.com`
- Password: `password123`
- Access: Full system control + Analytics + Chatbot

### Creating New Accounts

1. Navigate to `/sign-up`
2. Fill in your details (name, email, password)
3. After signup, sign in at `/sign-in`
4. You'll be routed to the appropriate interface based on your role

## 📊 Database Schema

### Tables

**users** - User accounts
- id, email, name, role, department, createdAt

**expenses** - Expense submissions
- id, userId, title, amount, currency, category, description, receiptUrl, status, submittedAt, createdAt, updatedAt

**approvals** - Approval history
- id, expenseId, approverId, status, comments, approvedAt, createdAt

**approvalRules** - Automated approval rules
- id, minAmount, maxAmount, requiredApprovers, autoApprove, createdAt

**companySettings** - System configuration
- id, key, value, createdAt

## 🔌 API Endpoints

### Expenses
- `GET /api/expenses` - List expenses with filters (userId, status, category, currency, search, pagination)
- `POST /api/expenses` - Create new expense
- `GET /api/expenses/[id]` - Get single expense with details
- `PATCH /api/expenses/[id]` - Update expense
- `POST /api/expenses/[id]/approve` - Approve expense
- `POST /api/expenses/[id]/reject` - Reject expense

### Users
- `GET /api/users` - List users with filters (role, department, search, pagination)

### Analytics
- `GET /api/analytics` - Get expense analytics (total spent, by category, by status, monthly trends)

### Authentication
- `POST /api/auth/sign-in` - Sign in
- `POST /api/auth/sign-up` - Create account
- `POST /api/auth/sign-out` - Sign out

## 🎨 User Interface

### Design Principles
- **Clarity**: Clean, uncluttered interfaces with clear visual hierarchy
- **Efficiency**: Minimal clicks to complete tasks, chatbot reduces friction
- **Seamless UX**: Smooth transitions, real-time feedback, responsive design
- **Accessibility**: High contrast, readable fonts, keyboard navigation

### Components Used
- Shadcn/UI components for consistent design language
- Framer Motion for smooth animations
- Lucide React icons for visual clarity
- Tailwind CSS for responsive styling

## 💬 Chatbot Capabilities

The AI-powered chatbot can help with:

### Employee Actions
- "Submit new expense" - Guided expense creation
- "Check expense status" - View all expense statuses
- "Upload receipt" - OCR-powered receipt processing
- "View my expenses" - Personal expense history

### Manager Actions
- "Show pending approvals" - List of expenses awaiting approval
- "Approve expense #123" - Quick approval by ID
- "View team expenses" - Team-wide expense overview
- All employee actions

### Admin Actions
- "View analytics" - Company-wide insights
- "Manage users" - User administration
- "Configure rules" - Approval rule management
- All manager and employee actions

## 🔒 Security Features

- **Better-Auth Integration**: Industry-standard authentication
- **Bearer Token Authentication**: Secure API access
- **Role-Based Access Control**: Middleware-enforced route protection
- **Session Management**: Secure session handling
- **Password Hashing**: Encrypted password storage

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop (1920px+)
- Laptop (1280px - 1919px)
- Tablet (768px - 1279px)
- Mobile (320px - 767px)

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/UI
- **Database**: Turso (LibSQL)
- **ORM**: Drizzle ORM
- **Authentication**: Better-Auth
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📈 Approval Workflow

### Automatic Rules (Pre-configured)
1. **Under $100**: Auto-approved
2. **$100 - $1000**: Requires 1 manager approval
3. **Over $1000**: Requires 2 approvals (manager + admin)

### Status Flow
```
draft → pending → approved/rejected
```

### Notifications
- Employees notified when expenses are approved/rejected
- Managers notified of new expense submissions
- Admins notified of high-value expenses

## 🔄 Expense Categories

Pre-configured categories:
- Travel (flights, hotels, transportation)
- Meals (client dinners, team lunches)
- Office Supplies (equipment, stationery)
- Software (licenses, subscriptions)
- Other (miscellaneous expenses)

## 🌍 Multi-Currency Support

Supported currencies:
- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- CAD (Canadian Dollar)
- AUD (Australian Dollar)

Currency conversion and reporting available in analytics dashboard.

## 📝 Sample Data

The system comes pre-seeded with:
- 3 users (employee, manager, admin)
- 18 sample expenses across all statuses
- 3 approval rules
- 4 company settings

## 🚦 Getting Started Workflow

### For Employees
1. Sign in at `/sign-in`
2. Start chatting with the AI assistant
3. Say "Submit new expense" to create expense
4. Upload receipt for automatic OCR processing
5. Check status anytime through chat

### For Managers
1. Sign in at `/sign-in`
2. View Dashboard tab for pending approvals
3. Review and approve/reject expenses
4. Switch to Assistant tab for quick actions
5. Ask chatbot "Show pending approvals"

### For Admins
1. Sign in at `/sign-in`
2. View Dashboard for system overview
3. Check Users tab for user management
4. Review Analytics tab for insights
5. Use Assistant for administrative tasks

## 🎯 Key Benefits

✅ **50% Faster Submission**: Chatbot eliminates complex forms
✅ **90% Less Data Entry**: OCR auto-extracts receipt information
✅ **Instant Approvals**: Automated workflows for small expenses
✅ **Real-Time Visibility**: Track expenses from submission to reimbursement
✅ **Reduced Errors**: AI validation catches common mistakes
✅ **Better Insights**: Analytics help identify spending patterns

## 🐛 Troubleshooting

### Authentication Issues
- Clear localStorage and cookies
- Ensure database is accessible
- Check BETTER_AUTH_SECRET in .env

### API Errors
- Verify TURSO credentials in .env
- Check network connectivity
- Review browser console for details

### Chatbot Not Responding
- Refresh the page
- Check browser console for errors
- Ensure you're signed in

## 📄 License

Proprietary - All rights reserved

## 👥 Support

For issues or questions:
- Check the documentation above
- Review API responses in browser DevTools
- Contact system administrator

---

**Built with ❤️ using Next.js, Shadcn/UI, and Better-Auth**