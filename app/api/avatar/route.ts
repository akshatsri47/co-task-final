
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

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
    const { name, avatarType, avatarPath } = body;
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    
    if (avatarType !== 'predefined' || !avatarPath) {
      return NextResponse.json({ error: 'Valid avatar path is required' }, { status: 400 });
    }
    
    // Update the user record with the name and avatar path
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        name: name,
        avatar: avatarPath
      })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating user:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error('Avatar API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}