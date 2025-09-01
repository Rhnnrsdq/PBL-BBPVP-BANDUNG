import { User, TrainingProgram, Session, Attendance, Department, Assignment, AssignmentSubmission, Enrollment } from '../types';
import { getStorageItem, setStorageItem } from '../utils/storage';

const initialUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@bbpvp.com',
    password_hash: 'admin123',
    role: 'admin',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'John Trainer',
    email: 'trainer@bbpvp.com',
    password_hash: 'trainer123',
    role: 'trainer',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Jane Participant',
    email: 'participant@bbpvp.com',
    password_hash: 'participant123',
    role: 'participant',
    created_at: '2024-01-01T00:00:00Z'
  }
];

const initialPrograms: TrainingProgram[] = [
  {
    id: '1',
    title: 'Digital Design Mastery',
    description: 'Comprehensive training in modern digital design tools and techniques',
    department: 'smart-creative',
    start_date: '2024-02-01',
    end_date: '2024-02-28',
    trainer_id: '2',
    max_participants: 25,
    current_participants: 18,
    status: 'upcoming'
  },
  {
    id: '2',
    title: 'Content Creation Workshop',
    description: 'Learn to create engaging content across multiple platforms',
    department: 'smart-creative',
    start_date: '2024-02-15',
    end_date: '2024-03-15',
    trainer_id: '2',
    max_participants: 20,
    current_participants: 12,
    status: 'upcoming'
  },
  {
    id: '3',
    title: 'Industry 4.0 Fundamentals',
    description: 'Introduction to smart manufacturing and automation',
    department: 'smart-manufacturing',
    start_date: '2024-01-20',
    end_date: '2024-02-20',
    trainer_id: '2',
    max_participants: 30,
    current_participants: 25,
    status: 'ongoing'
  },
  {
    id: '4',
    title: 'IoT in Manufacturing',
    description: 'Implementing Internet of Things solutions in manufacturing',
    department: 'smart-manufacturing',
    start_date: '2024-03-01',
    end_date: '2024-03-31',
    trainer_id: '2',
    max_participants: 20,
    current_participants: 8,
    status: 'upcoming'
  },
  {
    id: '5',
    title: 'Digital Tourism Marketing',
    description: 'Leveraging digital platforms for tourism promotion',
    department: 'smart-tourism',
    start_date: '2024-02-10',
    end_date: '2024-03-10',
    trainer_id: '2',
    max_participants: 25,
    current_participants: 15,
    status: 'upcoming'
  },
  {
    id: '6',
    title: 'Sustainable Tourism Practices',
    description: 'Building eco-friendly and sustainable tourism experiences',
    department: 'smart-tourism',
    start_date: '2024-01-15',
    end_date: '2024-02-15',
    trainer_id: '2',
    max_participants: 30,
    current_participants: 22,
    status: 'ongoing'
  }
];

const initialSessions: Session[] = [
  {
    id: '1',
    training_id: '1',
    date: '2024-01-25',
    time_slot: 'AM',
    trainer_id: '2',
    title: 'Introduction to Digital Design',
    description: 'Basic concepts and tools overview',
    location: 'Lab A'
  },
  {
    id: '2',
    training_id: '1',
    date: '2024-01-25',
    time_slot: 'PM',
    trainer_id: '2',
    title: 'Design Tools Overview',
    description: 'Hands-on with design software',
    location: 'Lab A'
  },
  {
    id: '3',
    training_id: '3',
    date: '2024-01-26',
    time_slot: 'AM',
    trainer_id: '2',
    title: 'Industry 4.0 Concepts',
    description: 'Understanding modern manufacturing',
    location: 'Lab B'
  }
];

const initialAssignments: Assignment[] = [
  {
    id: '1',
    training_id: '1',
    title: 'Design Portfolio Project',
    description: 'Create a comprehensive design portfolio showcasing learned techniques',
    due_date: '2024-02-20',
    created_by: '2',
    created_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    training_id: '3',
    title: 'Industry 4.0 Case Study',
    description: 'Analyze a real-world Industry 4.0 implementation',
    due_date: '2024-02-10',
    created_by: '2',
    created_at: '2024-01-20T00:00:00Z'
  }
];

const initialEnrollments: Enrollment[] = [
  {
    id: '1',
    participant_id: '3',
    training_id: '1',
    enrolled_at: '2024-01-10T00:00:00Z',
    status: 'active'
  },
  {
    id: '2',
    participant_id: '3',
    training_id: '3',
    enrolled_at: '2024-01-15T00:00:00Z',
    status: 'active'
  }
];

// Initialize data if not exists
export function initializeData() {
  if (!getStorageItem('users')) {
    setStorageItem('users', initialUsers);
  }
  if (!getStorageItem('programs')) {
    setStorageItem('programs', initialPrograms);
  }
  if (!getStorageItem('sessions')) {
    setStorageItem('sessions', initialSessions);
  }
  if (!getStorageItem('attendance')) {
    setStorageItem('attendance', []);
  }
  if (!getStorageItem('assignments')) {
    setStorageItem('assignments', initialAssignments);
  }
  if (!getStorageItem('assignmentSubmissions')) {
    setStorageItem('assignmentSubmissions', []);
  }
  if (!getStorageItem('enrollments')) {
    setStorageItem('enrollments', initialEnrollments);
  }
}

// Call initialization
initializeData();

export const departments: Department[] = [
  {
    key: 'smart-creative',
    name: 'Smart Creative Skills',
    description: 'Digital design, content creation, and creative technologies',
    icon: 'Palette',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    key: 'smart-manufacturing',
    name: 'Smart Manufacturing',
    description: 'Industry 4.0, automation, and smart production systems',
    icon: 'Cog',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    key: 'smart-tourism',
    name: 'Smart Tourism',
    description: 'Digital tourism, sustainable practices, and experience design',
    icon: 'MapPin',
    color: 'bg-green-100 text-green-600'
  }
];

// Data access functions
export function getUsers(): User[] {
  return getStorageItem('users') || [];
}

export function getPrograms(): TrainingProgram[] {
  return getStorageItem('programs') || [];
}

export function getSessions(): Session[] {
  return getStorageItem('sessions') || [];
}

export function getAttendance(): Attendance[] {
  return getStorageItem('attendance') || [];
}

export function getAssignments(): Assignment[] {
  return getStorageItem('assignments') || [];
}

export function getAssignmentSubmissions(): AssignmentSubmission[] {
  return getStorageItem('assignmentSubmissions') || [];
}

export function getEnrollments(): Enrollment[] {
  return getStorageItem('enrollments') || [];
}

// Data mutation functions
export function addUser(user: User): void {
  const users = getUsers();
  setStorageItem('users', [...users, user]);
}

export function updateUser(id: string, updates: Partial<User>): void {
  const users = getUsers();
  const updatedUsers = users.map(user => 
    user.id === id ? { ...user, ...updates } : user
  );
  setStorageItem('users', updatedUsers);
}

export function deleteUser(id: string): void {
  const users = getUsers();
  const filteredUsers = users.filter(user => user.id !== id);
  setStorageItem('users', filteredUsers);
}

export function addProgram(program: TrainingProgram): void {
  const programs = getPrograms();
  setStorageItem('programs', [...programs, program]);
}

export function updateProgram(id: string, updates: Partial<TrainingProgram>): void {
  const programs = getPrograms();
  const updatedPrograms = programs.map(program => 
    program.id === id ? { ...program, ...updates } : program
  );
  setStorageItem('programs', updatedPrograms);
}

export function deleteProgram(id: string): void {
  const programs = getPrograms();
  const filteredPrograms = programs.filter(program => program.id !== id);
  setStorageItem('programs', filteredPrograms);
}

export function addSession(session: Session): void {
  const sessions = getSessions();
  setStorageItem('sessions', [...sessions, session]);
}

export function updateSession(id: string, updates: Partial<Session>): void {
  const sessions = getSessions();
  const updatedSessions = sessions.map(session => 
    session.id === id ? { ...session, ...updates } : session
  );
  setStorageItem('sessions', updatedSessions);
}

export function deleteSession(id: string): void {
  const sessions = getSessions();
  const filteredSessions = sessions.filter(session => session.id !== id);
  setStorageItem('sessions', filteredSessions);
}

export function addAttendance(attendance: Attendance): void {
  const attendanceList = getAttendance();
  setStorageItem('attendance', [...attendanceList, attendance]);
}

export function updateAttendance(id: string, updates: Partial<Attendance>): void {
  const attendanceList = getAttendance();
  const updatedAttendance = attendanceList.map(record => 
    record.id === id ? { ...record, ...updates } : record
  );
  setStorageItem('attendance', updatedAttendance);
}

export function addAssignment(assignment: Assignment): void {
  const assignments = getAssignments();
  setStorageItem('assignments', [...assignments, assignment]);
}

export function updateAssignment(id: string, updates: Partial<Assignment>): void {
  const assignments = getAssignments();
  const updatedAssignments = assignments.map(assignment => 
    assignment.id === id ? { ...assignment, ...updates } : assignment
  );
  setStorageItem('assignments', updatedAssignments);
}

export function deleteAssignment(id: string): void {
  const assignments = getAssignments();
  const filteredAssignments = assignments.filter(assignment => assignment.id !== id);
  setStorageItem('assignments', filteredAssignments);
}

export function addAssignmentSubmission(submission: AssignmentSubmission): void {
  const submissions = getAssignmentSubmissions();
  setStorageItem('assignmentSubmissions', [...submissions, submission]);
}

export function updateAssignmentSubmission(id: string, updates: Partial<AssignmentSubmission>): void {
  const submissions = getAssignmentSubmissions();
  const updatedSubmissions = submissions.map(submission => 
    submission.id === id ? { ...submission, ...updates } : submission
  );
  setStorageItem('assignmentSubmissions', updatedSubmissions);
}

export function addEnrollment(enrollment: Enrollment): void {
  const enrollments = getEnrollments();
  setStorageItem('enrollments', [...enrollments, enrollment]);
}

export function updateEnrollment(id: string, updates: Partial<Enrollment>): void {
  const enrollments = getEnrollments();
  const updatedEnrollments = enrollments.map(enrollment => 
    enrollment.id === id ? { ...enrollment, ...updates } : enrollment
  );
  setStorageItem('enrollments', updatedEnrollments);
}