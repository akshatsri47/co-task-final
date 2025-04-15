import { supabase } from '@/utils/supabase/client';

// Workspace functions
export async function createCollaborativeWorkspace(name, description) {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) return { error: 'User not authenticated' };
    

    
    // Step 1: Create the workspace
    const { data: workspace, error: workspaceError } = await supabase
      .from('collaborative_workspaces')
      .insert({
        name,
        description,
        created_by: userData.user.id
      })
      .select()
      .single();
    
    if (workspaceError) {
      console.error('Error creating workspace:', workspaceError);
      return { error: workspaceError };
    }
    
    // Step 2: Add the user as owner
    const { error: memberError } = await supabase
      .from('workspace_members')
      .insert({
        workspace_id: workspace.id,
        user_id: userData.user.id,
        role: 'owner'
      });
    
    if (memberError) {
      // If adding member fails, clean up by deleting the workspace
      await supabase
        .from('collaborative_workspaces')
        .delete()
        .eq('id', workspace.id);
        
      console.error('Error adding workspace member:', memberError);
      return { error: memberError };
    }
    
    return { data: workspace };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { error: err.message };
  }
}

export async function getWorkspaces() {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) return { error: 'User not authenticated' };
    
    // Get workspaces where user is a member
    const { data: memberships, error: membershipError } = await supabase
      .from('workspace_members')
      .select(`
        workspace_id,
        role
      `)
      .eq('user_id', userData.user.id);
    
    if (membershipError) {
      console.error('Error fetching memberships:', membershipError);
      return { error: membershipError };
    }
    
    if (!memberships || memberships.length === 0) {
      return { data: [] };
    }
    
    // Get workspace details
    const workspaceIds = memberships.map(m => m.workspace_id);
    const { data: workspaces, error: workspacesError } = await supabase
      .from('collaborative_workspaces')
      .select(`
        *,
        creator:created_by(name, avatar)
      `)
      .in('id', workspaceIds);
    
    if (workspacesError) {
      console.error('Error fetching workspaces:', workspacesError);
      return { error: workspacesError };
    }
    
    // Merge workspace data with role information
    const workspacesWithRoles = workspaces.map(workspace => {
      const membership = memberships.find(m => m.workspace_id === workspace.id);
      return {
        ...workspace,
        role: membership ? membership.role : 'member'
      };
    });
    
    return { data: workspacesWithRoles };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { error: err.message };
  }
}

export async function inviteUserToWorkspace(workspaceId, email, role = 'member') {
  try {
    const { data: inviter } = await supabase.auth.getUser();
    
    if (!inviter || !inviter.user) return { error: 'User not authenticated' };
    
    // Check if the inviter has permission to invite (owner or admin)
    const { data: permission, error: permissionError } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', workspaceId)
      .eq('user_id', inviter.user.id)
      .single();
    
    if (permissionError) {
      return { error: 'You do not have access to this workspace' };
    }
    
    if (permission.role !== 'owner' && permission.role !== 'admin') {
      return { error: 'You do not have permission to invite users' };
    }
    
    // First, get user ID by email
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
    
    if (userError) {
      console.error('Error finding user:', userError);
      return { error: { message: 'User not found' } };
    }
    
    // Check if user is already a member
    const { data: existingMember, error: checkError } = await supabase
      .from('workspace_members')
      .select('user_id')
      .eq('workspace_id', workspaceId)
      .eq('user_id', users.id)
      .single();
      
    if (existingMember) {
      return { error: { message: 'User is already a member of this workspace' } };
    }
    
    // Add user to workspace
    const { data, error } = await supabase
      .from('workspace_members')
      .insert({
        workspace_id: workspaceId,
        user_id: users.id,
        role
      });
    
    if (error) {
      console.error('Error adding workspace member:', error);
      return { error };
    }
    
    return { data: { success: true } };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { error: err.message };
  }
}

export async function getWorkspaceMembers(workspaceId) {
  try {
    const { data: currentUser } = await supabase.auth.getUser();
    
    if (!currentUser || !currentUser.user) {
      return { error: 'User not authenticated' };
    }
    
    // Check if user has access to the workspace
    const { data: membership, error: membershipError } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', workspaceId)
      .eq('user_id', currentUser.user.id)
      .single();
      
    if (membershipError) {
      return { error: 'You do not have access to this workspace' };
    }
    
    // Get all members with their details
    const { data: members, error: membersError } = await supabase
      .from('workspace_members')
      .select(`
        role,
        joined_at,
        user:user_id(id, name, email, avatar)
      `)
      .eq('workspace_id', workspaceId);
      
    if (membersError) {
      console.error('Error fetching workspace members:', membersError);
      return { error: membersError };
    }
    
    return { data: members };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { error: err.message };
  }
}

export async function removeUserFromWorkspace(workspaceId, userId) {
  try {
    const { data: currentUser } = await supabase.auth.getUser();
    
    if (!currentUser || !currentUser.user) {
      return { error: 'User not authenticated' };
    }
    
    // Check if the remover has permission (owner or admin)
    const { data: permission, error: permissionError } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', workspaceId)
      .eq('user_id', currentUser.user.id)
      .single();
    
    if (permissionError) {
      return { error: 'You do not have access to this workspace' };
    }
    
    // Only owners can remove admins, and only owners/admins can remove members
    if (permission.role !== 'owner' && permission.role !== 'admin') {
      return { error: 'You do not have permission to remove users' };
    }
    
    // Check the role of the user being removed
    const { data: targetUser, error: targetError } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', workspaceId)
      .eq('user_id', userId)
      .single();
      
    if (targetError) {
      return { error: 'User is not a member of this workspace' };
    }
    
    // Admins can't remove owners, and admins can't remove other admins
    if (targetUser.role === 'owner' || 
        (permission.role === 'admin' && targetUser.role === 'admin')) {
      return { error: 'You do not have permission to remove this user' };
    }
    
    // Check if user is trying to remove themselves
    if (userId === currentUser.user.id) {
      // If they're the owner, they can't leave unless they transfer ownership first
      if (permission.role === 'owner') {
        // Check if they're the only owner
        const { data: ownerCount, error: countError } = await supabase
          .from('workspace_members')
          .select('user_id')
          .eq('workspace_id', workspaceId)
          .eq('role', 'owner');
          
        if (countError) {
          return { error: 'Failed to verify ownership status' };
        }
        
        if (ownerCount.length === 1) {
          return { error: 'You cannot leave the workspace as the only owner. Transfer ownership first.' };
        }
      }
    }
    
    // All checks passed, proceed with removal
    const { data, error } = await supabase
      .from('workspace_members')
      .delete()
      .eq('workspace_id', workspaceId)
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error removing workspace member:', error);
      return { error };
    }
    
    return { data: { success: true } };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { error: err.message };
  }
}

export async function getWorkspaceById(workspaceId) {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) return { error: 'User not authenticated' };

    const { data, error } = await supabase
      .from('collaborative_workspaces')
      .select(`*, creator: created_by (name, avatar)`)
      .eq('id', workspaceId)
      .single();

    if (error) {
      return { error };
    }
    return { data };
  } catch (err) {
    return { error: err.message };
  }
}
