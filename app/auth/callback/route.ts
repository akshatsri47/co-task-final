import { NextResponse } from 'next/server'
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
        
        // Update the user's streak on login
        try {
          // Get the current date in YYYY-MM-DD format
          const today = new Date().toISOString().split('T')[0]
          
          // Check if the user already has a streak record for today
          const { data: existingStreak, error: fetchError } = await supabase
            .from('user_streaks')
            .select('*')
            .eq('user_id', user.id)
            .single()
          
          if (fetchError && fetchError.code !== 'PGSQL_NO_ROWS_RETURNED') {
            console.error('Error fetching streak:', fetchError)
          } else {
            if (!existingStreak) {
              // Create new streak record if none exists
              await supabase
                .from('user_streaks')
                .insert({
                  user_id: user.id,
                  current_streak: 1,
                  max_streak: 1,
                  last_login_date: today
                })
            } else {
              // User has an existing streak record
              const lastLoginDate = existingStreak.last_login_date
              
              // Calculate days between last login and today
              const lastLogin = new Date(lastLoginDate)
              const currentDate = new Date(today)
              const dayDifference = Math.floor((currentDate.getTime() - lastLogin.getTime()) / (1000 * 3600 * 24))
              
              let newCurrentStreak = existingStreak.current_streak
              let newMaxStreak = existingStreak.max_streak
              
              if (dayDifference === 0) {
                // Already logged in today, no streak change
              } else if (dayDifference === 1) {
                // Consecutive day login, increment streak
                newCurrentStreak += 1
                // Update max streak if current streak is higher
                if (newCurrentStreak > newMaxStreak) {
                  newMaxStreak = newCurrentStreak
                }
              } else {
                // Streak broken, reset to 1
                newCurrentStreak = 1
              }
              
              // Only update if the streak changed
              if (newCurrentStreak !== existingStreak.current_streak || 
                  newMaxStreak !== existingStreak.max_streak ||
                  lastLoginDate !== today) {
                  
                await supabase
                  .from('user_streaks')
                  .update({
                    current_streak: newCurrentStreak,
                    max_streak: newMaxStreak,
                    last_login_date: today
                  })
                  .eq('user_id', user.id)
              }
            }
          }
        } catch (err) {
          console.error('Error updating streak:', err)
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