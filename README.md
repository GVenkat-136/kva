# KVA Enterprise Management System

A modern, responsive inventory management system built with React that helps businesses manage their stores, godowns (warehouses), stocks, and generate comprehensive reports.

## 🚀 Features

### Core Functionality
- **Multi-role Authentication System** - Admin and Manager roles with different access levels
- **Store Management** - Monitor and manage retail stores and their operations
- **Godown Management** - Track warehouse locations, capacity, and storage units (Admin only)
- **Stock Management** - Real-time inventory tracking across all locations
- **Reports & Analytics** - Generate comprehensive business insights and analytics
- **Responsive Dashboard** - Modern, mobile-friendly interface with real-time data visualization

### User Roles
- **Admin**: Full access to all features including godown management and reports
- **Manager**: Access to stores, stocks, and account management (restricted from godowns)

## 🛠️ Technology Stack

- **Frontend**: React 18.3.1 with React Router DOM
- **Styling**: Tailwind CSS 3.3.0
- **Icons**: Heroicons 2.2.0
- **Animations**: Framer Motion 11.0.0
- **Build Tool**: Create React App
- **Package Manager**: npm

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 14.0 or higher)
- **npm** (version 6.0 or higher)

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd kva
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
```

This creates a `build` folder with optimized production files.

## 🔐 Login Credentials

The application comes with pre-configured demo accounts:

### Admin Account
- **Username**: `admin`
- **Password**: `admin123`
- **Access**: Full system access including godowns and reports

### Manager Account
- **Username**: `manager`
- **Password**: `manager123`
- **Access**: Stores, stocks, and account management

## 📁 Project Structure

```
kva/
├── public/
│   └── index.html
├── src/
│   ├── api/                    # API service files
│   │   ├── authApi.js         # Authentication API
│   │   ├── godownApi.js       # Godown management API
│   │   ├── reportApi.js       # Reports API
│   │   ├── stockApi.js        # Stock management API
│   │   └── storeApi.js        # Store management API
│   ├── components/            # Reusable UI components
│   │   ├── Card.jsx           # Card component
│   │   ├── Header.jsx         # Header component
│   │   ├── Modal.jsx          # Modal component
│   │   ├── Sidebar.jsx        # Navigation sidebar
│   │   ├── Table.jsx          # Data table component
│   │   └── UserMenu.jsx       # User menu dropdown
│   ├── context/               # React Context providers
│   │   └── AuthContext.jsx    # Authentication context
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.js         # Authentication hook
│   │   └── useFetch.js        # Data fetching hook
│   ├── layouts/               # Layout components
│   │   └── MainOutlet.jsx     # Main layout wrapper
│   ├── mock/                  # Mock data files
│   │   ├── godowns.json       # Godown sample data
│   │   ├── reports.json       # Reports sample data
│   │   ├── stocks.json        # Stock sample data
│   │   ├── stores.json        # Store sample data
│   │   └── users.json         # User sample data
│   ├── pages/                 # Page components
│   │   ├── Account.jsx        # User account page
│   │   ├── Godowns.jsx        # Godown management page
│   │   ├── Home.jsx           # Dashboard home page
│   │   ├── Login.jsx          # Login page
│   │   ├── Reports.jsx        # Reports page
│   │   ├── Stocks.jsx         # Stock management page
│   │   └── Stores.jsx         # Store management page
│   ├── routes/                # Routing configuration
│   │   └── AppRoutes.jsx      # Main routing setup
│   ├── utils/                 # Utility functions
│   │   └── helpers.js         # Helper functions
│   ├── index.css              # Global styles
│   └── index.jsx              # Application entry point
├── package.json               # Project dependencies
├── tailwind.config.js         # Tailwind CSS configuration
└── postcss.config.js          # PostCSS configuration
```

## 🎨 UI/UX Features

### Design System
- **Modern Interface**: Clean, professional design with smooth animations
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Color Scheme**: Teal-based primary color with complementary accent colors
- **Typography**: Clear, readable fonts with proper hierarchy
- **Interactive Elements**: Hover effects, transitions, and micro-interactions

### Dashboard Features
- **Real-time Statistics**: Live data updates for stores, godowns, and stock items
- **Quick Actions**: Easy access to all major features
- **Data Visualization**: Interactive charts and graphs for better insights
- **Status Indicators**: Visual status updates and notifications

## 🔧 Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## 🌐 Browser Support

The application supports all modern browsers:
- Chrome (last 1 version)
- Firefox (last 1 version)
- Safari (last 1 version)
- Edge (last 1 version)

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience with sidebar navigation
- **Tablet**: Adapted layout with collapsible sidebar
- **Mobile**: Touch-friendly interface with bottom navigation

## 🔒 Security Features

- **Role-based Access Control**: Different permissions for admin and manager roles
- **Protected Routes**: Automatic redirection based on user authentication
- **Session Management**: Secure user session handling with localStorage
- **Input Validation**: Form validation and error handling

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Static Hosting
The `build` folder contains static files that can be deployed to any static hosting service:
- **Netlify**: Drag and drop the build folder
- **Vercel**: Connect your repository for automatic deployments
- **GitHub Pages**: Use the build folder with GitHub Actions
- **AWS S3**: Upload the build folder to an S3 bucket

### Environment Variables
For production deployment, you may want to configure:
- `REACT_APP_API_URL` - Backend API endpoint
- `REACT_APP_VERSION` - Application version

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

## 🔄 Version History

- **v0.1.0** - Initial release with core inventory management features
  - Multi-role authentication system
  - Store and godown management
  - Stock tracking and reporting
  - Responsive dashboard interface

## 🎯 Roadmap

### Upcoming Features
- [ ] Real-time notifications
- [ ] Advanced reporting with export options
- [ ] Inventory forecasting
- [ ] Multi-language support
- [ ] API integration with external systems
- [ ] Mobile app development
- [ ] Advanced analytics and insights

---

**Built with ❤️ by the KVA Enterprise Team**
