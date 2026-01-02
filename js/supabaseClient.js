const SUPABASE_URL = "https://qrzemvmwrgdxolztqnfr.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyemVtdm13cmdkeG9senRxbmZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczMDg4NDAsImV4cCI6MjA4Mjg4NDg0MH0.23HNnlmBetaYcEcHozs0b2r12kyWos4rI0qnin5XVZo";

export const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
