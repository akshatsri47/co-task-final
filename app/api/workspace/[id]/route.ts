// app/api/workspace/[id]/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase/client';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Get the session to verify the user is authenticated
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get workspace details
    const { data: workspace, error: workspaceError } = await supabase
      .from('collaborative_workspaces')
      .select('*')
      .eq('id', id)
      .single();
      
    if (workspaceError) {
      console.error('Error fetching workspace:', workspaceError);
      return NextResponse.json(
        { error: workspaceError.message },
        { status: workspaceError.code === 'PGRST116' ? 404 : 500 }
      );
    }
    
    // Check if user has access to this workspace
    const { data: membership, error: membershipError } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', id)
      .eq('user_id', session.user.id)
      .single();
      
    if (membershipError) {
      return NextResponse.json(
        { error: 'You do not have access to this workspace' },
        { status: 403 }
      );
    }
    
    // Return workspace with role information
    return NextResponse.json({
      ...workspace,
      role: membership.role
    });
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}