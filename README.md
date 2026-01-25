# The Wire – News Platform

## Project description
The Wire is a simple news platform developed as part of the Development Platforms course (Option 2).  
The application allows anyone to read published news articles, while only authenticated users can create and publish new content.

The project demonstrates how a frontend built with HTML, Tailwind CSS, and vanilla JavaScript can integrate with Supabase for authentication, database access, and file storage.

Core functionality includes public article browsing, authenticated article creation, image uploads, and access control using Row Level Security (RLS).

# Motivation
The motivation behind this project was to gain practical experience with a real backend service and understand how authentication, database rules, and frontend logic work together in a complete application.
Instead of relying on a custom API, I chose Supabase to focus on:
Secure authentication flows
Database-driven content
Clear separation between public and protected features
Realistic constraints similar to production systems
To stay organized and work in a structured way, I created a separate documentation and planning folder alongside the codebase.
This folder contains notes, planning documents, and task breakdowns used during development, helping me track decisions, requirements, and progres

# How to run the project locally

1. Clone the repository:
   ```bash
   git clone <repository-url>

2. Navigate into the project folder:
cd development-platforms-ca-1

3.  start a ol server, you cn us live server in vs code. 

4. open the application in your browser.

# Technologies used:
HTML5
Tailwind CSS (via CDN)
JavaScript (ES modules, no frameworks)
Supabase:
Authentication (email + password with email confirmation)
PostgreSQL database with Row Level Security (RLS)
Storage for article images

Authentication and access control
Reading articles is public and does not require authentication.
Creating articles requires the user to be logged in.
Users must confirm their email address before they can log in.
Articles are automatically linked to the authenticated user who created them.
Row Level Security (RLS) is used to restrict database write access.

Known limitations / missing features
Articles cannot be edited or deleted after publishing.
There is no pagination or infinite scrolling on article lists.
Categories are displayed on the front page but do not have dedicated category pages.
Tailwind CSS is loaded via CDN instead of a build setup (e.g. Vite).
These limitations were accepted to keep the project within the scope of the assignment and time frame. i did struggle a bit with making the assigment in time and decided to use CDN and hope that is okay. 

# Use of AI tool:
AI tools were used as a learning and support resource during development.

The tools were primarily used to:
- Clarify technical concepts related to Supabase (authentication flow, RLS, and storage)
- Get explanations of error messages and unexpected behavior
- Discuss possible approaches and best practices before implementing solutions