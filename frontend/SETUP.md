# PsychConnect Frontend Setup

## Environment Variables

Create a `.env.local` file in the frontend directory with:

```
NEXT_PUBLIC_GRAPHQL_API=http://localhost:3000/api/graphql
```

**Important**: Make sure your backend is running on port 3000 and frontend on port 3001 for the CORS configuration to work properly.

## Running the Application

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Make sure the backend is running on port 3000

## Features

- ✅ User Authentication (Sign In/Sign Up)
- ✅ Dashboard with role-based views
- ✅ Psychologist profiles and listings
- ✅ Appointment booking system
- ✅ Profile management
- ✅ Kid-friendly UI design
- ✅ Responsive design

## User Roles

- **CHILD**: Can book sessions with psychologists
- **PSYCHOLOGIST**: Can manage profile and view appointments
- **ADMIN**: Full system access

## Pages

- `/` - Landing page
- `/signin` - Sign in page
- `/signup` - Sign up page
- `/dashboard` - Main dashboard
- `/psychologists` - Browse psychologists
- `/psychologists/[id]` - Psychologist profile
- `/appointments` - View appointments
- `/appointments/new` - Book new appointment
- `/profile` - User profile
- `/profile/psychologist` - Psychologist profile management
