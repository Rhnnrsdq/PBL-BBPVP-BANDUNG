import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { 
  Calendar, 
  Users, 
  BookOpen, 
  CheckCircle, 
  Clock,
  FileText,
  BarChart3,
  User,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload
} from 'lucide-react';
import { 
  getSessions, 
  getPrograms, 
  getUsers, 
  getAttendance,
  getAssignments,
  getAssignmentSubmissions,
  addSession,
  updateSession,
  deleteSession,
  addAssignment,
  updateAssignment,
  deleteAssignment,
  addAttendance
} from '../../data/mockData';
import { useAuth } from '../../hooks/useAuth';
import { saveAttendanceRecord, exportParticipantsList } from '../../utils/googleSheetsApi';

function TrainerOverview() {
  const { user } = useAuth();
  const sessions = getSessions().filter(s => s.trainer_id === user?.id);
  const programs = getPrograms().filter(p => p.trainer_id === user?.id);
  const users = getUsers();
  const attendance = getAttendance();

  const todaysSessions = sessions.filter(s => s.date === new Date().toISOString().split('T')[0]);
  const totalParticipants = programs.reduce((sum, p) => sum + p.current_participants, 0);
  const attendanceRate = attendance.length > 0 
    ? Math.round((attendance.filter(a => a.status === 'present').length / attendance.length) * 100)
    : 0;

  const stats = [
    {
      title: "Today's Sessions",
      value: todaysSessions.length,
      icon: Calendar,
      color: 'bg-blue-500'
    },
    {
      title: 'My Programs',
      value: programs.length,
      icon: BookOpen,
      color: 'bg-green-500'
    },
    {
      title: 'Total Participants',
      value: totalParticipants,
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: 'Attendance Rate',
      value: `${attendanceRate}%`,
      icon: BarChart3,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-text mb-2">Trainer Dashboard</h1>
        <p className="text-text/70">Manage your sessions and track participant progress</p>
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
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Sessions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-text mb-6">Today's Sessions</h3>
          {todaysSessions.length > 0 ? (
            <div className="space-y-4">
              {todaysSessions.map((session) => {
                const program = programs.find(p => p.id === session.training_id);
                return (
                  <div key={session.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-text">{session.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        session.time_slot === 'AM' 
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {session.time_slot === 'AM' ? '08:00 - 12:00' : '13:00 - 17:00'}
                      </span>
                    </div>
                    {program && (
                      <p className="text-text/60 text-sm mb-3">{program.title}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-text/60 text-sm">
                        {program ? `${program.current_participants} participants` : 'Loading...'}
                      </span>
                      <button className="text-secondary hover:text-secondary/80 text-sm font-medium">
                        Start Session
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-text/60">No sessions scheduled for today</p>
            </div>
          )}
        </div>

        {/* My Programs */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-text mb-6">My Programs</h3>
          <div className="space-y-4">
            {programs.map((program) => (
              <div key={program.id} className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-text mb-2">{program.title}</h4>
                <div className="flex items-center justify-between text-sm text-text/60 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    program.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                    program.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {program.status}
                  </span>
                  <span>{program.current_participants}/{program.max_participants} enrolled</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
          <h4 className="font-semibold text-text mb-2">Mark Attendance</h4>
          <p className="text-text/60 text-sm">Record participant attendance for sessions</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h4 className="font-semibold text-text mb-2">Manage Assignments</h4>
          <p className="text-text/60 text-sm">Create and review participant assignments</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <h4 className="font-semibold text-text mb-2">View Reports</h4>
          <p className="text-text/60 text-sm">Track participant progress and performance</p>
        </div>
      </div>
    </div>
  );
}

function SessionsManagement() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState(getSessions().filter(s => s.trainer_id === user?.id));
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSession, setEditingSession] = useState<any>(null);
  const programs = getPrograms().filter(p => p.trainer_id === user?.id);

  const handleAddSession = (sessionData: any) => {
    const newSession = {
      ...sessionData,
      id: Date.now().toString(),
      trainer_id: user?.id || ''
    };
    addSession(newSession);
    setSessions(getSessions().filter(s => s.trainer_id === user?.id));
    setShowAddForm(false);
  };

  const handleDeleteSession = (id: string) => {
    if (confirm('Are you sure you want to delete this session?')) {
      deleteSession(id);
      setSessions(getSessions().filter(s => s.trainer_id === user?.id));
    }
  };

  const handleExportParticipants = async (sessionId: string) => {
    const blob = await exportParticipantsList(sessionId);
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `participants-${sessionId}.csv`;
      a.click();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Sessions Management</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Session</span>
        </button>
      </div>

      <div className="grid gap-6">
        {sessions.map((session) => {
          const program = programs.find(p => p.id === session.training_id);
          return (
            <div key={session.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-text">{session.title}</h3>
                  <p className="text-text/60">{program?.title}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleExportParticipants(session.id)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setEditingSession(session)}
                    className="text-secondary hover:text-secondary/80"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteSession(session.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-text/60">Date:</span>
                  <p className="font-medium">{new Date(session.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-text/60">Time:</span>
                  <p className="font-medium">{session.time_slot === 'AM' ? '08:00 - 12:00' : '13:00 - 17:00'}</p>
                </div>
                <div>
                  <span className="text-text/60">Location:</span>
                  <p className="font-medium">{session.location || 'TBA'}</p>
                </div>
                <div>
                  <span className="text-text/60">Participants:</span>
                  <p className="font-medium">{program?.current_participants || 0}</p>
                </div>
              </div>
              {session.description && (
                <p className="text-text/70 mt-4">{session.description}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AssignmentsManagement() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState(getAssignments());
  const [submissions, setSubmissions] = useState(getAssignmentSubmissions());
  const [showAddForm, setShowAddForm] = useState(false);
  const programs = getPrograms().filter(p => p.trainer_id === user?.id);

  const trainerAssignments = assignments.filter(a => 
    programs.some(p => p.id === a.training_id)
  );

  const handleAddAssignment = (assignmentData: any) => {
    const newAssignment = {
      ...assignmentData,
      id: Date.now().toString(),
      created_by: user?.id || '',
      created_at: new Date().toISOString()
    };
    addAssignment(newAssignment);
    setAssignments(getAssignments());
    setShowAddForm(false);
  };

  const handleDeleteAssignment = (id: string) => {
    if (confirm('Are you sure you want to delete this assignment?')) {
      deleteAssignment(id);
      setAssignments(getAssignments());
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Assignments Management</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Assignment</span>
        </button>
      </div>

      <div className="grid gap-6">
        {trainerAssignments.map((assignment) => {
          const program = programs.find(p => p.id === assignment.training_id);
          const assignmentSubmissions = submissions.filter(s => s.assignment_id === assignment.id);
          
          return (
            <div key={assignment.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-text">{assignment.title}</h3>
                  <p className="text-text/60">{program?.title}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="text-secondary hover:text-secondary/80">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteAssignment(assignment.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <p className="text-text/70 mb-4">{assignment.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                <div>
                  <span className="text-text/60">Due Date:</span>
                  <p className="font-medium">{new Date(assignment.due_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-text/60">Submissions:</span>
                  <p className="font-medium">{assignmentSubmissions.length}</p>
                </div>
                <div>
                  <span className="text-text/60">Created:</span>
                  <p className="font-medium">{new Date(assignment.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <button className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-lg text-sm">
                View Submissions
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AttendanceManagement() {
  const { user } = useAuth();
  const [selectedSession, setSelectedSession] = useState('');
  const [attendanceList, setAttendanceList] = useState<any[]>([]);
  const sessions = getSessions().filter(s => s.trainer_id === user?.id);
  const users = getUsers().filter(u => u.role === 'participant');

  const handleSessionSelect = (sessionId: string) => {
    setSelectedSession(sessionId);
    const attendance = getAttendance().filter(a => a.session_id === sessionId);
    const attendanceWithUsers = users.map(participant => {
      const record = attendance.find(a => a.participant_id === participant.id);
      return {
        participant,
        status: record?.status || 'absent',
        id: record?.id || null
      };
    });
    setAttendanceList(attendanceWithUsers);
  };

  const handleAttendanceChange = async (participantId: string, status: 'present' | 'absent') => {
    const session = sessions.find(s => s.id === selectedSession);
    const participant = users.find(u => u.id === participantId);
    
    if (session && participant) {
      const attendanceRecord = {
        id: Date.now().toString(),
        session_id: selectedSession,
        participant_id: participantId,
        status,
        timestamp: new Date().toISOString()
      };

      addAttendance(attendanceRecord);
      
      // Save to Google Sheets
      await saveAttendanceRecord({
        sessionId: selectedSession,
        participantId,
        participantName: participant.name,
        status,
        timestamp: attendanceRecord.timestamp,
        sessionTitle: session.title
      });

      // Update local state
      setAttendanceList(prev => 
        prev.map(item => 
          item.participant.id === participantId 
            ? { ...item, status, id: attendanceRecord.id }
            : item
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text">Attendance Management</h1>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-text mb-2">Select Session</label>
          <select
            value={selectedSession}
            onChange={(e) => handleSessionSelect(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
          >
            <option value="">Choose a session...</option>
            {sessions.map(session => (
              <option key={session.id} value={session.id}>
                {session.title} - {new Date(session.date).toLocaleDateString()} ({session.time_slot})
              </option>
            ))}
          </select>
        </div>

        {selectedSession && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text">Mark Attendance</h3>
            <div className="space-y-3">
              {attendanceList.map(({ participant, status }) => (
                <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {participant.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-text">{participant.name}</p>
                      <p className="text-text/60 text-sm">{participant.email}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAttendanceChange(participant.id, 'present')}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        status === 'present' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-green-100'
                      }`}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => handleAttendanceChange(participant.id, 'absent')}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        status === 'absent' 
                          ? 'bg-red-500 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-red-100'
                      }`}
                    >
                      Absent
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ParticipantsManagement() {
  const { user } = useAuth();
  const programs = getPrograms().filter(p => p.trainer_id === user?.id);
  const users = getUsers().filter(u => u.role === 'participant');
  const attendance = getAttendance();

  const participantsWithStats = users.map(participant => {
    const participantAttendance = attendance.filter(a => a.participant_id === participant.id);
    const attendanceRate = participantAttendance.length > 0 
      ? Math.round((participantAttendance.filter(a => a.status === 'present').length / participantAttendance.length) * 100)
      : 0;

    return {
      ...participant,
      attendanceRate,
      totalSessions: participantAttendance.length
    };
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text">Participants Management</h1>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {participantsWithStats.map((participant) => (
                <tr key={participant.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {participant.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-text">{participant.name}</div>
                        <div className="text-sm text-text/60">{participant.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                    {participant.totalSessions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      participant.attendanceRate >= 80 ? 'bg-green-100 text-green-700' :
                      participant.attendanceRate >= 60 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {participant.attendanceRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-secondary hover:text-secondary/80">
                      View Details
                    </button>
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

export default function TrainerDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<TrainerOverview />} />
        <Route path="/sessions" element={<SessionsManagement />} />
        <Route path="/assignments" element={<AssignmentsManagement />} />
        <Route path="/attendance" element={<AttendanceManagement />} />
        <Route path="/participants" element={<ParticipantsManagement />} />
      </Routes>
    </DashboardLayout>
  );
}