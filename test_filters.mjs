import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Testing data_evento filter...");
  let { error: err1 } = await supabase.from("listas").select("id").eq("data_evento", "2026-03-05").limit(1);
  console.log("Error 1:", err1?.message || "Success");
  
  console.log("Testing search filter...");
  const q = "teste";
  let { error: err2 } = await supabase.from("listas").select("id").or(`nome_responsavel.ilike.%${q}%,id.in.(4e3c5007-4e6f-4c8d-8c46-9d3291244e6b)`).limit(1);
  console.log("Error 2:", err2?.message || "Success");
}
run();
