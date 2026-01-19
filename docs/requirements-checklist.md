# Requirements Checklist – Development Platforms CA

## Core Functionality

- Public users can view a list of articles
- Articles display title, body, category, and submission date
- Users can register with email and password
- Users can log in
- Only authenticated users can submit articles
- Articles are automatically linked to the submitting user

## Authentication & Authorization

- Supabase authentication with email confirmation
- Auth state handled in the frontend
- Protected create article page
- UI elements hidden or shown based on auth state

## Database & Security

- Articles stored in Supabase database
- Row Level Security enabled
- Public read access for articles
- Insert restricted to authenticated users

## Frontend & UX

- Responsive design
- Article browsing interface
- Article submission form
- Error messages shown in UI

## Documentation

- README with setup instructions
- Motivation section
