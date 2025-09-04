import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import AddUserModal from '../../components/AddUserModal';
import EditUserModal from '../../components/EditUserModal';
import AddProgramModal from '../../components/AddProgramModal';
import EditProgramModal from '../../components/EditProgramModal';
import Notification from '../../components/Notification';
import { useNotification } from '../../hooks/useNotification';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  BarChart3, 
  TrendingUp, 
  UserPlus,
  PlusCircle,
  Activity,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  Database,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { 
  fetchUsers,
  fetchPrograms,
  fetchSessions,
  fetchAttendance,
  createUser,
  updateUser,
  deleteUser,
  createProgram,
  updateProgram,
  deleteProgram,
  exportUsers,
  exportPrograms,
  exportAttendance,
  testConnection
} from '../../utils/googleSheetsApi';

function AdminOverview() {
  const [users, setUsers] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { notifications, showNotification, removeNotification } = useNotification();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, programsRes, sessionsRes, attendanceRes] = await Promise.all([
        fetchUsers(),
        fetchPrograms(),
        fetchSessions(),
        fetchAttendance()
      ]);

      if (usersRes.success) setUsers(usersRes.data || []);
      if (programsRes.success) setPrograms(programsRes.data || []);
      if (sessionsRes.success) setSessions(sessionsRes.data || []);
      if (attendanceRes.success) setAttendance(attendanceRes.data || []);
    } catch (error) {
      showNotification('error', 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const todaysSessions = sessions.filter(s => s.date === new Date().toISOString().split('T')[0]);
  const attendanceRate = attendance.length > 0 
    ? Math.round((attendance.filter(a => a.status === 'present').length / attendance.length) * 100)
    : 0;

  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Active Programs',
      value: programs.filter(p => p.status === 'ongoing').length,
      icon: BookOpen,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Sessions Today',
      value: todaysSessions.length,
      icon: Calendar,
      color: 'bg-orange-500',
      change: '+3'
    },
    {
      title: 'Attendance Rate',
      value: `${attendanceRate}%`,
      icon: BarChart3,
      color: 'bg-purple-500',
      change: '+5%'
    }
  ];

  const recentUsers = users.slice(-5);
  const upcomingPrograms = programs.filter(p => p.status === 'upcoming').slice(0, 3);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-lg p-6">
              <div className="animate-pulse">
                <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={() => removeNotification(notification.id)}
        />
      ))}

      {/* Welcome Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text mb-2">Admin Dashboard</h1>
            <p className="text-text/70">Manage users, programs, and monitor training activities</p>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center space-x-2 bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-lg"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text/60 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-text mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500 text-sm font-medium">{stat.change}</span>
                <span className="text-text/60 text-sm ml-1">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text">Recent Users</h3>
            <span className="text-text/60 text-sm">{users.length} total users</span>
          </div>
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-text">{user.name}</p>
                  <p className="text-text/60 text-sm">{user.email}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.role === 'admin' ? 'bg-red-100 text-red-700' :
                  user.role === 'trainer' ? 'bg-blue-100 text-blue-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Programs */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text">Upcoming Programs</h3>
            <span className="text-text/60 text-sm">{programs.length} total programs</span>
          </div>
          <div className="space-y-4">
            {upcomingPrograms.map((program) => (
              <div key={program.id} className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-text mb-2">{program.title}</h4>
                <div className="flex items-center justify-between text-sm text-text/60">
                  <span>Start: {new Date(program.start_date).toLocaleDateString()}</span>
                  <span>{program.current_participants || 0}/{program.max_participants} enrolled</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-accent h-2 rounded-full"
                    style={{ width: `${((program.current_participants || 0) / program.max_participants) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text">Recent Activity</h3>
          <Activity className="h-5 w-5 text-text/60" />
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <UserPlus className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-text font-medium">System connected to Google Sheets</p>
              <p className="text-text/60 text-sm">Real-time data synchronization active</p>
            </div>
            <span className="text-text/60 text-sm ml-auto">Now</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function UsersManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const { notifications, showNotification, removeNotification } = useNotification();

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await fetchUsers();
      if (result.success) {
        setUsers(result.data || []);
      } else {
        showNotification('error', result.error || 'Failed to fetch users');
      }
    } catch (error) {
      showNotification('error', 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddUser = async (userData: any) => {
    try {
      const result = await createUser(userData);
      if (result.success) {
        await fetchData();
        showNotification('success', 'User added successfully!');
      } else {
        showNotification('error', result.error || 'Failed to add user');
      }
    } catch (error) {
      showNotification('error', 'Failed to add user');
    }
  };

  const handleEditUser = async (id: string, userData: any) => {
    try {
      const result = await updateUser(id, userData);
      if (result.success) {
        await fetchData();
        showNotification('success', 'User updated successfully!');
      } else {
        showNotification('error', result.error || 'Failed to update user');
      }
    } catch (error) {
      showNotification('error', 'Failed to update user');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const result = await deleteUser(id);
        if (result.success) {
          await fetchData();
          showNotification('success', 'User deleted successfully!');
        } else {
          showNotification('error', result.error || 'Failed to delete user');
        }
      } catch (error) {
        showNotification('error', 'Failed to delete user');
      }
    }
  };

  const handleExportUsers = async () => {
    try {
      const result = await exportUsers();
      if (result.success) {
        showNotification('success', 'Users exported successfully!');
      } else {
        showNotification('error', result.error || 'Failed to export users');
      }
    } catch (error) {
      showNotification('error', 'Failed to export users');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={() => removeNotification(notification.id)}
        />
      ))}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Users Management</h1>
        <div className="flex space-x-3">
          <button
            onClick={handleExportUsers}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Download className="h-5 w-5" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <UserPlus className="h-5 w-5" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-text">{user.name}</div>
                        <div className="text-sm text-text/60">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-red-100 text-red-700' :
                      user.role === 'trainer' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text/60">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="text-secondary hover:text-secondary/80"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddUser}
      />

      <EditUserModal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSubmit={handleEditUser}
        user={editingUser}
      />
    </div>
  );
}

function ProgramsManagement() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<any>(null);
  const { notifications, showNotification, removeNotification } = useNotification();

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await fetchPrograms();
      if (result.success) {
        setPrograms(result.data || []);
      } else {
        showNotification('error', result.error || 'Failed to fetch programs');
      }
    } catch (error) {
      showNotification('error', 'Failed to fetch programs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddProgram = async (programData: any) => {
    try {
      const result = await createProgram(programData);
      if (result.success) {
        await fetchData();
        showNotification('success', 'Program added successfully!');
      } else {
        showNotification('error', result.error || 'Failed to add program');
      }
    } catch (error) {
      showNotification('error', 'Failed to add program');
    }
  };

  const handleEditProgram = async (id: string, programData: any) => {
    try {
      const result = await updateProgram(id, programData);
      if (result.success) {
        await fetchData();
        showNotification('success', 'Program updated successfully!');
      } else {
        showNotification('error', result.error || 'Failed to update program');
      }
    } catch (error) {
      showNotification('error', 'Failed to update program');
    }
  };

  const handleDeleteProgram = async (id: string) => {
    if (confirm('Are you sure you want to delete this program?')) {
      try {
        const result = await deleteProgram(id);
        if (result.success) {
          await fetchData();
          showNotification('success', 'Program deleted successfully!');
        } else {
          showNotification('error', result.error || 'Failed to delete program');
        }
      } catch (error) {
        showNotification('error', 'Failed to delete program');
      }
    }
  };

  const handleExportPrograms = async () => {
    try {
      const result = await exportPrograms();
      if (result.success) {
        showNotification('success', 'Programs exported successfully!');
      } else {
        showNotification('error', result.error || 'Failed to export programs');
      }
    } catch (error) {
      showNotification('error', 'Failed to export programs');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={() => removeNotification(notification.id)}
        />
      ))}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Programs Management</h1>
        <div className="flex space-x-3">
          <button
            onClick={handleExportPrograms}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Download className="h-5 w-5" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Add Program</span>
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {programs.map((program) => (
          <div key={program.id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-text">{program.title}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingProgram(program)}
                  className="text-secondary hover:text-secondary/80"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteProgram(program.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            <p className="text-text/70 mb-4">{program.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-text/60">Department:</span>
                <p className="font-medium">{program.department}</p>
              </div>
              <div>
                <span className="text-text/60">Duration:</span>
                <p className="font-medium">{new Date(program.start_date).toLocaleDateString()} - {new Date(program.end_date).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-text/60">Participants:</span>
                <p className="font-medium">{program.current_participants || 0}/{program.max_participants}</p>
              </div>
              <div>
                <span className="text-text/60">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  program.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                  program.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {program.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <AddProgramModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddProgram}
      />

      <EditProgramModal
        isOpen={!!editingProgram}
        onClose={() => setEditingProgram(null)}
        onSubmit={handleEditProgram}
        program={editingProgram}
      />
    </div>
  );
}

function AttendanceOverview() {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { notifications, showNotification, removeNotification } = useNotification();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [attendanceRes, sessionsRes, usersRes] = await Promise.all([
        fetchAttendance(),
        fetchSessions(),
        fetchUsers()
      ]);

      if (attendanceRes.success) setAttendance(attendanceRes.data || []);
      if (sessionsRes.success) setSessions(sessionsRes.data || []);
      if (usersRes.success) setUsers(usersRes.data || []);
    } catch (error) {
      showNotification('error', 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExportAttendance = async () => {
    try {
      const result = await exportAttendance();
      if (result.success) {
        showNotification('success', 'Attendance exported successfully!');
      } else {
        showNotification('error', result.error || 'Failed to export attendance');
      }
    } catch (error) {
      showNotification('error', 'Failed to export attendance');
    }
  };

  const attendanceWithDetails = attendance.map(record => {
    const session = sessions.find(s => s.id === record.session_id);
    const participant = users.find(u => u.id === record.participant_id);
    return {
      ...record,
      session,
      participant
    };
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={() => removeNotification(notification.id)}
        />
      ))}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Attendance Overview</h1>
        <button
          onClick={handleExportAttendance}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Download className="h-5 w-5" />
          <span>Export Report</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceWithDetails.map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-text">{record.session?.title || 'Unknown Session'}</div>
                    <div className="text-sm text-text/60">{record.session?.date || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-text">{record.participant?.name || 'Unknown User'}</div>
                    <div className="text-sm text-text/60">{record.participant?.email || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      record.status === 'present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text/60">
                    {record.timestamp ? new Date(record.timestamp).toLocaleString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SystemSettings() {
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [connectionMessage, setConnectionMessage] = useState('');
  const { notifications, showNotification, removeNotification } = useNotification();

  const handleTestConnection = async () => {
    setConnectionStatus('testing');
    setConnectionMessage('');
    
    try {
      const result = await testConnection();
      if (result.success) {
        setConnectionStatus('success');
        setConnectionMessage('Connection successful!');
        showNotification('success', 'Google Sheets connection is working properly');
      } else {
        setConnectionStatus('error');
        setConnectionMessage(result.error || 'Connection failed');
        showNotification('error', result.error || 'Failed to connect to Google Sheets');
      }
    } catch (error) {
      setConnectionStatus('error');
      setConnectionMessage('Connection failed');
      showNotification('error', 'Failed to test connection');
    }
  };

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={() => removeNotification(notification.id)}
        />
      ))}

      <h1 className="text-2xl font-bold text-text">System Settings</h1>
      
      <div className="grid gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-text mb-4">General Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-2">System Name</label>
              <input
                type="text"
                defaultValue="BBPVP Bandung Training System"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-2">Contact Email</label>
              <input
                type="email"
                defaultValue="info@bbpvpbandung.ac.id"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-text mb-4">Google Sheets Integration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-2">API Endpoint</label>
              <input
                type="url"
                defaultValue={import.meta.env.VITE_GOOGLE_SHEETS_API_URL}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                readOnly
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleTestConnection}
                disabled={connectionStatus === 'testing'}
                className="bg-secondary hover:bg-secondary/90 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Database className={`h-5 w-5 ${connectionStatus === 'testing' ? 'animate-spin' : ''}`} />
                <span>{connectionStatus === 'testing' ? 'Testing...' : 'Test Connection'}</span>
              </button>

              {connectionStatus !== 'idle' && connectionStatus !== 'testing' && (
                <div className={`flex items-center space-x-2 ${
                  connectionStatus === 'success' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {connectionStatus === 'success' ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <AlertCircle className="h-5 w-5" />
                  )}
                  <span className="text-sm font-medium">{connectionMessage}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<AdminOverview />} />
        <Route path="/users" element={<UsersManagement />} />
        <Route path="/programs" element={<ProgramsManagement />} />
        <Route path="/attendance" element={<AttendanceOverview />} />
        <Route path="/settings" element={<SystemSettings />} />
      </Routes>
    </DashboardLayout>
  );
}