import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://krspnqedycoppzxjpayd.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtyc3BucWVkeWNvcHB6eGpwYXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2ODMzMDUsImV4cCI6MjA2NTI1OTMwNX0.xIID0mhWN-rnVeffRkGqFt4PcrB52SXwz7UaUDXDRBg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to upload car images
export const uploadCarImage = async (file: File, carId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${carId}-${Date.now()}.${fileExt}`
  const filePath = `cars/${fileName}`

  const { error } = await supabase.storage
    .from('car-images')
    .upload(filePath, file)

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`)
  }

  const { data } = supabase.storage
    .from('car-images')
    .getPublicUrl(filePath)

  return data.publicUrl
}

// Helper function to delete car images
export const deleteCarImage = async (imageUrl: string) => {
  const path = imageUrl.split('/').slice(-2).join('/')
  
  const { error } = await supabase.storage
    .from('car-images')
    .remove([path])

  if (error) {
    throw new Error(`Failed to delete image: ${error.message}`)
  }
}