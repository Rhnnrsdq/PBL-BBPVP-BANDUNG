// Google Sheets API integration with CORS and error handling
const GOOGLE_SHEETS_API_URL = "https://script.google.com/macros/s/AKfycbx_jYcPeua9Gf7oo5qRgo1iFFxSfAv_6x2ld-21WFLksbMVhWKyHGZirp9bskHQPU4Oow/exec";

export interface GoogleSheetsResponse {
  success: boolean;
  data: any[];
  error?: string;
  message?: string;
}

export interface UserRegistration {
  name: string;
  email: string;
  role: string;
  password: string;
  timestamp: string;
}

export interface AttendanceRecord {
  sessionId: string;
  participantId: string;
  participantName: string;
  status: 'present' | 'absent';
  timestamp: string;
  sessionTitle: string;
}

export interface AssignmentSubmission {
  assignmentId: string;
  participantId: string;
  participantName: string;
  content: string;
  fileUrl?: string;
  submittedAt: string;
}

// Test Google Sheets connection with proper CORS handling
export async function testGoogleSheetsConnection(apiEndpoint?: string): Promise<GoogleSheetsResponse> {
  const endpoint = apiEndpoint || GOOGLE_SHEETS_API_URL;
  
  try {
    console.log('[GOOGLE_SHEETS_TEST] Testing connection to:', endpoint);
    
    // Use fetch with proper CORS headers
    const response = await fetch(endpoint, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // Add timeout
      signal: AbortSignal.timeout(10000)
    });

    console.log('[GOOGLE_SHEETS_TEST] Response status:', response.status);
    console.log('[GOOGLE_SHEETS_TEST] Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    // Try to parse as JSON
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.log('[GOOGLE_SHEETS_TEST] Non-JSON response:', text);
      // Try to parse as JSON anyway
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }
    
    console.log('[GOOGLE_SHEETS_TEST] Response data:', data);
    
    return {
      success: true,
      data: Array.isArray(data) ? data : [data],
      message: data.message || 'Connection successful'
    };
  } catch (error) {
    console.error('[GOOGLE_SHEETS_TEST] Connection failed:', error);
    
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = 'Request timeout - please check your internet connection';
      } else if (error.message.includes('CORS')) {
        errorMessage = 'CORS error - please check Google Apps Script deployment settings';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error - please check your internet connection and API endpoint';
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

// Fetch data from Google Sheets
export async function fetchGoogleSheetsData(): Promise<GoogleSheetsResponse> {
  try {
    console.log('[GOOGLE_SHEETS] Fetching data from:', GOOGLE_SHEETS_API_URL);
    const response = await fetch(GOOGLE_SHEETS_API_URL, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('[GOOGLE_SHEETS] Data fetched successfully:', data);
    
    return {
      success: true,
      data: Array.isArray(data) ? data : [data]
    };
  } catch (error) {
    console.error('[GOOGLE_SHEETS] Error fetching data:', error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Save user registration to Google Sheets
export async function saveUserRegistration(userData: UserRegistration): Promise<boolean> {
  try {
    console.log('[GOOGLE_SHEETS] Saving user registration:', userData.email);
    const response = await fetch(GOOGLE_SHEETS_API_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        action: 'saveUser',
        data: userData
      })
    });

    const result = await response.json();
    console.log('[GOOGLE_SHEETS] User registration result:', result);
    return result.success || false;
  } catch (error) {
    console.error('[GOOGLE_SHEETS] Error saving user registration:', error);
    return false;
  }
}

// Save attendance record to Google Sheets
export async function saveAttendanceRecord(attendance: AttendanceRecord): Promise<boolean> {
  try {
    console.log('[GOOGLE_SHEETS] Saving attendance record:', attendance);
    const response = await fetch(GOOGLE_SHEETS_API_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        action: 'saveAttendance',
        data: attendance
      })
    });

    const result = await response.json();
    console.log('[GOOGLE_SHEETS] Attendance save result:', result);
    return result.success || false;
  } catch (error) {
    console.error('[GOOGLE_SHEETS] Error saving attendance:', error);
    return false;
  }
}

// Save assignment submission to Google Sheets
export async function saveAssignmentSubmission(submission: AssignmentSubmission): Promise<boolean> {
  try {
    console.log('[GOOGLE_SHEETS] Saving assignment submission:', submission);
    const response = await fetch(GOOGLE_SHEETS_API_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        action: 'saveAssignment',
        data: submission
      })
    });

    const result = await response.json();
    console.log('[GOOGLE_SHEETS] Assignment submission result:', result);
    return result.success || false;
  } catch (error) {
    console.error('[GOOGLE_SHEETS] Error saving assignment submission:', error);
    return false;
  }
}

// Export participants list for a session
export async function exportParticipantsList(sessionId: string): Promise<Blob | null> {
  try {
    console.log('[GOOGLE_SHEETS] Exporting participants list for session:', sessionId);
    const response = await fetch(`${GOOGLE_SHEETS_API_URL}?action=exportParticipants&sessionId=${sessionId}`, {
      method: 'GET',
      mode: 'cors',
    });
    
    if (!response.ok) {
      throw new Error('Failed to export participants list');
    }
    
    return await response.blob();
  } catch (error) {
    console.error('[GOOGLE_SHEETS] Error exporting participants list:', error);
    return null;
  }
}

export async function syncWithGoogleSheets(): Promise<void> {
  console.log('[GOOGLE_SHEETS] Starting sync with Google Sheets');
  const result = await fetchGoogleSheetsData();
  
  if (result.success) {
    console.log('[GOOGLE_SHEETS] Successfully synced with Google Sheets:', result.data);
  } else {
    console.error('[GOOGLE_SHEETS] Failed to sync with Google Sheets:', result.error);
  }
}