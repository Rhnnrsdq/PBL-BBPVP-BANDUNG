// Google Sheets API integration with full CRUD operations
const GOOGLE_SHEETS_API_URL = import.meta.env.VITE_GOOGLE_SHEETS_API_URL || "https://script.google.com/macros/s/AKfycbzM9vH7mCSzpG-I7KQfWEXcGib1AB7dL1vwy-Ajl5pQ--_lT0AmFpjKEZOu1U3zsde7SA/exec";

export interface GoogleSheetsResponse {
  success: boolean;
  data: any[];
  error?: string;
  message?: string;
}

export interface ApiRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  action: string;
  data?: any;
  id?: string;
}

// Generic API request function
export async function makeApiRequest(options: ApiRequestOptions): Promise<GoogleSheetsResponse> {
  try {
    console.log(`[GOOGLE_SHEETS_API] ${options.method} ${options.action}:`, options.data || options.id || 'no data');
    
    const requestConfig: RequestInit = {
      method: options.method,
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(15000) // 15 second timeout
    };

    let url = GOOGLE_SHEETS_API_URL;
    
    if (options.method === 'GET') {
      const params = new URLSearchParams({
        action: options.action,
        ...(options.id && { id: options.id })
      });
      url += `?${params.toString()}`;
    } else {
      requestConfig.body = JSON.stringify({
        action: options.action,
        data: options.data,
        ...(options.id && { id: options.id })
      });
    }

    const response = await fetch(url, requestConfig);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    let result;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    } else {
      const text = await response.text();
      try {
        result = JSON.parse(text);
      } catch {
        result = { success: true, data: [], message: text };
      }
    }
    
    console.log(`[GOOGLE_SHEETS_API] ${options.method} ${options.action} result:`, result);
    return result;
  } catch (error) {
    console.error(`[GOOGLE_SHEETS_API] ${options.method} ${options.action} error:`, error);
    
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = 'Request timeout - Google Sheets API is not responding';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error - Please check your internet connection';
      } else if (error.message.includes('CORS')) {
        errorMessage = 'CORS error - Please check Google Apps Script deployment settings';
      } else {
        errorMessage = error.message;
      }
    }
    
    return {
      success: false,
      data: [],
      error: errorMessage
    };
  }
}

// Test connection to Google Sheets API
export async function testGoogleSheetsConnection(): Promise<GoogleSheetsResponse> {
  return makeApiRequest({
    method: 'GET',
    action: 'test'
  });
}

// Users CRUD operations
export async function getUsers(): Promise<GoogleSheetsResponse> {
  return makeApiRequest({
    method: 'GET',
    action: 'getUsers'
  });
}

export async function createUser(userData: any): Promise<GoogleSheetsResponse> {
  return makeApiRequest({
    method: 'POST',
    action: 'createUser',
    data: userData
  });
}

export async function updateUser(id: string, userData: any): Promise<GoogleSheetsResponse> {
  return makeApiRequest({
    method: 'PUT',
    action: 'updateUser',
    id,
    data: userData
  });
}

export async function deleteUser(id: string): Promise<GoogleSheetsResponse> {
  return makeApiRequest({
    method: 'DELETE',
    action: 'deleteUser',
    id
  });
}

// Programs CRUD operations
export async function getPrograms(): Promise<GoogleSheetsResponse> {
  return makeApiRequest({
    method: 'GET',
    action: 'getPrograms'
  });
}

export async function createProgram(programData: any): Promise<GoogleSheetsResponse> {
  return makeApiRequest({
    method: 'POST',
    action: 'createProgram',
    data: programData
  });
}

export async function updateProgram(id: string, programData: any): Promise<GoogleSheetsResponse> {
  return makeApiRequest({
    method: 'PUT',
    action: 'updateProgram',
    id,
    data: programData
  });
}

export async function deleteProgram(id: string): Promise<GoogleSheetsResponse> {
  return makeApiRequest({
    method: 'DELETE',
    action: 'deleteProgram',
    id
  });
}

// Sessions CRUD operations
export async function getSessions(): Promise<GoogleSheetsResponse> {
  return makeApiRequest({
    method: 'GET',
    action: 'getSessions'
  });
}

export async function createSession(sessionData: any): Promise<GoogleSheetsResponse> {
  return makeApiRequest({
    method: 'POST',
    action: 'createSession',
    data: sessionData
  });
}

export async function updateSession(id: string, sessionData: any): Promise<GoogleSheetsResponse> {
  return makeApiRequest({
    method: 'PUT',
    action: 'updateSession',
    id,
    data: sessionData
  });
}

export async function deleteSession(id: string): Promise<GoogleSheetsResponse> {
  return makeApiRequest({
    method: 'DELETE',
    action: 'deleteSession',
    id
  });
}

// Assignments CRUD operations
export async function getAssignments(): Promise<GoogleSheetsResponse> {
  return makeApiRequest({
    method: 'GET',
    action: 'getAssignments'
  });
}

export async function createAssignment(assignmentData: any): Promise<GoogleSheetsResponse> {
  return makeApiRequest({
    method: 'POST',
    action: 'createAssignment',
    data: assignmentData
  });
}

export async function updateAssignment(id: string, assignmentData: any): Promise<GoogleSheetsResponse> {
  return makeApiRequest({
    method: 'PUT',
    action: 'updateAssignment',
    id,
    data: assignmentData
  });
}

export async function deleteAssignment(id: string): Promise<GoogleSheetsResponse> {
  return makeApiRequest({
    method: 'DELETE',
    action: 'deleteAssignment',
    id
  });
}

// Attendance CRUD operations
export async function getAttendance(): Promise<GoogleSheetsResponse> {
  return makeApiRequest({
    method: 'GET',
    action: 'getAttendance'
  });
}

export async function createAttendance(attendanceData: any): Promise<GoogleSheetsResponse> {
  return makeApiRequest({
    method: 'POST',
    action: 'createAttendance',
    data: attendanceData
  });
}

export async function updateAttendance(id: string, attendanceData: any): Promise<GoogleSheetsResponse> {
  return makeApiRequest({
    method: 'PUT',
    action: 'updateAttendance',
    id,
    data: attendanceData
  });
}

// Assignment Submissions CRUD operations
export async function getAssignmentSubmissions(): Promise<GoogleSheetsResponse> {
  return makeApiRequest({
    method: 'GET',
    action: 'getAssignmentSubmissions'
  });
}

export async function createAssignmentSubmission(submissionData: any): Promise<GoogleSheetsResponse> {
  return makeApiRequest({
    method: 'POST',
    action: 'createAssignmentSubmission',
    data: submissionData
  });
}

// Enrollments CRUD operations
export async function getEnrollments(): Promise<GoogleSheetsResponse> {
  return makeApiRequest({
    method: 'GET',
    action: 'getEnrollments'
  });
}

export async function createEnrollment(enrollmentData: any): Promise<GoogleSheetsResponse> {
  return makeApiRequest({
    method: 'POST',
    action: 'createEnrollment',
    data: enrollmentData
  });
}

// Export functions
export async function exportUsersReport(): Promise<GoogleSheetsResponse> {
  return makeApiRequest({
    method: 'GET',
    action: 'exportUsers'
  });
}

export async function exportProgramsReport(): Promise<GoogleSheetsResponse> {
  return makeApiRequest({
    method: 'GET',
    action: 'exportPrograms'
  });
}

export async function exportAttendanceReport(): Promise<GoogleSheetsResponse> {
  return makeApiRequest({
    method: 'GET',
    action: 'exportAttendance'
  });
}

// Legacy compatibility functions (deprecated - use direct API calls)
export async function fetchGoogleSheetsData(): Promise<GoogleSheetsResponse> {
  return testGoogleSheetsConnection();
}

export async function saveUserRegistration(userData: any): Promise<boolean> {
  const result = await createUser(userData);
  return result.success;
}

export async function saveAttendanceRecord(attendanceData: any): Promise<boolean> {
  const result = await createAttendance(attendanceData);
  return result.success;
}

export async function saveAssignmentSubmission(submissionData: any): Promise<boolean> {
  const result = await createAssignmentSubmission(submissionData);
  return result.success;
}