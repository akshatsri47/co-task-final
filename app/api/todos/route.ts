// src/app/api/todos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// GET all todos for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get todos for the authenticated user
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Get the user's profile with coins
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, name, email, coins')
      .eq('id', user.id)
      .single();

    if (userError) {
      return NextResponse.json(
        { error: userError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      todos: data,
      user: userData,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create a new todo
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get request body
    const body = await request.json();
    const { title } = body;
    
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    // Create todo
    const { data, error } = await supabase
      .from('todos')
      .insert({
        user_id: user.id,
        title: title.trim(),
        completed: false,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // 🎉 Add +5 coins to the user's profile when creating a todo
    const { error: coinError } = await supabase.rpc('increment_user_coins', {
      user_id_input: user.id,
      coins_to_add: 5,
    });

    if (coinError) {
      console.error('Error incrementing coins:', coinError);
    }

    return NextResponse.json({ todo: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update a todo
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get request body
    const body = await request.json();
    const { id, title, completed } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Todo ID is required' },
        { status: 400 }
      );
    }
    
    // Fetch the existing todo
    const { data: existingTodo, error: todoError } = await supabase
      .from('todos')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    
    if (todoError || !existingTodo) {
      return NextResponse.json(
        { error: 'Todo not found or access denied' },
        { status: 404 }
      );
    }
    
    // Build update data
    const updateData: Record<string, any> = {};
    
    if (title !== undefined && typeof title === 'string') {
      updateData.title = title.trim();
    }
    
    if (completed !== undefined && typeof completed === 'boolean') {
      updateData.completed = completed;
    }
    
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid update fields provided' },
        { status: 400 }
      );
    }
    
    // Update the todo
    const { data: updatedTodo, error: updateError } = await supabase
      .from('todos')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
    
    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    // 🎉 Add +5 coins to the user if marking todo as completed
    if (completed === true && existingTodo.completed === false) {
      const { error: coinError } = await supabase.rpc('increment_user_coins', {
        user_id_input: user.id,
        coins_to_add: 5,
      });

      if (coinError) {
        console.error('Error incrementing coins:', coinError);
      }
    }

    return NextResponse.json({ todo: updatedTodo });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE a todo
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Todo ID is required' },
        { status: 400 }
      );
    }
    
    const supabase = await createClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Verify the todo belongs to the user
    const { data: todoData, error: todoError } = await supabase
      .from('todos')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    
    if (todoError || !todoData) {
      return NextResponse.json(
        { error: 'Todo not found or access denied' },
        { status: 404 }
      );
    }
    
    // Delete todo
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
