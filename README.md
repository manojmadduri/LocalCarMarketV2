# The Integrity Auto and Body - Automotive Business Platform

A comprehensive automotive business platform built for streamlined used car sales, repair services, and customer engagement. Features a modern full-stack architecture with React frontend and Node.js backend.

## 🚀 Features

- **Car Inventory Management** - Browse, search, filter, and compare vehicles
- **Service Booking System** - Schedule automotive services with calendar integration
- **Customer Testimonials** - Display and manage customer reviews
- **Payment Calculator** - EMI and financing calculations
- **VIN Decoder Integration** - Automatic vehicle information extraction
- **Price History Tracking** - Monitor vehicle pricing trends
- **Admin Panel** - Comprehensive content management system
- **Mobile-Responsive Design** - Optimized for all device sizes

## 🛠️ Tech Stack

### Frontend
- **React.js** with TypeScript
- **Wouter** for client-side routing
- **Tailwind CSS** with Shadcn/UI components
- **TanStack Query** for server state management
- **Framer Motion** for animations
- **Vite** for development and build

### Backend
- **Node.js** with Express.js
- **TypeScript** throughout
- **Drizzle ORM** for database operations
- **PostgreSQL** (Supabase hosted)
- **Session-based authentication**

## 📋 Prerequisites

Before running this project locally, make sure you have:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **PostgreSQL database** (Supabase account recommended)

## 🔧 Local Development Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd integrity-auto-body
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL=your_postgresql_connection_string

# Session Configuration
SESSION_SECRET=your_session_secret_key

# Optional: Port Configuration (defaults to 5000)
PORT=5000
```

**Getting your DATABASE_URL:**
- Sign up for a free [Supabase](https://supabase.com) account
- Create a new project
- Go to Settings → Database
- Copy the connection string (make sure to replace `[YOUR-PASSWORD]` with your actual password)

### 4. Database Setup

Push the database schema to your PostgreSQL database:

```bash
npm run db:push
```

This command will create all necessary tables and relationships in your database.

### 5. Start the Development Server

```bash
npm run dev
```

This will start both the backend API server and the frontend development server. The application will be available at:

- **Frontend**: http://localhost:5000
- **API**: http://localhost:5000/api

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio for database management

## 🏗️ Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
├── server/                 # Express backend
│   ├── routes.ts           # API route definitions
│   ├── database-storage.ts # Database operations
│   └── index.ts            # Server entry point
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Database schema definitions
└── package.json
```

## 🔐 Admin Access

To access the admin panel:

1. Navigate to `/admin` in your browser
2. Use the default credentials or create new ones through the database
3. Manage cars, services, testimonials, and customer inquiries

## 🚀 Deployment

The application is designed to work seamlessly with various hosting platforms:

### Replit (Recommended)
- The project is pre-configured for Replit deployment
- Simply click the "Deploy" button in your Replit environment

### Other Platforms
1. Build the application: `npm run build`
2. Set environment variables on your hosting platform
3. Start the production server: `npm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ for The Integrity Auto and Body