"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {getWorkspaceTasks, 
    createTask, 
     } from "../../api/task/route"
// Import API functions for both members and tasks
import { 
  getWorkspaceMembers, 
  inviteUserToWorkspace, 
  getWorkspaceById
  
} from "@/utils/api";

export default function WorkspacePage() {
  const { id } = useParams(); // Workspace ID from the route

  // Tab state: "members" or "tasks"
  const [activeTab, setActiveTab] = useState("members");

  // Workspace details state (optional)
  const [workspace, setWorkspace] = useState(null);
  const [wsError, setWsError] = useState(null);

  // Members state
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [inviting, setInviting] = useState(false);
  const [membersError, setMembersError] = useState(null);
  const [inviteSuccess, setInviteSuccess] = useState(null);

  // Tasks state
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [taskError, setTaskError] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assigned_to: "",
  });
  const [taskSubmitting, setTaskSubmitting] = useState(false);

  // Load workspace details
  async function loadWorkspace() {
    const { data, error } = await getWorkspaceById(id);
    if (error) {
      setWsError(typeof error === "string" ? error : error.message || "Failed to load workspace");
    } else {
      setWorkspace(data);
    }
  }

  // Load workspace members
  async function loadMembers() {
    setMembersLoading(true);
    setMembersError(null);
    const { data, error } = await getWorkspaceMembers(id);
    if (error) {
      setMembersError(typeof error === "string" ? error : error.message || "Failed to load members");
    } else {
      setMembers(data || []);
    }
    setMembersLoading(false);
  }

  // Load workspace tasks
  async function loadTasks() {
    setTasksLoading(true);
    setTaskError(null);
    const { data, error } = await getWorkspaceTasks(id);
    if (error) {
      setTaskError(typeof error === "string" ? error : error.message || "Failed to load tasks");
    } else {
      setTasks(data || []);
    }
    setTasksLoading(false);
  }

  // On component mount (or when id changes) load all data
  useEffect(() => {
    if (!id) return;
    loadWorkspace();
    loadMembers();
    loadTasks();
  }, [id]);

  // Handle inviting a new member
  async function handleInvite(e) {
    e.preventDefault();
    if (!inviteEmail.trim()) {
      setMembersError("Email is required");
      return;
    }
    setInviting(true);
    setMembersError(null);
    setInviteSuccess(null);
    const { data, error } = await inviteUserToWorkspace(id, inviteEmail, inviteRole);
    if (error) {
      setMembersError(typeof error === "string" ? error : error.message || "Failed to invite user");
    } else {
      setInviteSuccess(`User ${inviteEmail} has been invited successfully`);
      setInviteEmail("");
      loadMembers();
    }
    setInviting(false);
  }

  // Handle creating a new task
  async function handleTaskSubmit(e) {
    e.preventDefault();
    if (!newTask.title.trim()) {
      setTaskError("Task title is required.");
      return;
    }
    setTaskSubmitting(true);
    setTaskError(null);
    const { data, error } = await createTask(id, newTask);
    if (error) {
      setTaskError(typeof error === "string" ? error : error.message || "Failed to create task.");
    } else {
      // Prepend the new task to the list (new tasks first)
      setTasks((prev) => [data, ...prev]);
      setNewTask({ title: "", description: "", assigned_to: "" });
    }
    setTaskSubmitting(false);
  }

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      {/* Back navigation and workspace header */}
      <Link href="/workspaces" className="text-indigo-600 hover:underline">
  &larr; Back to Workspaces
</Link>

      {workspace && (
        <div className="my-6">
          <h1 className="text-2xl font-bold">{workspace.name}</h1>
          {workspace.description && <p className="text-gray-600">{workspace.description}</p>}
        </div>
      )}

      {/* Tab navigation */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("members")}
          className={`px-4 py-2 border-b-2 focus:outline-none ${
            activeTab === "members"
              ? "border-indigo-600 text-indigo-600 font-semibold"
              : "border-transparent text-gray-600"
          }`}
        >
          Members
        </button>
        <button
          onClick={() => setActiveTab("tasks")}
          className={`px-4 py-2 border-b-2 focus:outline-none ${
            activeTab === "tasks"
              ? "border-indigo-600 text-indigo-600 font-semibold"
              : "border-transparent text-gray-600"
          }`}
        >
          Tasks
        </button>
      </div>

      {activeTab === "members" && (
        <div className="bg-white shadow-sm rounded-lg p-6 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Workspace Members</h2>
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Invite New Member</h3>
            {membersError && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">{membersError}</div>
            )}
            {inviteSuccess && (
              <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4">{inviteSuccess}</div>
            )}
            <form onSubmit={handleInvite} className="flex flex-col md:flex-row gap-3">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter user email"
                disabled={inviting}
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={inviting}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
              <button
                type="submit"
                disabled={inviting}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {inviting ? "Inviting..." : "Invite"}
              </button>
            </form>
          </div>

          {membersLoading ? (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading members...</p>
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-6 bg-gray-50 rounded-md">
              <p className="text-gray-500">No members found</p>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {members.map((member) => (
                    <tr key={member.user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            {member.user.avatar ? (
                              <img
                                src={member.user.avatar}
                                alt={member.user.name}
                                className="h-10 w-10 rounded-full"
                              />
                            ) : (
                              <span>
                                {member.user.name
                                  ? member.user.name[0].toUpperCase()
                                  : "?"}
                              </span>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {member.user.name || "Unknown"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {member.user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            member.role === "owner"
                              ? "bg-purple-100 text-purple-800"
                              : member.role === "admin"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {member.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(member.joined_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "tasks" && (
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Workspace Tasks
          </h2>
          <section className="mb-10">
            <h3 className="text-xl font-semibold mb-4">Create New Task</h3>
            {taskError && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
                {taskError}
              </div>
            )}
            <form onSubmit={handleTaskSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Task title"
                  disabled={taskSubmitting}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Task description"
                  rows="3"
                  disabled={taskSubmitting}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Assign To (User ID)
                </label>
                <input
                  type="text"
                  value={newTask.assigned_to}
                  onChange={(e) =>
                    setNewTask({ ...newTask, assigned_to: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter user ID (optional)"
                  disabled={taskSubmitting}
                />
              </div>
              <button
                type="submit"
                disabled={taskSubmitting}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                {taskSubmitting ? "Creating Task..." : "Create Task"}
              </button>
            </form>
          </section>
          <section>
            <h3 className="text-xl font-semibold mb-4">Tasks</h3>
            {tasksLoading ? (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading tasks...</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-md">
                <p className="text-gray-500">
                  No tasks available for this workspace.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition-colors"
                  >
                    <h4 className="font-medium text-lg">{task.title}</h4>
                    {task.description && (
                      <p className="text-gray-600 mt-1">{task.description}</p>
                    )}
                    <div className="flex flex-wrap mt-2 text-sm text-gray-500">
                      <span>Status: {task.status}</span>
                      <span className="ml-4">Priority: {task.priority}</span>
                    </div>
                    {task.assignee && (
                      <div className="mt-1 text-sm text-gray-500">
                        Assigned to:{" "}
                        {task.assignee.name || task.assigned_to}
                      </div>
                    )}
                    <div className="mt-1 text-xs text-gray-400">
                      Created at:{" "}
                      {new Date(task.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
