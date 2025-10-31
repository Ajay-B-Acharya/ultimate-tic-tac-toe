# Python Backend Setup

This project now uses Python/FastAPI as the backend with Supabase for data storage.

## Architecture

- **Frontend**: Next.js (React/TypeScript) - Port 3000
- **Backend**: Python/FastAPI - Port 8000
- **Database**: Supabase PostgreSQL

## Setup Instructions

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Set Up Environment Variables

Create a `.env` file in the project root:

```env
SUPABASE_URL=https://nmzbtfwemhfyteubcgjj.supabase.co
SUPABASE_KEY=your_supabase_service_role_key
```

**Important**: Use the `service_role` key from Supabase Settings → API (not the anon key).

### 3. Run the Python Backend

```bash
python main.py
```

The server will start at `http://localhost:8000`

### 4. Run the Frontend

In a separate terminal:

```bash
npm run dev
```

The frontend will start at `http://localhost:3000`

## How It Works

1. **Authentication**: Users authenticate through Supabase Auth in the Next.js frontend
2. **API Calls**: Frontend sends requests to Python backend with JWT token
3. **Token Verification**: Python backend decodes JWT to get user ID
4. **Game Storage**: Games are stored in Supabase PostgreSQL database
5. **Row Level Security**: Users can only access their own games

## API Endpoints

All endpoints require authentication via `Authorization: Bearer <token>` header.

- `POST /api/game/new` - Create new game
- `POST /api/game/{game_id}/move` - Make a move
- `POST /api/game/{game_id}/ai-move` - Get AI move
- `POST /api/game/{game_id}/reset` - Reset game
- `GET /api/health` - Health check

## Database Schema

The database is managed by Supabase. Run the SQL migration from `supabase-migration.sql` in your Supabase SQL Editor.

## Files Structure

```
├── main.py                 # FastAPI application
├── game_engine.py          # Game logic
├── minimax_agent.py         # AI opponent
├── game_store.py           # Supabase integration
├── requirements.txt        # Python dependencies
└── supabase-migration.sql  # Database schema
```

## Troubleshooting

### Port Already in Use

If port 8000 is already in use:
```bash
# Find and kill the process
lsof -ti:8000 | xargs kill
```

### Authentication Errors

- Make sure you're using the `service_role` key (not anon key)
- Check that tokens are being passed correctly from frontend
- Verify Supabase database has the `games` table

### Database Connection Errors

- Verify Supabase credentials in `.env`
- Check that the migration has been run
- Ensure Row Level Security is properly configured

## Development

To run with auto-reload:

```bash
uvicorn main:app --reload --port 8000
```

## Production Deployment

1. Set `SUPABASE_URL` and `SUPABASE_KEY` environment variables
2. Run database migrations
3. Start FastAPI with a production ASGI server (e.g., Gunicorn)
4. Ensure CORS is configured for your frontend domain

