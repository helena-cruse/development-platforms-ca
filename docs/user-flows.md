# User Flows

## Registration

1. User enters email and password
2. Supabase sends confirmation email
3. User confirms email
4. Account becomes active

## Login

1. User enters email and password
2. Supabase authenticates credentials
3. Session is created
4. UI updates to logged-in state

## Creating an Article

1. User navigates to create page
2. Auth state is checked
3. If authenticated, form is displayed
4. Article is submitted
5. Article is stored with submitted_by user ID

## Logout

1. User logs out
2. Session is cleared
3. UI updates to logged-out state
