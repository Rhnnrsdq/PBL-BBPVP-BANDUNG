// Google Sheets API integration with Apps Script endpoint
const API_URL = import.meta.env.VITE_GOOGLE_SHEETS_API_URL;

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Generic API request function
async function makeApiRequest<T = any>(action: string, data?: any, id?: string): Promise<ApiResponse<T>> {
  try {
    const requestBody = {
      action,
      ...(id && { id }),
      ...(data && { data })
    };

    console.log(`[GOOGLE_SHEETS_API] ${action} request:`, requestBody);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(`[GOOGLE_SHEETS_API] ${action} response:`, result);

    return result;
  } catch (error) {
    console.error(`[GOOGLE_SHEETS_API] ${action} error:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Test connection
export async function testConnection(): Promise<ApiResponse> {
  return makeApiRequest('test');
}

// Users API
export async function fetchUsers(): Promise<ApiResponse> {
  return makeApiRequest('getUsers');
}

export async function createUser(userData: any): Promise<ApiResponse> {
  return makeApiRequest('createUser', userData);
}

export async function updateUser(id: string, userData: any): Promise<ApiResponse> {
  return makeApiRequest('updateUser', userData, id);
}

export async function deleteUser(id: string): Promise<ApiResponse> {
  return makeApiRequest('deleteUser', null, id);
}

// Programs API
export async function fetchPrograms(): Promise<ApiResponse> {
  return makeApiRequest('getPrograms');
}

export async function createProgram(programData: any): Promise<ApiResponse> {
  return makeApiRequest('createProgram', programData);
}

export async function updateProgram(id: string, programData: any): Promise<ApiResponse> {
  return makeApiRequest('updateProgram', programData, id);
}

export async function deleteProgram(id: string): Promise<ApiResponse> {
  return makeApiRequest('deleteProgram', null, id);
}

// Sessions API
export async function fetchSessions(): Promise<ApiResponse> {
  return makeApiRequest('getSessions');
}

export async function createSession(sessionData: any): Promise<ApiResponse> {
  return makeApiRequest('createSession', sessionData);
}

export async function updateSession(id: string, sessionData: any): Promise<ApiResponse> {
  return makeApiRequest('updateSession', sessionData, id);
}

export async function deleteSession(id: string): Promise<ApiResponse> {
  return makeApiRequest('deleteSession', null, id);
}

// Assignments API
export async function fetchAssignments(): Promise<ApiResponse> {
  return makeApiRequest('getAssignments');
}

export async function createAssignment(assignmentData: any): Promise<ApiResponse> {
  return makeApiRequest('createAssignment', assignmentData);
}

export async function updateAssignment(id: string, assignmentData: any): Promise<ApiResponse> {
  return makeApiRequest('updateAssignment', assignmentData, id);
}

export async function deleteAssignment(id: string): Promise<ApiResponse> {
  return makeApiRequest('deleteAssignment', null, id);
}

// Attendance API
export async function fetchAttendance(): Promise<ApiResponse> {
  return makeApiRequest('getAttendance');
}

export async function createAttendance(attendanceData: any): Promise<ApiResponse> {
  return makeApiRequest('createAttendance', attendanceData);
}

export async function updateAttendance(id: string, attendanceData: any): Promise<ApiResponse> {
  return makeApiRequest('updateAttendance', attendanceData, id);
}

// Enrollments API
export async function fetchEnrollments(): Promise<ApiResponse> {
  return makeApiRequest('getEnrollments');
}

export async function createEnrollment(enrollmentData: any): Promise<ApiResponse> {
  return makeApiRequest('createEnrollment', enrollmentData);
}

// Assignment Submissions API
export async function fetchAssignmentSubmissions(): Promise<ApiResponse> {
  return makeApiRequest('getAssignmentSubmissions');
}

export async function createAssignmentSubmission(submissionData: any): Promise<ApiResponse> {
  return makeApiRequest('createAssignmentSubmission', submissionData);
}

// Export functions
export async function exportUsers(): Promise<ApiResponse> {
  return makeApiRequest('exportUsers');
}

export async function exportPrograms(): Promise<ApiResponse> {
  return makeApiRequest('exportPrograms');
}

export async function exportAttendance(): Promise<ApiResponse> {
  return makeApiRequest('exportAttendance');
}

export async function exportParticipants(sessionId: string): Promise<ApiResponse> {
  return makeApiRequest('exportParticipants', null, sessionId);
}