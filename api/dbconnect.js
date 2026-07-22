import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// This file will primarily be used to connect to the supabase third party database
// We use dotenv for getting our env variables from the .env file

dotenv.config()

export const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
console.log('Admin key prefix:', process.env.SUPABASE_SERVICE_KEY?.slice(0, 12));