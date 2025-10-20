import { createBrowserClient } from '@supabase/ssr'

import { assertSupabaseConfig, hasSupabaseConfig, supabaseAnonKey, supabaseUrl } from './env'

export function createClient() {
  assertSupabaseConfig()
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!)
}

export function createOptionalClient() {
  if (!hasSupabaseConfig) {
    return null
  }
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!)
}