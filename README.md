# Manitas Pro - Handyman Business Web Application

A modern web application for a handyman/contractor business built with React, TypeScript, Vite, and Tailwind CSS.

## 🚀 Features

- **Public Website**: Client-facing pages with service information and booking form
- **Admin Dashboard**: Internal management system for jobs, clients, and business operations
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **TypeScript**: Full type safety throughout the application
- **GitHub Pages Ready**: Configured for easy deployment

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (HashRouter for GitHub Pages)
- **Icons**: Material Symbols
- **Deployment**: GitHub Pages

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── data/               # Mock data (temporary)
├── layouts/            # Layout components
│   ├── PublicLayout.tsx
│   └── AdminLayout.tsx
├── pages/              # Page components
│   ├── public/         # Public website pages
│   └── admin/          # Admin dashboard pages
├── router/             # Routing configuration
├── types/              # TypeScript interfaces
└── main.tsx           # Application entry point
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

## 🌐 Deployment to GitHub Pages

### Automatic Deployment

The project is configured with GitHub Actions for automatic deployment:

1. Push to `main` branch
2. GitHub Actions will automatically build and deploy to GitHub Pages
3. Site will be available at: `https://yourusername.github.io/handymanGioService/`

### Manual Deployment

```bash
npm run build
npm run deploy
```

## 📱 Routes

### Public Routes
- `/` - Home page
- `/servicios` - Services
- `/trabajos-realizados` - Portfolio
- `/como-funciona` - How it works
- `/agenda` - Booking form
- `/contacto` - Contact

### Admin Routes
- `/admin` - Dashboard
- `/admin/trabajos` - Jobs list
- `/admin/trabajos/nuevo` - New job wizard
- `/admin/trabajos/:id` - Job details
- `/admin/clientes` - Clients list

## 🎨 Design System

The application uses a custom Tailwind configuration with:

- **Primary Color**: `#0F766E` (Teal)
- **Accent Color**: `#F97316` (Orange)
- **Font**: Inter
- **Icons**: Material Symbols Outlined

## 📝 Development Notes

- Uses HashRouter for GitHub Pages compatibility
- Mock data is stored in `src/data/` for development
- All text content is in Spanish (es-GT)
- Components follow functional React patterns with hooks
- TypeScript interfaces define data models

## 🔄 Next Steps

1. Replace mock data with real API integration
2. Add authentication for admin routes
3. Implement form validation and submission
4. Add more interactive features
5. Optimize for SEO and performance

## 📄 License

This project is private and proprietary.