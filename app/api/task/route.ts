import { supabase } from '@/utils/supabase/client';

// Task functions
export async function createTask(workspaceId, taskData) {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) return { error: 'User not authenticated' };
    
    // Check if user has access to the workspace
    const { data: membership, error: membershipError } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', workspaceId)
      .eq('user_id', userData.user.id)
      .single();
      
    if (membershipError) {
      return { error: 'You do not have access to this workspace' };
    }
    
    // Create the task
    const { data: task, error: taskError } = await supabase
      .from('workspace_tasks')
      .insert({
        workspace_id: workspaceId,
        title: taskData.title,
        description: taskData.description || null,
        status: taskData.status || 'todo',
        priority: taskData.priority || 'medium',
        created_by: userData.user.id,
        assigned_to: taskData.assigned_to || null,
        due_date: taskData.due_date || null
      })
      .select()
      .single();
    
    if (taskError) {
      console.error('Error creating task:', taskError);
      return { error: taskError };
    }
    
    return { data: task };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { error: err.message };
  }
}

export async function getWorkspaceTasks(workspaceId, filters = {}) {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) return { error: 'User not authenticated' };
    
    // Check if user has access to the workspace
    const { data: membership, error: membershipError } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', workspaceId)
      .eq('user_id', userData.user.id)
      .single();
      
    if (membershipError) {
      return { error: 'You do not have access to this workspace' };
    }
    
    // Build query with filters
    let query = supabase
      .from('workspace_tasks')
      .select(`
        *,
        creator:created_by(id, name, avatar),
        assignee:assigned_to(id, name, avatar)
      `)
      .eq('workspace_id', workspaceId);
    
    // Apply filters if provided
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters.priority) {
      query = query.eq('priority', filters.priority);
    }
    
    if (filters.assigned_to) {
      query = query.eq('assigned_to', filters.assigned_to);
    }
    
    if (filters.created_by) {
      query = query.eq('created_by', filters.created_by);
    }
    
    // Get tasks
    const { data: tasks, error: tasksError } = await query.order('created_at', { ascending: false });
    
    if (tasksError) {
      console.error('Error fetching tasks:', tasksError);
      return { error: tasksError };
    }
    
    return { data: tasks };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { error: err.message };
  }
}

export async function getTaskDetails(taskId) {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) return { error: 'User not authenticated' };
    
    // Get task details
    const { data: task, error: taskError } = await supabase
      .from('workspace_tasks')
      .select(`
        *,
        creator:created_by(id, name, avatar),
        assignee:assigned_to(id, name, avatar),
        workspace:workspace_id(id, name)
      `)
      .eq('id', taskId)
      .single();
    
    if (taskError) {
      console.error('Error fetching task:', taskError);
      return { error: taskError };
    }
    
    // Check if user has access to the workspace
    const { data: membership, error: membershipError } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', task.workspace_id)
      .eq('user_id', userData.user.id)
      .single();
      
    if (membershipError) {
      return { error: 'You do not have access to this task' };
    }
    
    // Get comments
    const { data: comments, error: commentsError } = await supabase
      .from('task_comments')
      .select(`
        *,
        user:user_id(id, name, avatar)
      `)
      .eq('task_id', taskId)
      .order('created_at', { ascending: true });
    
    if (commentsError) {
      console.error('Error fetching comments:', commentsError);
      return { error: commentsError };
    }
    
    // Get attachments if needed
    const { data: attachments, error: attachmentsError } = await supabase
      .from('task_attachments')
      .select(`
        *,
        user:user_id(id, name)
      `)
      .eq('task_id', taskId)
      .order('created_at', { ascending: false });
    
    return { 
      data: {
        ...task,
        comments: comments || [],
        attachments: attachments || []
      }
    };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { error: err.message };
  }
}

export async function updateTask(taskId, updates) {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) return { error: 'User not authenticated' };
    
    // Get current task data
    const { data: task, error: taskError } = await supabase
      .from('workspace_tasks')
      .select('*')
      .eq('id', taskId)
      .single();
    
    if (taskError) {
      console.error('Error fetching task:', taskError);
      return { error: taskError };
    }
    
    // Check if user has access to the workspace
    const { data: membership, error: membershipError } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', task.workspace_id)
      .eq('user_id', userData.user.id)
      .single();
      
    if (membershipError) {
      return { error: 'You do not have access to this task' };
    }
    
    // Only allow certain updates based on role
    // Regular members can only update status if assigned to them
    if (membership.role === 'member' && 
        task.assigned_to !== userData.user.id && 
        task.created_by !== userData.user.id) {
      return { error: 'You do not have permission to update this task' };
    }
    
    // Add updated_at timestamp
    updates.updated_at = new Date().toISOString();
    
    // Update task
    const { data: updatedTask, error: updateError } = await supabase
      .from('workspace_tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single();
    
    if (updateError) {
      console.error('Error updating task:', updateError);
      return { error: updateError };
    }
    
    // Optionally log changes to task_history
    for (const [key, value] of Object.entries(updates)) {
      if (key !== 'updated_at' && task[key] !== value) {
        await supabase.from('task_history').insert({
          task_id: taskId,
          user_id: userData.user.id,
          field_name: key,
          old_value: task[key],
          new_value: value
        });
      }
    }
    
    return { data: updatedTask };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { error: err.message };
  }
}

export async function addTaskComment(taskId, content) {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) return { error: 'User not authenticated' };
    
    // Get task to check workspace access
    const { data: task, error: taskError } = await supabase
      .from('workspace_tasks')
      .select('workspace_id')
      .eq('id', taskId)
      .single();
    
    if (taskError) {
      return { error: 'Task not found' };
    }
    
    // Check if user has access to the workspace
    const { data: membership, error: membershipError } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', task.workspace_id)
      .eq('user_id', userData.user.id)
      .single();
      
    if (membershipError) {
      return { error: 'You do not have access to this task' };
    }
    
    // Add comment
    const { data: comment, error: commentError } = await supabase
      .from('task_comments')
      .insert({
        task_id: taskId,
        user_id: userData.user.id,
        content
      })
      .select(`
        *,
        user:user_id(id, name, avatar)
      `)
      .single();
    
    if (commentError) {
      console.error('Error adding comment:', commentError);
      return { error: commentError };
    }
    
    return { data: comment };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { error: err.message };
  }
}

export async function deleteTask(taskId) {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) return { error: 'User not authenticated' };
    
    // Get task details
    const { data: task, error: taskError } = await supabase
      .from('workspace_tasks')
      .select('workspace_id, created_by')
      .eq('id', taskId)
      .single();
    
    if (taskError) {
      return { error: 'Task not found' };
    }
    
    // Check user permission
    const { data: membership, error: membershipError } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', task.workspace_id)
      .eq('user_id', userData.user.id)
      .single();
      
    if (membershipError) {
      return { error: 'You do not have access to this task' };
    }
    
    // Only task creator, workspace owners or admins can delete tasks
    if (task.created_by !== userData.user.id && 
        membership.role !== 'owner' && 
        membership.role !== 'admin') {
      return { error: 'You do not have permission to delete this task' };
    }
    
    // Delete task (cascade will handle comments and attachments)
    const { error: deleteError } = await supabase
      .from('workspace_tasks')
      .delete()
      .eq('id', taskId);
    
    if (deleteError) {
      console.error('Error deleting task:', deleteError);
      return { error: deleteError };
    }
    
    return { data: { success: true } };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { error: err.message };
  }
}