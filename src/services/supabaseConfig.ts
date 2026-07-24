/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Supabase project configuration
// The anon key is safe for frontend use — RLS (Row Level Security) is enabled
// and only allows SELECT on etfs and etf_historical_prices tables.

export const SUPABASE_URL = 'https://dfphhwgczizvxsszngrc.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmcGhod2djeml6dnhzc3puZ3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2MzQ2MDAsImV4cCI6MjEwMDIxMDYwMH0.uO1pijYWGFXb9Ci2SsT3oY82F0uRdbV2U-tTpE-Mt0I';

export const supabaseHeaders = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
};
