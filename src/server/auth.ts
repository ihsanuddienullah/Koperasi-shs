import 'server-only'
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from './supabase'

export const getUser = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
})
