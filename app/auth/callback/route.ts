import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/character'
  
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Get the user data after successful authentication
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Upsert the user information to your users table
        const { error: upsertError } = await supabase
          .from('users')
          .upsert({
            id: user.id,  // This is the auth.users.id from Supabase Auth
            name: user.user_metadata?.full_name || user.user_metadata?.name,
            email: user.email,
            // Set role if needed, or use a default value
            role: 'user' // default role, adjust as needed
          }, { onConflict: 'id' })
          
        if (upsertError) {
          console.error('Error saving user data:', upsertError)
        }
      }
      
      // Continue with your existing redirect logic
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }
  
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}