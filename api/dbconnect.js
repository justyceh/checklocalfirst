import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// This file will primarily be used to connect to the supabase third party database
// We use dotenv for getting our env variables from the .env file

dotenv.config()

export const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);