import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import Notification from '../../components/Notification';
import { useNotification } from '../../hooks/useNotification';
import { 
  BookOpen, 
  Calendar, 
  FileText, 
  BarChart3, 
  CheckCircle,
  Clock,
  Award,
  Target,
  Upload,
  Download,
  Plus,
  Eye
} from 'lucide-react';
import { 
  fetchPrograms,
  fetchSessions,
  fetchAttendance,
  fetchEnrollments,
  fetchAssignments,
  fetchAssignmentSubmissions,
  createAttendance,
  createEnrollment,
  createAssignmentSubmission
} from '../../utils/googleSheetsApi';
import { useAuth } from '../../hooks/useAuth';

function ParticipantOverview() {
  const { user } = useAuth();
  const [programs, setPrograms] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { notifications, showNotification, removeNotification } = useNotification();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [programsRes, enrollmentsRes, sessionsRes, attendanceRes, assignmentsRes, submissionsRes] = await Promise.all([
        fetchPrograms(),
        fetchEnrollments(),
        fetchSessions(),
        fetchAttendance(),
        fetchAssignments(),
        fetchAssignmentSubmissions()
      ]);

      if (programsRes.success) setPrograms(programsRes.data || []);
      if (enrollmentsRes.success) {
        const userEnrollments = (enrollmentsRes.data || []).filter((e: any) => e.participant_id === user?.id);
        setEnrollments(userEnrollments);
      }
      if (sessionsRes.success) setSessions(sessionsRes.data || []);
      if (attendanceRes.success) {
        setAttendance((attendanceRes.data || []).filter((a: any) => a.participant_id === user?.id));
      }
      if (assignmentsRes.success) setAssignments(assignmentsRes.data || []);
      if (submissionsRes.success) {
        setSubmissions((submissionsRes.data || []).filter((s: any) => s.participant_id === user?.id));
      }
    } catch (error) {
      showNotification('error', 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const enrolledPrograms = programs.filter(p => 
    enrollments.some(e => e.training_id === p.id)
  );

  const upcomingSessions = sessions.filter(s => {
    const sessionDate = new Date(s.date);
    const today = new Date();
    return sessionDate >= today && enrolledPrograms.some(p => p.id === s.training_id);
  }).slice(0, 3);

  const attendanceRate = attendance.length > 0 
    ? Math.round((attendance.filter(a => a.status === 'present').length / attendance.length) * 100)
    : 0;
  
  const enrolledAssignments = assignments.filter(a => 
    enrolledPrograms.some(p => p.id === a.training_id)
  );
  const completedAssignments = submissions.length;
  const totalAssignments = enrolledAssignments.length;

  const stats = [
    {
      title: 'Enrolled Programs',
      value: enrolledPrograms.length,
      icon: BookOpen,
      color: 'bg-blue-500'
    },
    {
      title: 'Attendance Rate',
      value: `${attendanceRate}%`,
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      title: 'Assignments',
      value: `${completedAssignments}/${totalAssignments}`,
      icon: FileText,
      color: 'bg-purple-500'
    },
    {
      title: 'Progress',
      value: totalAssignments > 0 ? `${Math.round((completedAssignments / totalAssignments) * 100)}%` : '0%',
      icon: BarChart3,
      color: 'bg-orange-500'
    }
  ];

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
        <h1 className="text-2xl font-bold text-text mb-2">My Dashboard</h1>
        <p className="text-text/70">Track your learning progress and upcoming sessions</p>
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
        {/* My Programs */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-text mb-6">My Programs</h3>
          <div className="space-y-4">
            {enrolledPrograms.map((program) => (
              <div key={program.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-text">{program.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    program.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                    program.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {program.status}
                  </span>
                </div>
                <p className="text-text/60 text-sm mb-3">{program.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text/60">
                    {new Date(program.start_date).toLocaleDateString()} - {new Date(program.end_date).toLocaleDateString()}
                  </span>
                  <button className="text-secondary hover:text-secondary/80 font-medium">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-text mb-6">Upcoming Sessions</h3>
          <div className="space-y-4">
            {upcomingSessions.map((session) => {
              const program = programs.find(p => p.id === session.training_id);
              return (
                <div key={session.id} className="p-4 bg-gray-50 rounded-lg">
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
                  <p className="text-text/60 text-sm mb-2">
                    {program ? program.title : 'Loading program...'}
                  </p>
                  <p className="text-text/60 text-sm">
                    📅 {new Date(session.date).toLocaleDateString()}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function MyTrainings() {
  const { user } = useAuth();
  const [programs, setPrograms] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { notifications, showNotification, removeNotification } = useNotification();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [programsRes, enrollmentsRes] = await Promise.all([
        fetchPrograms(),
        fetchEnrollments()
      ]);

      if (programsRes.success) setPrograms(programsRes.data || []);
      if (enrollmentsRes.success) {
        setEnrollments((enrollmentsRes.data || []).filter((e: any) => e.participant_id === user?.id));
      }
    } catch (error) {
      showNotification('error', 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const enrolledPrograms = programs.filter(p => 
    enrollments.some(e => e.training_id === p.id)
  );
  const unenrolledPrograms = programs.filter(p => 
    !enrollments.some(e => e.training_id === p.id) && p.status !== 'completed'
  );

  const handleEnroll = async (programId: string) => {
    if (user) {
      try {
        const enrollmentData = {
          participant_id: user.id,
          training_id: programId,
          enrolled_at: new Date().toISOString(),
          status: 'active'
        };

        const result = await createEnrollment(enrollmentData);
        if (result.success) {
          await fetchData();
          showNotification('success', 'Successfully enrolled in the program!');
        } else {
          showNotification('error', result.error || 'Failed to enroll in program');
        }
      } catch (error) {
        showNotification('error', 'Failed to enroll in program');
      }
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

      <h1 className="text-2xl font-bold text-text">My Trainings</h1>

      {/* Enrolled Programs */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-text mb-6">Enrolled Programs</h3>
        {enrolledPrograms.length > 0 ? (
          <div className="grid gap-6">
            {enrolledPrograms.map((program) => (
              <div key={program.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-text">{program.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    program.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                    program.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {program.status}
                  </span>
                </div>
                <p className="text-text/60 text-sm mb-3">{program.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-text/60">Start Date:</span>
                    <p className="font-medium">{new Date(program.start_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-text/60">End Date:</span>
                    <p className="font-medium">{new Date(program.end_date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-text/60 text-center py-8">You haven't enrolled in any programs yet.</p>
        )}
      </div>

      {/* Available Programs */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-text mb-6">Available Programs</h3>
        {unenrolledPrograms.length > 0 ? (
          <div className="grid gap-6">
            {unenrolledPrograms.map((program) => (
              <div key={program.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-text">{program.title}</h4>
                  <button
                    onClick={() => handleEnroll(program.id)}
                    className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Enroll Now
                  </button>
                </div>
                <p className="text-text/60 text-sm mb-3">{program.description}</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
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
                      program.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {program.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-text/60 text-center py-8">No available programs at the moment.</p>
        )}
      </div>
    </div>
  );
}

function MyAssignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<string>('');
  const [submissionContent, setSubmissionContent] = useState('');
  const [loading, setLoading] = useState(true);
  const { notifications, showNotification, removeNotification } = useNotification();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [assignmentsRes, submissionsRes, enrollmentsRes] = await Promise.all([
        fetchAssignments(),
        fetchAssignmentSubmissions(),
        fetchEnrollments()
      ]);

      if (enrollmentsRes.success) {
        const userEnrollments = (enrollmentsRes.data || []).filter((e: any) => e.participant_id === user?.id);
        setEnrollments(userEnrollments);
        
        if (assignmentsRes.success) {
          const userAssignments = (assignmentsRes.data || []).filter((a: any) => 
            userEnrollments.some((e: any) => e.training_id === a.training_id)
          );
          setAssignments(userAssignments);
        }
      }
      
      if (submissionsRes.success) {
        setSubmissions((submissionsRes.data || []).filter((s: any) => s.participant_id === user?.id));
      }
    } catch (error) {
      showNotification('error', 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const handleSubmitAssignment = async () => {
    if (user && selectedAssignment && submissionContent.trim()) {
      try {
        const submissionData = {
          assignment_id: selectedAssignment,
          participant_id: user.id,
          content: submissionContent,
          submitted_at: new Date().toISOString()
        };

        const result = await createAssignmentSubmission(submissionData);
        if (result.success) {
          await fetchData();
          setSubmissionContent('');
          setSelectedAssignment('');
          showNotification('success', 'Assignment submitted successfully!');
        } else {
          showNotification('error', result.error || 'Failed to submit assignment');
        }
      } catch (error) {
        showNotification('error', 'Failed to submit assignment');
      }
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

      <h1 className="text-2xl font-bold text-text">My Assignments</h1>

      {/* Assignment List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-text mb-6">Available Assignments</h3>
        <div className="space-y-4">
          {assignments.map((assignment) => {
            const submission = submissions.find(s => s.assignment_id === assignment.id);
            const isOverdue = new Date(assignment.due_date) < new Date();
            
            return (
              <div key={assignment.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-text">{assignment.title}</h4>
                  <div className="flex items-center space-x-2">
                    {submission ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Submitted
                      </span>
                    ) : isOverdue ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        Overdue
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-text/60 text-sm mb-3">{assignment.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text/60">
                    Due: {new Date(assignment.due_date).toLocaleDateString()}
                  </span>
                  {!submission && !isOverdue && (
                    <button
                      onClick={() => setSelectedAssignment(assignment.id)}
                      className="text-secondary hover:text-secondary/80 font-medium"
                    >
                      Submit Assignment
                    </button>
                  )}
                  {submission && (
                    <button className="text-green-600 hover:text-green-800 font-medium">
                      View Submission
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submission Form */}
      {selectedAssignment && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-text mb-6">Submit Assignment</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-2">Assignment Content</label>
              <textarea
                value={submissionContent}
                onChange={(e) => setSubmissionContent(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                placeholder="Enter your assignment content here..."
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleSubmitAssignment}
                disabled={!submissionContent.trim()}
                className="bg-secondary hover:bg-secondary/90 disabled:opacity-50 text-white px-6 py-2 rounded-lg"
              >
                Submit Assignment
              </button>
              <button
                onClick={() => {
                  setSelectedAssignment('');
                  setSubmissionContent('');
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MyAttendance() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { notifications, showNotification, removeNotification } = useNotification();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sessionsRes, programsRes, enrollmentsRes, attendanceRes] = await Promise.all([
        fetchSessions(),
        fetchPrograms(),
        fetchEnrollments(),
        fetchAttendance()
      ]);

      if (programsRes.success) setPrograms(programsRes.data || []);
      if (enrollmentsRes.success) {
        const userEnrollments = (enrollmentsRes.data || []).filter((e: any) => e.participant_id === user?.id);
        setEnrollments(userEnrollments);
        
        if (sessionsRes.success) {
          const enrolledPrograms = (programsRes.data || []).filter((p: any) => 
            userEnrollments.some((e: any) => e.training_id === p.id)
          );
          const availableSessions = (sessionsRes.data || []).filter((s: any) => 
            enrolledPrograms.some((p: any) => p.id === s.training_id)
          );
          setSessions(availableSessions);
        }
      }
      
      if (attendanceRes.success) {
        setAttendance((attendanceRes.data || []).filter((a: any) => a.participant_id === user?.id));
      }
    } catch (error) {
      showNotification('error', 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const handleMarkAttendance = async (sessionId: string) => {
    if (user) {
      try {
        const attendanceData = {
          session_id: sessionId,
          participant_id: user.id,
          status: 'present',
          timestamp: new Date().toISOString()
        };

        const result = await createAttendance(attendanceData);
        if (result.success) {
          await fetchData();
          showNotification('success', 'Attendance marked successfully!');
        } else {
          showNotification('error', result.error || 'Failed to mark attendance');
        }
      } catch (error) {
        showNotification('error', 'Failed to mark attendance');
      }
    }
  };

  const todaySessions = sessions.filter(s => 
    s.date === new Date().toISOString().split('T')[0]
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
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

      <h1 className="text-2xl font-bold text-text">My Attendance</h1>

      {/* Today's Sessions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-text mb-6">Today's Sessions</h3>
        {todaySessions.length > 0 ? (
          <div className="space-y-4">
            {todaySessions.map((session) => {
              const hasAttended = attendance.some(a => a.session_id === session.id);
              const program = programs.find(p => p.id === session.training_id);
              const currentTime = new Date();
              const sessionDate = new Date(session.date);
              const canMarkAttendance = sessionDate.toDateString() === currentTime.toDateString();
              
              return (
                <div key={session.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-text">{session.title}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        session.time_slot === 'AM' 
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {session.time_slot === 'AM' ? '08:00 - 12:00' : '13:00 - 17:00'}
                      </span>
                      {hasAttended ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Attended
                        </span>
                      ) : canMarkAttendance ? (
                        <button
                          onClick={() => handleMarkAttendance(session.id)}
                          className="bg-secondary hover:bg-secondary/90 text-white px-3 py-1 rounded-full text-xs font-medium"
                        >
                          Mark Attendance
                        </button>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          Not Available
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-text/60 text-sm">{program?.title || 'Unknown Program'}</p>
                  <p className="text-text/60 text-sm">{session.location || 'Location TBA'}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-text/60 text-center py-8">No sessions scheduled for today.</p>
        )}
      </div>

      {/* Attendance History */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-text mb-6">Attendance History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Session</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendance.map((record) => {
                const session = sessions.find(s => s.id === record.session_id);
                return (
                  <tr key={record.id}>
                    <td className="px-4 py-2 text-sm text-text">{session?.title || 'Unknown Session'}</td>
                    <td className="px-4 py-2 text-sm text-text/60">{session ? new Date(session.date).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-2 text-sm text-text/60">{session?.time_slot || '-'}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === 'present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ProgressTracking() {
  const { user } = useAuth();
  const [programs, setPrograms] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { notifications, showNotification, removeNotification } = useNotification();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [programsRes, enrollmentsRes, attendanceRes, assignmentsRes, submissionsRes, sessionsRes] = await Promise.all([
        fetchPrograms(),
        fetchEnrollments(),
        fetchAttendance(),
        fetchAssignments(),
        fetchAssignmentSubmissions(),
        fetchSessions()
      ]);

      if (programsRes.success) setPrograms(programsRes.data || []);
      if (enrollmentsRes.success) {
        setEnrollments((enrollmentsRes.data || []).filter((e: any) => e.participant_id === user?.id));
      }
      if (attendanceRes.success) {
        setAttendance((attendanceRes.data || []).filter((a: any) => a.participant_id === user?.id));
      }
      if (assignmentsRes.success) setAssignments(assignmentsRes.data || []);
      if (submissionsRes.success) {
        setSubmissions((submissionsRes.data || []).filter((s: any) => s.participant_id === user?.id));
      }
      if (sessionsRes.success) setSessions(sessionsRes.data || []);
    } catch (error) {
      showNotification('error', 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const enrolledPrograms = programs.filter(p => 
    enrollments.some(e => e.training_id === p.id)
  );

  const progressData = enrolledPrograms.map(program => {
    const programSessions = sessions.filter(s => s.training_id === program.id);
    const programAttendance = attendance.filter(a => {
      return programSessions.some(s => s.id === a.session_id);
    });
    
    const programAssignments = assignments.filter(a => a.training_id === program.id);
    const programSubmissions = submissions.filter(s => 
      programAssignments.some(a => a.id === s.assignment_id)
    );

    const attendanceRate = programSessions.length > 0 
      ? Math.round((programAttendance.filter(a => a.status === 'present').length / programSessions.length) * 100)
      : 0;
    
    const assignmentRate = programAssignments.length > 0 
      ? Math.round((programSubmissions.length / programAssignments.length) * 100)
      : 0;

    const overallProgress = Math.round((attendanceRate + assignmentRate) / 2);

    return {
      program,
      attendanceRate,
      assignmentRate,
      overallProgress,
      totalSessions: programSessions.length,
      attendedSessions: programAttendance.filter(a => a.status === 'present').length,
      totalAssignments: programAssignments.length,
      completedAssignments: programSubmissions.length
    };
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
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

      <h1 className="text-2xl font-bold text-text">Progress Tracking</h1>

      {/* Overall Progress */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-text mb-6">Overall Progress</h3>
        <div className="grid gap-6">
          {progressData.map(({ program, attendanceRate, assignmentRate, overallProgress, totalSessions, attendedSessions, totalAssignments, completedAssignments }) => (
            <div key={program.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-text">{program.title}</h4>
                <span className="text-2xl font-bold text-secondary">{overallProgress}%</span>
              </div>
              
              <div className="space-y-4">
                {/* Attendance Progress */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-text/80">Attendance</span>
                    <span className="text-sm font-medium">{attendanceRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${attendanceRate}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-text/60 mt-1">{attendedSessions}/{totalSessions} sessions attended</p>
                </div>

                {/* Assignment Progress */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-text/80">Assignments</span>
                    <span className="text-sm font-medium">{assignmentRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${assignmentRate}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-text/60 mt-1">{completedAssignments}/{totalAssignments} assignments completed</p>
                </div>

                {/* Overall Progress */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-text/80">Overall Progress</span>
                    <span className="text-sm font-medium">{overallProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-secondary h-3 rounded-full transition-all duration-300"
                      style={{ width: `${overallProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-text mb-6">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <h4 className="font-semibold text-text">Perfect Attendance</h4>
            <p className="text-sm text-text/60">100% attendance in a program</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-semibold text-text">Assignment Master</h4>
            <p className="text-sm text-text/60">Completed all assignments on time</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-semibold text-text">Program Graduate</h4>
            <p className="text-sm text-text/60">Successfully completed a program</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ParticipantDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<ParticipantOverview />} />
        <Route path="/my-trainings" element={<MyTrainings />} />
        <Route path="/assignments" element={<MyAssignments />} />
        <Route path="/attendance" element={<MyAttendance />} />
        <Route path="/progress" element={<ProgressTracking />} />
      </Routes>
    </DashboardLayout>
  );
}