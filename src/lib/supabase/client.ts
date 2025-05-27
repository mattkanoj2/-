import { createBrowserClient } from '@supabase/ssr'
import { getSupabaseConfig } from '@/lib/env'
import type { Database } from './types'

export function createClient() {
  const { url, anonKey } = getSupabaseConfig()
  return createBrowserClient<Database>(url, anonKey)
}