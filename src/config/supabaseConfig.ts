import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY

if (!supabaseURL || !supabaseURL.startsWith("https://")) {
    throw new Error('Error url invalid')
}

if (!SUPABASE_ANON_KEY) {
    throw new Error('Error a key must be provided!')
}

export const supabaseClient = createClient(supabaseURL, SUPABASE_ANON_KEY)