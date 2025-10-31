# Supabase Setup Guide

This project uses Supabase as its backend for authentication and data storage.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Node.js and npm/pnpm installed

## Setup Steps

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Wait for the project to be provisioned (takes a few minutes)

### 2. Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (your `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon/public key** (your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### 3. Set Up the Database Schema

1. In your Supabase project, go to **SQL Editor**
2. Run the SQL migration from `supabase-migration.sql`
3. This will create the `games` table with proper Row Level Security (RLS) policies

### 4. Configure Environment Variables

1. Copy `env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 5. Install Dependencies

```bash
npm install
```

or

```bash
pnpm install
```

### 6. Run the Development Server

```bash
npm run dev
```

or

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Features

- **Authentication**: Uses Supabase Auth for user authentication (email/password)
- **Data Storage**: Game state is stored in Supabase PostgreSQL database
- **Row Level Security**: Each user can only access their own games
- **Real-time Updates**: Ready for real-time features with Supabase subscriptions

## Database Schema

The `games` table stores:
- `id`: Unique game identifier (UUID)
- `user_id`: Owner of the game (references auth.users)
- `game_state`: JSON representation of the game board and state
- `created_at`: Timestamp when game was created
- `updated_at`: Timestamp when game was last modified

## Security

- Row Level Security (RLS) is enabled on the `games` table
- Users can only view, create, update, and delete their own games
- All API routes require authentication
- Environment variables are used to securely manage Supabase credentials

## Troubleshooting

### "Unauthorized" errors

- Make sure you're logged in
- Check that your Supabase credentials are correct in `.env.local`
- Verify that the database schema has been created

### Database connection issues

- Check your Supabase project is active (not paused)
- Verify the database migration has been run
- Check the Supabase dashboard for any error messages

