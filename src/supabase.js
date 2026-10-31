import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://bshtmytzxrffhhjbbvif.supabase.co'
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_YAeAd_TO5ta7-fRwNr2yLQ_OOGMJ8go'

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
)