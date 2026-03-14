/**
 * Supabase client for server-side use (API routes, server components).
 * Uses same env as browser client; RLS applies (e.g. anon can insert into newsletter_subscribers).
 */

import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

export const supabaseServer = url && anonKey ? createClient(url, anonKey) : null;

/** Admin client (service role) for operations that need to bypass RLS, e.g. newsletter unsubscribe. */
export const supabaseAdmin = url && serviceRoleKey ? createClient(url, serviceRoleKey) : null;
