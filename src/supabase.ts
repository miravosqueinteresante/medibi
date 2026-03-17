import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://inyxyjjrddzwvbcoigov.supabase.co'
const supabaseKey = 'sb_publishable_SGn40SUz7RIy6U9ggceQmw_2wSQKo66'

export const supabase = createClient(supabaseUrl, supabaseKey)