# Authentication Setup Guide

This guide will help you set up authentication for your Ultimate Tic-Tac-Toe game using Supabase.

## Prerequisites

1. A Supabase account (free at [supabase.com](https://supabase.com))
2. Node.js and npm installed
3. Your Ultimate Tic-Tac-Toe project

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `ultimate-tic-tac-toe` (or any name you prefer)
   - **Database Password**: Create a strong password
   - **Region**: Choose the closest region to your users
5. Click "Create new project"
6. Wait for the project to be set up (usually takes 1-2 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

## Step 3: Configure Environment Variables

1. Create a `.env.local` file in your project root (if it doesn't exist)
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_project_url` and `your_supabase_anon_key` with the values from Step 2.

## Step 4: Configure Supabase Authentication

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Under **Site URL**, add your development URL: `http://localhost:3000`
3. Under **Redirect URLs**, add: `http://localhost:3000/**`
4. Make sure **Enable email confirmations** is checked (recommended for production)
5. Save the settings

## Step 5: Test the Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your browser and go to `http://localhost:3000`
3. You should be redirected to the login page
4. Try creating a new account:
   - Click the "Register" tab
   - Enter a valid email and password
   - Click "Create Account"
   - Check your email for verification (if email confirmation is enabled)

## Features Included

### 🔐 Authentication Features
- **User Registration**: Create new accounts with email and password
- **User Login**: Sign in with existing credentials
- **Email Verification**: Optional email confirmation for new accounts
- **Password Validation**: Minimum 6 characters, confirmation matching
- **Session Management**: Automatic login state persistence
- **Logout**: Secure sign out functionality

### 🎨 UI Features
- **Modern Design**: Beautiful gradient backgrounds and animations
- **Responsive Layout**: Works on desktop and mobile devices
- **Tabbed Interface**: Easy switching between login and registration
- **Loading States**: Visual feedback during authentication
- **Error Handling**: Clear error messages for users
- **User Profile**: Display user email and verification status

### 🛡️ Security Features
- **Route Protection**: Main game requires authentication
- **Automatic Redirects**: Unauthenticated users redirected to login
- **Secure Storage**: Authentication tokens handled by Supabase
- **Input Validation**: Client-side validation for forms

## File Structure

```
├── contexts/
│   └── AuthContext.tsx          # Authentication context and hooks
├── components/
│   ├── protected-route.tsx      # Route protection component
│   └── user-bar.tsx            # Updated user bar with Supabase auth
├── app/
│   ├── login/
│   │   └── page.tsx            # Enhanced login/registration page
│   ├── layout.tsx              # Updated with AuthProvider
│   └── page.tsx                # Protected main game page
├── lib/
│   └── supabase.ts             # Supabase client configuration
└── env.example                 # Environment variables template
```

## Customization

### Styling
The authentication pages use the same design system as your game:
- Gradient backgrounds matching the game theme
- Purple/pink/blue color scheme
- Consistent typography and spacing

### Authentication Options
You can extend the authentication system by:
- Adding social login (Google, GitHub, etc.)
- Implementing password reset functionality
- Adding user profile management
- Creating role-based access control

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Double-check your environment variables
   - Make sure there are no extra spaces in your `.env.local` file

2. **Redirect loops**
   - Verify your Site URL and Redirect URLs in Supabase settings
   - Check that your environment variables are correctly set

3. **Email not sending**
   - Check your Supabase project's email settings
   - Verify your email domain is not blocked

4. **Build errors**
   - Make sure all dependencies are installed: `npm install`
   - Check that all imports are correct

### Getting Help

- Check the [Supabase Documentation](https://supabase.com/docs)
- Review the [Next.js Documentation](https://nextjs.org/docs)
- Check the browser console for any JavaScript errors

## Production Deployment

When deploying to production:

1. Update your Supabase Site URL to your production domain
2. Add your production domain to Redirect URLs
3. Consider enabling additional security features like:
   - Rate limiting
   - CAPTCHA
   - Stronger password requirements
   - Email verification requirements

## Next Steps

Your authentication system is now ready! Users can:
- Register new accounts
- Sign in to existing accounts
- Access the protected game area
- Sign out securely

The game will automatically redirect unauthenticated users to the login page, ensuring only registered users can play.
