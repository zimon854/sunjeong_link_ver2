// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cqxduukezbedattyvsky.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxeGR1dWtlemJlZGF0dHl2c2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNTM3NzcsImV4cCI6MjA2NjkyOTc3N30.qob76qhvDLn9mAQXOk07DYiRst1eJxY9PDbDgyR0pWg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
 