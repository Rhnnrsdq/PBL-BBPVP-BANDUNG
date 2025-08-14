import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import GoogleSheetsSync from '../../components/GoogleSheetsSync';
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
import { 
  getUsers, 
  getPrograms, 
  getSessions, 
  getAttendance,
  getAssignments,
  deleteUser,
  deleteProgram,
  deleteSession,
  addProgram,
  addSession,
  addUser
} from '../../data/mockData';

function AdminOverview() {
  const users = getUsers();
  const programs = getPrograms();
  const sessions = getSessions();
  const attendance = getAttendance();

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
            <button className="flex items-center space-x-2 text-secondary hover:text-secondary/80 transition-colors">
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
            <button className="flex items-center space-x-2 text-secondary hover:text-secondary/80 transition-colors">
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
  const [users, setUsers] = useState(getUsers());
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteUser(id);
      setUsers(getUsers());
    }
  };

  const handleAddUser = (userData: any) => {
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    addUser(newUser);
    setUsers(getUsers());
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Users Management</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <UserPlus className="h-5 w-5" />
          <span>Add User</span>
        </button>
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
    </div>
  );
}

function ProgramsManagement() {
  const [programs, setPrograms] = useState(getPrograms());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Programs Management</h1>
        <button className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <PlusCircle className="h-5 w-5" />
          <span>Add Program</span>
        </button>
      </div>

      <div className="grid gap-6">
        {programs.map((program) => (
          <div key={program.id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-text">{program.title}</h3>
              <div className="flex space-x-2">
                <button className="text-secondary hover:text-secondary/80">
                  <Edit className="h-5 w-5" />
                </button>
                <button className="text-red-600 hover:text-red-800">
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
  );
}

function AttendanceOverview() {
  const attendance = getAttendance();
  const sessions = getSessions();
  const users = getUsers();

  const attendanceWithDetails = attendance.map(record => {
    const session = sessions.find(s => s.id === record.session_id);
    const participant = users.find(u => u.id === record.participant_id);
    return {
      ...record,
      session,
      participant
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Attendance Overview</h1>
        <button className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
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
                defaultValue="https://script.google.com/macros/s/AKfycbx_jYcPeua9Gf7oo5qRgo1iFFxSfAv_6x2ld-21WFLksbMVhWKyHGZirp9bskHQPU4Oow/exec"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>
            <button className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-lg">
              Test Connection
            </button>
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