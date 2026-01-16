# Apollo.io Web Interface

A modern web application for interacting with Apollo.io's API through an intuitive user interface.

## Features

- **User Authentication** - Secure signup and login with Supabase
- **9 Apollo.io Tools** - Access all major Apollo API endpoints
- **Search & Filter** - Advanced filtering for people and company searches
- **Data Enrichment** - Enrich individual or bulk contacts and companies
- **Search History** - Track all your searches with timestamps
- **Saved Results** - Bookmark important companies and people
- **Secure API Keys** - Encrypted storage of your Apollo.io API key

## Architecture

The application consists of three main parts:

1. **MCP Server** (`/src`) - Original Model Context Protocol server for Claude Desktop
2. **API Server** (`/api`) - Express.js REST API with authentication and data persistence
3. **Web Frontend** (`/web`) - React application with TailwindCSS

## Prerequisites

- Node.js 18 or higher
- Apollo.io API key
- Supabase account (provided in `.env`)

## Installation

1. **Install dependencies for all projects:**

```bash
npm install
cd api && npm install
cd ../web && npm install
cd ..
```

2. **Configure environment variables:**

The `.env` files are already set up with Supabase credentials. For the API server, update `api/.env`:

```env
ENCRYPTION_KEY=your-secure-32-character-key-here
```

## Running the Application

### Option 1: Run API and Web separately

**Terminal 1 - Start the API server:**
```bash
npm run dev:api
```

**Terminal 2 - Start the web frontend:**
```bash
npm run dev:web
```

### Option 2: Production Build

```bash
npm run build
npm run start:api  # In one terminal
cd web && npm run preview  # In another terminal
```

## Using the Application

1. **Sign Up** - Visit http://localhost:5173 and create an account
2. **Configure API Key** - Add your Apollo.io API key in the setup page
3. **Start Searching** - Use any of the 9 tools from the sidebar:
   - Search People
   - Search Companies
   - Enrich Person
   - Enrich Company
   - Bulk Enrich People
   - Bulk Enrich Organizations
   - Organization Job Postings
   - Organization Info
   - Search News Articles

## Database Schema

The application uses Supabase with the following tables:

- `profiles` - User profile information
- `api_keys` - Encrypted Apollo.io API keys
- `search_history` - Log of all searches performed
- `saved_results` - Bookmarked companies and people

All tables have Row Level Security (RLS) enabled to ensure users can only access their own data.

## API Endpoints

### Authentication
- `POST /api/v1/auth/validate` - Validate session token

### API Keys
- `GET /api/v1/api-keys/status` - Check if user has an API key
- `POST /api/v1/api-keys` - Save encrypted API key

### Apollo Tools
- `POST /api/v1/apollo/search-people` - Search for people
- `POST /api/v1/apollo/search-companies` - Search for companies
- `POST /api/v1/apollo/enrich-person` - Enrich person data
- `POST /api/v1/apollo/enrich-company` - Enrich company data
- `POST /api/v1/apollo/bulk-enrich-people` - Bulk enrich people
- `POST /api/v1/apollo/bulk-enrich-organizations` - Bulk enrich organizations
- `GET /api/v1/apollo/organization/:id/jobs` - Get organization jobs
- `GET /api/v1/apollo/organization/:id` - Get organization info
- `POST /api/v1/apollo/search-news` - Search news articles

### History & Saved
- `GET /api/v1/history` - Get search history
- `DELETE /api/v1/history/:id` - Delete history item
- `GET /api/v1/saved` - Get saved results
- `POST /api/v1/saved` - Save a result
- `DELETE /api/v1/saved/:id` - Delete saved result
- `PATCH /api/v1/saved/:id` - Update saved result

## Security Features

- API keys are encrypted using AES-256-CBC before storage
- Row Level Security (RLS) on all database tables
- JWT-based authentication with Supabase
- CORS protection on API endpoints
- Helmet.js security headers

## Development

### Project Structure

```
/
├── src/              # MCP server (original)
├── api/              # Express API server
│   ├── src/
│   │   ├── index.ts           # Server entry point
│   │   ├── middleware/        # Auth middleware
│   │   └── routes/            # API routes
│   └── package.json
├── web/              # React frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── contexts/          # React contexts
│   │   ├── lib/               # Utilities and API client
│   │   ├── pages/             # Page components
│   │   └── main.tsx           # App entry point
│   └── package.json
└── package.json      # Root package file
```

### Tech Stack

**Backend (API):**
- Express.js
- TypeScript
- Supabase (PostgreSQL + Auth)
- Undici (HTTP client)
- Crypto (Encryption)

**Frontend (Web):**
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router
- React Query
- Heroicons

## Troubleshooting

**Port already in use:**
- API runs on port 3001 by default
- Web runs on port 5173 by default
- Change ports in `api/.env` and `web/vite.config.ts`

**Database connection errors:**
- Verify Supabase URL and keys in `.env` files
- Check that the database schema was created (tables should exist)

**API key not working:**
- Ensure your Apollo.io API key is valid
- Check that the key has permissions for the endpoints you're using
- Verify the key is saved in the API Key Setup page

## License

MIT
