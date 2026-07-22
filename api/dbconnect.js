import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// This file will primarily be used to connect to the supabase third party database
// We use dotenv for getting our env variables from the .env file

dotenv.config()

export const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// TEMPORARY — remove after debugging
try {
    if (!process.env.SUPABASE_SERVICE_KEY) {
        console.log('SUPABASE_SERVICE_KEY is NOT SET at all');
    } else {
        const payload = JSON.parse(Buffer.from(process.env.SUPABASE_SERVICE_KEY.split('.')[1], 'base64').toString());
        console.log('SUPABASE_SERVICE_KEY role:', payload.role);
    }
} catch (e) {
    console.log('SUPABASE_SERVICE_KEY is malformed:', e.message);
}