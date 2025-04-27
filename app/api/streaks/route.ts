// app/api/streaks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await  createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: streakData, error: streakError } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', user.id)
      .single();
 
    if (streakError) {
      console.error('Error fetching streak:', streakError);
      return NextResponse.json({ error: 'Failed to fetch streak data' }, { status: 500 });
    }

    if (!streakData) {
      return NextResponse.json({ streak: { current_streak: 0, max_streak: 0 } });
    }

    return NextResponse.json({ streak: streakData });
  } catch (error) {
    console.error('Streak fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(); // ✅ removed `await`

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date().toISOString().split('T')[0];

    const { data: existingStreak, error: fetchError } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (fetchError) {
      console.error('Error fetching streak:', fetchError);
      return NextResponse.json({ error: `Failed to fetch streak data: ${fetchError.message}` }, { status: 500 });
    }

    let updatedStreak;

    if (!existingStreak) {
      const { data, error } = await supabase
        .from('user_streaks')
        .insert({
          user_id: user.id,
          current_streak: 1,
          max_streak: 1,
          last_login_date: today,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating streak:', error);
        return NextResponse.json({ error: `Failed to create streak: ${error.message}` }, { status: 500 });
      }

      updatedStreak = data;
    } else {
      const lastLoginDate = existingStreak.last_login_date;

      const lastLogin = new Date(lastLoginDate);
      const currentDate = new Date(today);

      lastLogin.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);

      const dayDifference = Math.round((currentDate.getTime() - lastLogin.getTime()) / (1000 * 3600 * 24));

      let newCurrentStreak = existingStreak.current_streak;
      let newMaxStreak = existingStreak.max_streak;

      if (dayDifference === 0) {
        return NextResponse.json({
          streak: existingStreak,
          message: 'Already logged in today',
        });
      } else if (dayDifference === 1) {
        newCurrentStreak += 1;
        if (newCurrentStreak > newMaxStreak) {
          newMaxStreak = newCurrentStreak;
        }
      } else {
        newCurrentStreak = 1;
      }

      const { data, error } = await supabase
        .from('user_streaks')
        .update({
          current_streak: newCurrentStreak,
          max_streak: newMaxStreak,
          last_login_date: today,
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating streak:', error);
        return NextResponse.json({ error: `Failed to update streak: ${error.message}` }, { status: 500 });
      }

      updatedStreak = data;
    }

    return NextResponse.json({ streak: updatedStreak });
  } catch (error: any) {
    console.error('Streak update error:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
