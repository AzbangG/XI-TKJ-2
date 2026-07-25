import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://oksbzrhvxzbszqetodzh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rc2J6cmh2eHpic3pxZXRvZHpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5NjExODQsImV4cCI6MjEwMDUzNzE4NH0._fVknNCU9bAYIp-AEPL74cRgC0fQof58PdhFsnyJAT0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
