# Vital Prompt Forge 🚀

A secure, personal library for managing and searching your most valuable AI prompts. Built with modern architecture to keep your data and API keys safe.

## 🏗️ Architecture

- **Frontend**: React 19 + Vite + TypeScript + shadcn/ui
- **Backend**: Express.js server (secure API layer)
- **Database**: Notion API (your prompts are stored securely in Notion)
- **Security**: API keys are never exposed to the frontend

## 🚀 Quick Start

### Prerequisites

- Node.js (v16+ recommended)
- npm or bun

### Installation

1. **Clone and install frontend dependencies:**
   ```bash
   npm install
   ```

2. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Configure your Notion credentials:**
   
   Create a `.env` file in the `server` directory with your Notion API credentials:
   ```env
   NOTION_API_KEY=your_notion_api_key_here
   NOTION_DATABASE_ID=your_notion_database_id_here
   PORT=3001
   ```

### Running the Application

You'll need two terminal windows to run both the frontend and backend:

**Terminal 1 - Backend:**
```bash
cd server
npm start
```
Your API server will run at `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Your React app will open at `http://localhost:5173`

## 🔧 Development

- **Frontend**: `npm run dev` (runs on port 5173)
- **Backend**: `cd server && npm start` (runs on port 3001)
- **Build**: `npm run build`

## 🛠️ Features

- ✅ **Secure Architecture**: API keys stored safely on backend
- ✅ **Smart Search**: Search across all prompt content
- ✅ **Category Filtering**: Filter prompts by categories/tags
- ✅ **One-Click Copy**: Copy prompts to clipboard instantly
- ✅ **Modern UI**: Beautiful, responsive interface with shadcn/ui
- ✅ **Real-time Updates**: Data syncs with your Notion database

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   ├── PromptCard.tsx      # Individual prompt display
│   │   └── ui/                 # shadcn/ui components
│   ├── hooks/
│   │   └── usePrompts.ts       # React Query hook for prompts
│   ├── lib/
│   │   └── api.ts              # API service layer
│   └── pages/
│       └── PromptsPage.tsx     # Main prompts page
├── server/
│   ├── index.js                # Express.js backend
│   ├── package.json            # Backend dependencies
│   └── .env                    # Environment variables
└── package.json                # Frontend dependencies
```

## 🔒 Security

- **API Keys**: Never exposed to the frontend
- **CORS**: Configured for secure cross-origin requests
- **Environment Variables**: Sensitive data stored in `.env` files

## 🎯 Usage

1. Add prompts to your Notion database
2. Configure your Notion API credentials
3. Start both servers
4. Browse and search your prompts at `http://localhost:5173/prompts`

## 🚀 Deployment

This project is designed for local development. For production deployment:

1. Deploy the backend to a secure server (Vercel, Railway, etc.)
2. Update the API_BASE_URL in `src/lib/api.ts`
3. Deploy the frontend to a static hosting service
4. Ensure CORS is properly configured for your domain

---

**Built with ❤️ using React 19, Vite, TypeScript, and shadcn/ui**
