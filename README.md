# ✈️ Flight Search Engine

A modern, feature-rich flight search application built with React, TypeScript, and Vite. Search, filter, and compare flights with real-time data visualization and an intuitive user interface.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

## 🌟 Features

- **Smart Search**: Search flights by origin, destination, dates, and passenger count
- **Advanced Filtering**: Filter by price range, number of stops, airlines, and departure times
- **Real-time Sorting**: Sort results by price, duration, departure time, or arrival time
- **Price Trends**: Visualize price trends with interactive charts
- **Responsive Design**: Fully responsive interface that works on all devices
- **Mock & Live Data**: Support for both mock data (development) and Amadeus API (production)
- **Fast Performance**: Built with Vite for lightning-fast development and builds
- **Type Safety**: Full TypeScript support for better developer experience

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Amadeus API credentials (optional, for live data)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/hamdizer/flight-search-engine.git
cd flight-search-engine
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:

```env
VITE_AMADEUS_API_KEY=your_api_key_here
VITE_AMADEUS_API_SECRET=your_api_secret_here
VITE_ENABLE_MOCK_DATA=true  # Set to false to use live API
```

4. **Start development server**

```bash
npm run dev
```

Visit `http://localhost:5173` to see the app running.

## 📦 Build & Deploy

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

## 🛠️ Tech Stack

### Core

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server

### UI & Styling

- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Recharts** - Data visualization

### Data & State

- **Axios** - HTTP client
- **date-fns** - Date manipulation
- **Context API** - State management

### Code Quality

- **ESLint** - Linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 📁 Project Structure

```
flight-search-engine/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, fonts, etc.
│   ├── components/        # React components
│   │   ├── common/        # Reusable UI components
│   │   ├── search/        # Search form components
│   │   ├── filters/       # Filter sidebar components
│   │   ├── flights/       # Flight display components
│   │   ├── charts/        # Data visualization
│   │   └── layout/        # Layout components
│   ├── services/          # API and data services
│   │   ├── api/           # Amadeus API integration
│   │   └── mock/          # Mock data for development
│   ├── hooks/             # Custom React hooks
│   ├── context/           # React context providers
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── styles/            # Global styles
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── tests/                 # Test files
├── .env.example          # Environment variables template
└── package.json          # Dependencies and scripts
```

## 🎯 Available Scripts

| Command              | Description               |
| -------------------- | ------------------------- |
| `npm run dev`        | Start development server  |
| `npm run build`      | Build for production      |
| `npm run preview`    | Preview production build  |
| `npm run lint`       | Run ESLint                |
| `npm run format`     | Format code with Prettier |
| `npm run test`       | Run tests                 |
| `npm run type-check` | Check TypeScript types    |

## 🔧 Configuration

### Amadeus API Setup

1. Register at [Amadeus for Developers](https://developers.amadeus.com/)
2. Create a new app to get your API credentials
3. Add credentials to `.env.local`
4. Set `VITE_ENABLE_MOCK_DATA=false` to use live data

### Path Aliases

The project uses TypeScript path aliases for cleaner imports:

```typescript
import Button from "@/components/common/Button";
import { useFlightSearch } from "@/hooks/useFlightSearch";
import { Flight } from "@/types/flight.types";
```

## 🎨 Component Examples

### Using the Search Form

```tsx
import SearchForm from "@/components/search/SearchForm";

function App() {
  return <SearchForm onSearch={handleSearch} />;
}
```

### Applying Filters

```tsx
import FilterSidebar from "@/components/filters/FilterSidebar";

function Results() {
  return (
    <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
  );
}
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📝 Environment Variables

| Variable                  | Description                  | Required |
| ------------------------- | ---------------------------- | -------- |
| `VITE_AMADEUS_API_KEY`    | Amadeus API key              | No\*     |
| `VITE_AMADEUS_API_SECRET` | Amadeus API secret           | No\*     |
| `VITE_AMADEUS_API_URL`    | Amadeus API base URL         | No       |
| `VITE_ENABLE_MOCK_DATA`   | Use mock data instead of API | No       |

\*Required only if using live Amadeus API data

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Amadeus for Developers](https://developers.amadeus.com/) for the flight data API
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [Lucide](https://lucide.dev/) for the beautiful icons
- [Recharts](https://recharts.org/) for data visualization

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Made with ❤️ using React and TypeScript
