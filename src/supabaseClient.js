import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cllzeodekryrguojsjvr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsbHplb2Rla3J5cmd1b2pzanZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MzI4OTYsImV4cCI6MjA3OTEwODg5Nn0.DnSceF8Y_SUEJI2PnBaSMeKoOFUXdmCVMwJlt49Rk6A'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)