# Database & Row Level Security

# Articles Table

The application uses a single main table called `articles`.

# Fields

- id: unique identifier
- title: article title
- body: article content
- category: article category
- created_at: timestamp generated automatically
- submitted_by: user ID from Supabase authentication

The `submitted_by` field is a foreign key connected to `auth.users.id`.

## Row Level Security (RLS)

Row Level Security is enabled to control access to data.

- SELECT:
  - Anyone can read articles
- INSERT:
  - Only authenticated users can create articles
  - The submitted_by value must match the logged-in user
