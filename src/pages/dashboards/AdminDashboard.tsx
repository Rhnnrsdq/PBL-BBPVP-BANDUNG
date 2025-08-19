import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import AddUserModal from '../../components/AddUserModal';
import AddProgramModal from '../../components/AddProgramModal';
import EditUserModal from '../../components/EditUserModal';
import EditProgramModal from '../../components/EditProgramModal';
import GoogleSheetsSync from '../../components/GoogleSheetsSync';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useNotification } from '../../hooks/useNotification';
import { 
  testGoogleSheetsConnection,
  getUsers,
  getPrograms,
  getSessions,
  getAttendance,
  deleteUser,
  deleteProgram,
  exportUsersReport,
  exportProgramsReport,
  exportAttendanceReport
} from '../../utils/googleSheetsApi';
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
  Download
} from 'lucide-react';

function AdminOverview() {
  const { showNotification } = useNotification();
  const [users, setUsers] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResult, programsResult, sessionsResult, attendanceResult] = await Promise.all([
          getUsers(),
          getPrograms(),
          getSessions(),
          getAttendance()
        ]);

        if (usersResult.success) setUsers(usersResult.data);
        if (programsResult.success) setPrograms(programsResult.data);
        if (sessionsResult.success) setSessions(sessionsResult.data);
        if (attendanceResult.success) setAttendance(attendanceResult.data);
      } catch (error) {
        console.error('[ADMIN_OVERVIEW] Error fetching data:', error);
        showNotification('error', 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showNotification]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

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
      value: sessions.filter(s => s.date === new Date().toISOString().split('T')[0]).length,
      icon: Calendar,
      color: 'bg-orange-500',
      change: '+3'
    },
    {
      title: 'Attendance Rate',
      value: '87%',
      icon: BarChart3,
      color: 'bg-purple-500',
      change: '+5%'
    }
  ];

  const recentUsers = users.slice(-5);
  const upcomingPrograms = programs.filter(p => p.status === 'upcoming').slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-text mb-2">Admin Dashboard</h1>
        <p className="text-text/70">Manage users, programs, and monitor training activities</p>
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
            <button 
              onClick={() => showNotification('success', 'Add User feature - Navigate to Users Management')}
              className="flex items-center space-x-2 text-secondary hover:text-secondary/80 transition-colors"
            >
              <UserPlus className="h-5 w-5" />
              <span>Add User</span>
            </button>
          </div>
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user.name.charAt(0).toUpperCase()}
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
            <button 
              onClick={() => showNotification('success', 'Add Program feature - Navigate to Programs Management')}
              className="flex items-center space-x-2 text-secondary hover:text-secondary/80 transition-colors"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Add Program</span>
            </button>
          </div>
          <div className="space-y-4">
            {upcomingPrograms.map((program) => (
              <div key={program.id} className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-text mb-2">{program.title}</h4>
                <div className="flex items-center justify-between text-sm text-text/60">
                  <span>Start: {new Date(program.start_date).toLocaleDateString()}</span>
                  <span>{program.current_participants}/{program.max_participants} enrolled</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-accent h-2 rounded-full"
                    style={{ width: `${(program.current_participants / program.max_participants) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Google Sheets Integration */}
      <GoogleSheetsSync />

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
              <p className="text-text font-medium">New user registered</p>
              <p className="text-text/60 text-sm">Jane Participant joined as participant</p>
            </div>
            <span className="text-text/60 text-sm ml-auto">2 hours ago</span>
          </div>
          
          <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-text font-medium">Program enrollment milestone</p>
              <p className="text-text/60 text-sm">Digital Design Mastery reached 80% capacity</p>
            </div>
            <span className="text-text/60 text-sm ml-auto">5 hours ago</span>
          </div>
          
          <div className="flex items-center space-x-4 p-3 bg-orange-50 rounded-lg">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-text font-medium">Session completed</p>
              <p className="text-text/60 text-sm">Morning session of Industry 4.0 Fundamentals</p>
            </div>
            <span className="text-text/60 text-sm ml-auto">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function UsersManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const result = await getUsers();
      if (result.success) {
        setUsers(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('[USERS_MANAGEMENT] Error fetching users:', error);
      showNotification('error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        console.log('[DELETE_USER] Deleting user:', id);
        const result = await deleteUser(id);
        if (result.success) {
          await fetchUsers();
          showNotification('success', 'User deleted successfully!');
        } else {
          throw new Error(result.error || 'Failed to delete user');
        }
      } catch (error) {
        console.error('[DELETE_USER] Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete user';
        showNotification('error', errorMessage);
      }
    }
  };

  const handleUserAdded = () => {
    fetchUsers();
  };

  const handleUserUpdated = () => {
    fetchUsers();
  };

  const handleEditUser = (user: any) => {
    console.log('[EDIT_USER] Opening edit modal for user:', user.id);
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleExportUsers = async () => {
    try {
      console.log('[EXPORT_USERS] Starting export...');
      const result = await exportUsersReport();
      if (result.success) {
        // Create downloadable file
        const dataStr = JSON.stringify(result.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `users-report-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        showNotification('success', 'Users report exported successfully!');
      } else {
        throw new Error(result.error || 'Failed to export users');
      }
    } catch (error) {
      console.error('[EXPORT_USERS] Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to export users';
      showNotification('error', errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading users..." />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text">Users Management</h1>
          <div className="flex space-x-2">
            <button
              onClick={handleExportUsers}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all"
            >
              <Download className="h-5 w-5" />
              <span>Export</span>
            </button>
            <button
              onClick={() => {
                console.log('[ADD_USER] Opening add user modal');
                setShowAddModal(true);
              }}
              className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all"
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
                            {user.name.charAt(0).toUpperCase()}
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
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-secondary hover:text-secondary/80 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
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
      </div>
      
      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onUserAdded={handleUserAdded}
      />
      
      <EditUserModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingUser(null);
        }}
        onUserUpdated={handleUserUpdated}
        user={editingUser}
      />
    </>
  );
}

function ProgramsManagement() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const result = await getPrograms();
      if (result.success) {
        setPrograms(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch programs');
      }
    } catch (error) {
      console.error('[PROGRAMS_MANAGEMENT] Error fetching programs:', error);
      showNotification('error', 'Failed to load programs');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPrograms();
  }, []);

  const handleDeleteProgram = (id: string) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      try {
        console.log('[DELETE_PROGRAM] Deleting program:', id);
        const result = await deleteProgram(id);
        if (result.success) {
          await fetchPrograms();
          showNotification('success', 'Program deleted successfully!');
        } else {
          throw new Error(result.error || 'Failed to delete program');
        }
      } catch (error) {
        console.error('[DELETE_PROGRAM] Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete program';
        showNotification('error', errorMessage);
      }
    }
  };

  const handleProgramAdded = () => {
    fetchPrograms();
  };

  const handleProgramUpdated = () => {
    fetchPrograms();
  };

  const handleEditProgram = (program: any) => {
    console.log('[EDIT_PROGRAM] Opening edit modal for program:', program.id);
    setEditingProgram(program);
    setShowEditModal(true);
  };

  const handleExportPrograms = async () => {
    try {
      console.log('[EXPORT_PROGRAMS] Starting export...');
      const result = await exportProgramsReport();
      if (result.success) {
        // Create downloadable file
        const dataStr = JSON.stringify(result.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `programs-report-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        showNotification('success', 'Programs report exported successfully!');
      } else {
        throw new Error(result.error || 'Failed to export programs');
      }
    } catch (error) {
      console.error('[EXPORT_PROGRAMS] Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to export programs';
      showNotification('error', errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading programs..." />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text">Programs Management</h1>
          <div className="flex space-x-2">
            <button
              onClick={handleExportPrograms}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all"
            >
              <Download className="h-5 w-5" />
              <span>Export</span>
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all"
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
                    onClick={() => handleEditProgram(program)}
                    className="text-secondary hover:text-secondary/80 transition-colors"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => handleDeleteProgram(program.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
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
                  <p className="font-medium">{program.current_participants}/{program.max_participants}</p>
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
      </div>
      
      <AddProgramModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onProgramAdded={handleProgramAdded}
      />
      
      <EditProgramModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingProgram(null);
        }}
        onProgramUpdated={handleProgramUpdated}
        program={editingProgram}
      />
    </>
  );
}

function AttendanceOverview() {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [attendanceResult, sessionsResult, usersResult] = await Promise.all([
          getAttendance(),
          getSessions(),
          getUsers()
        ]);

        if (attendanceResult.success) setAttendance(attendanceResult.data);
        if (sessionsResult.success) setSessions(sessionsResult.data);
        if (usersResult.success) setUsers(usersResult.data);
      } catch (error) {
        console.error('[ATTENDANCE_OVERVIEW] Error fetching data:', error);
        showNotification('error', 'Failed to load attendance data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showNotification]);

  const handleExportAttendance = async () => {
    try {
      console.log('[EXPORT_ATTENDANCE] Starting export...');
      const result = await exportAttendanceReport();
      if (result.success) {
        // Create downloadable file
        const dataStr = JSON.stringify(result.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `attendance-report-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        showNotification('success', 'Attendance report exported successfully!');
      } else {
        throw new Error(result.error || 'Failed to export attendance');
      }
    } catch (error) {
      console.error('[EXPORT_ATTENDANCE] Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to export attendance';
      showNotification('error', errorMessage);
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
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading attendance..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Attendance Overview</h1>
        <button 
          onClick={handleExportAttendance}
          className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
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
                    <div className="text-sm font-medium text-text">{record.session?.title}</div>
                    <div className="text-sm text-text/60">{record.session?.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-text">{record.participant?.name}</div>
                    <div className="text-sm text-text/60">{record.participant?.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      record.status === 'present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text/60">
                    {new Date(record.timestamp).toLocaleString()}
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
  const { showNotification } = useNotification();
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [apiEndpoint, setApiEndpoint] = useState(import.meta.env.VITE_GOOGLE_SHEETS_API_URL || '');

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    console.log('[TEST_CONNECTION] Testing Google Sheets connection to:', apiEndpoint);
    
    try {
      const result = await testGoogleSheetsConnection();
      
      setTestResult(result);
      
      if (result.success) {
        showNotification('success', 'Google Sheets connection successful!');
      } else {
        showNotification('error', result.error || 'Google Sheets connection failed');
      }
    } catch (error) {
      console.error('[TEST_CONNECTION] Connection failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setTestResult({ success: false, message: errorMessage });
      showNotification('error', `Google Sheets connection failed: ${errorMessage}`);
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <div className="space-y-6">
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
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                placeholder="Google Apps Script URL"
                readOnly
              />
            </div>
            <button 
              onClick={handleTestConnection}
              disabled={isTestingConnection}
              className="bg-secondary hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all flex items-center space-x-2"
            >
              {isTestingConnection ? (
                <LoadingSpinner size="sm" text="Testing..." />
              ) : (
                'Test Connection'
              )}
            </button>
            
            {/* Test Result */}
            {testResult && (
              <div className={`mt-4 p-4 rounded-lg ${
                testResult.success 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <div className="flex items-center space-x-2">
                  {testResult.success ? (
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  ) : (
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✗</span>
                    </div>
                  )}
                  <span className="font-medium">
                    {testResult.success ? 'Connection Successful' : 'Connection Failed'}
                  </span>
                </div>
                <p className="mt-2 text-sm">{testResult.message}</p>
              </div>
            )}
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