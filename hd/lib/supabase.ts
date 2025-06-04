import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Project = {
  id: number
  title_en: string
  title_ar: string
  description_en: string
  description_ar: string
  link: string
  image_url: string | null
  alt_text: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}
