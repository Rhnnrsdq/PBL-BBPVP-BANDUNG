export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'trainer' | 'participant';
  created_at: string;
}

export interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  department: 'smart-creative' | 'smart-manufacturing' | 'smart-tourism';
  start_date: string;
  end_date: string;
  trainer_id?: string;
  max_participants: number;
  current_participants: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface Session {
  id: string;
  training_id: string;
  date: string;
  time_slot: 'AM' | 'PM';
  trainer_id: string;
  title: string;
  description?: string;
  location?: string;
}

export interface Attendance {
  id: string;
  session_id: string;
  participant_id: string;
  status: 'present' | 'absent';
  timestamp: string;
}

export interface Assignment {
  id: string;
  training_id: string;
  title: string;
  description: string;
  due_date: string;
  created_by: string;
  created_at: string;
}

export interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  participant_id: string;
  content: string;
  file_url?: string;
  submitted_at: string;
  grade?: number;
  feedback?: string;
}

export interface Enrollment {
  id: string;
  participant_id: string;
  training_id: string;
  enrolled_at: string;
  status: 'active' | 'completed' | 'dropped';
}

export interface Department {
  key: 'smart-creative' | 'smart-manufacturing' | 'smart-tourism';
  name: string;
  description: string;
  icon: string;
  color: string;
}