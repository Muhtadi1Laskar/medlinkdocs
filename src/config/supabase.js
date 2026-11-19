import { createClient } from "@supabase/supabase-js";

const supabseURL = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

console.log(supabseURL);
console.log(supabaseKey);

if (!supabseURL || !supabaseKey) {
    throw new Error("Supabase environment variables are missing");
}

export const supabase = createClient(
    supabseURL,
    supabaseKey,
    {
        auth: {
            persistSession: false, 
            autoRefreshToken: false
        }
    }
)