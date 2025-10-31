# Ultimate Tic-Tac-Toe

An interactive Ultimate Tic-Tac-Toe game built with Next.js, TypeScript, and Supabase.

## 🎮 Game Overview

Ultimate Tic-Tac-Toe is a more strategic variant of the classic game. Instead of one 3×3 grid, you play on nine 3×3 grids arranged in a 3×3 meta-grid. Where you make a move determines which board your opponent must play on next!

## ✨ Features

- **Interactive UI**: Beautiful, modern interface with smooth animations
- **AI Opponent**: Challenge yourself against a minimax AI with strategic depth
- **User Authentication**: Sign up and log in with email/password using Supabase Auth
- **Persistent Game State**: Your games are saved in the cloud
- **Protected Routes**: Secure game sessions with user authentication
- **Responsive Design**: Optimized for all screen sizes

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- A Supabase account (free tier works)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ultimate-tic-tac-toe
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up Supabase**
   - Create an account at [supabase.com](https://supabase.com)
   - Create a new project
   - Get your project URL and anon key from Settings → API
   - Run the SQL migration in `supabase-migration.sql` in the SQL Editor

4. **Configure environment variables**
   ```bash
   cp env.example .env.local
   ```
   Then edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

- [Supabase Setup Guide](./SUPABASE_SETUP.md) - Detailed setup instructions
- [UI Improvements](./UI_IMPROVEMENTS.md) - Design and UX enhancements

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Supabase (PostgreSQL + Auth)
- **AI**: Minimax algorithm with alpha-beta pruning
- **State Management**: React hooks + in-memory cache + Supabase

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/game/          # API routes for game logic
│   ├── login/             # Login/register page
│   └── page.tsx           # Main game page
├── components/            # React components
│   ├── game-board.tsx     # Main game board
│   ├── mini-board.tsx    # Individual 3×3 board
│   ├── game-status.tsx   # Game status display
│   └── ui/               # Reusable UI components
├── lib/                  # Core game logic
│   ├── game-engine.ts    # Game rules and state
│   ├── minimax-agent.ts # AI opponent
│   ├── game-store.ts     # Database interface
│   └── supabase.ts       # Supabase client
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
└── supabase-migration.sql # Database schema
```

## 🎯 How It Works

### Game Rules

1. The game starts with Player 1 (X) choosing any cell in any board
2. The cell you choose determines which board your opponent (O) must play in next
3. You must play in the board that corresponds to the position you just played
4. Win a mini-board by getting three in a row
5. Win the game by winning three mini-boards in a row on the meta-board

### AI Strategy

The AI uses the minimax algorithm with alpha-beta pruning:
- **Depth**: 4 levels deep for optimal play
- **Evaluation**: Considers threats, board control, and winning potential
- **Performance**: Fast enough for responsive gameplay

## 🔒 Security

- Row Level Security (RLS) ensures users can only access their own games
- All API routes require authentication
- Environment variables are used for sensitive data
- Secure session management with Supabase Auth

## 🧪 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📝 Environment Variables

Required environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

See `env.example` for template.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Ultimate Tic-Tac-Toe game rules
- Supabase for excellent backend services
- Radix UI for accessible components

