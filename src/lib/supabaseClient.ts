// This file is deprecated - use @/lib/supabase/client or @/lib/supabase/server instead
import { createClient as createBrowserClient } from '@/lib/supabase/client'

export function createClient() {
  return createBrowserClient()
}