// src/app/api/habits/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// GET all habits for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all habits for the user
    const { data: habits, error: habitsError } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (habitsError) {
      return NextResponse.json({ error: habitsError.message }, { status: 500 });
    }

    return NextResponse.json({ habits });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create a new habit
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const body = await request.json();
    const { name } = body;
    if (!name) {
      return NextResponse.json({ error: 'Habit name is required' }, { status: 400 });
    }

    // Create the habit record
    const { data: habit, error: habitError } = await supabase
      .from('habits')
      .insert({
        name,
        user_id: user.id,
        streak: 0,
        completed_at: null, // Not completed yet
      })
      .select()
      .single();

    if (habitError) {
      return NextResponse.json({ error: habitError.message }, { status: 500 });
    }

    return NextResponse.json({ habit }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
// PUT update a habit
export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Habit ID is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the habit belongs to the user
    const { data: existingHabit, error: habitCheckError } = await supabase
      .from('habits')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    if (habitCheckError || !existingHabit) {
      return NextResponse.json({ error: 'Habit not found or access denied' }, { status: 404 });
    }

    // Get request body
    const body = await request.json();
    const { name } = body;
    if (!name) {
      return NextResponse.json({ error: 'Habit name is required' }, { status: 400 });
    }

    // Update the habit name
    const { data: updatedHabit, error: updateError } = await supabase
      .from('habits')
      .update({ name })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ habit: updatedHabit });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
// DELETE remove a habit
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Habit ID is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the habit belongs to the user
    const { data: existingHabit, error: habitCheckError } = await supabase
      .from('habits')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    if (habitCheckError || !existingHabit) {
      return NextResponse.json({ error: 'Habit not found or access denied' }, { status: 404 });
    }

    // Delete the habit
    const { error: deleteError } = await supabase
      .from('habits')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
// PATCH mark a habit as completed/uncompleted for today (day-to-day tracking)
export async function PATCH(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const action = url.searchParams.get('action'); // should be 'complete' or 'uncomplete'
    
    if (!id) {
      return NextResponse.json({ error: 'Habit ID is required' }, { status: 400 });
    }
    
    if (!action || !['complete', 'uncomplete'].includes(action)) {
      return NextResponse.json({ error: 'Action must be either "complete" or "uncomplete"' }, { status: 400 });
    }
    
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify that the habit belongs to the user
    const { data: existingHabit, error: habitCheckError } = await supabase
      .from('habits')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    if (habitCheckError || !existingHabit) {
      return NextResponse.json({ error: 'Habit not found or access denied' }, { status: 404 });
    }
    
    // Get the current time and derive today's date (YYYY-MM-DD)
    const now = new Date().toISOString();
    const today = now.split('T')[0];

    if (action === 'complete') {
      // Check if the habit has already been completed today
      if (existingHabit.completed_at && existingHabit.completed_at.startsWith(today)) {
        return NextResponse.json(
          { error: 'Habit already completed today', habit: existingHabit },
          { status: 400 }
        );
      }

      // Update the habit: mark as completed today and increment the streak
      const { data: updatedHabit, error: updateError } = await supabase
        .from('habits')
        .update({
          completed_at: now,
          streak: existingHabit.streak + 1,
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({ habit: updatedHabit });
    } else {
      // action === 'uncomplete'
      // Check if the habit has been marked as completed today
      if (!existingHabit.completed_at || !existingHabit.completed_at.startsWith(today)) {
        return NextResponse.json(
          { error: 'Habit was not completed today', habit: existingHabit },
          { status: 400 }
        );
      }

      // Update the habit: uncomplete for today and decrement the streak (ensuring it does not go below zero)
      const { data: updatedHabit, error: updateError } = await supabase
        .from('habits')
        .update({
          completed_at: null,
          streak: Math.max(0, existingHabit.streak - 1),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
      
      return NextResponse.json({ habit: updatedHabit });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
