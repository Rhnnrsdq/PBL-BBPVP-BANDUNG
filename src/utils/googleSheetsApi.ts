// Google Sheets API integration
const GOOGLE_SHEETS_API_URL = "https://script.google.com/macros/s/AKfycbx_jYcPeua9Gf7oo5qRgo1iFFxSfAv_6x2ld-21WFLksbMVhWKyHGZirp9bskHQPU4Oow/exec";

export interface GoogleSheetsResponse {
  success: boolean;
  data: any[];
  error?: string;
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

// Fetch data from Google Sheets
export async function fetchGoogleSheetsData(): Promise<GoogleSheetsResponse> {
  try {
    const response = await fetch(GOOGLE_SHEETS_API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Google Sheets data:', data);
    
    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
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
    const response = await fetch(GOOGLE_SHEETS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'saveUser',
        data: userData
      })
    });

    const result = await response.json();
    return result.success || false;
  } catch (error) {
    console.error('Error saving user registration:', error);
    return false;
  }
}

// Save attendance record to Google Sheets
export async function saveAttendanceRecord(attendance: AttendanceRecord): Promise<boolean> {
  try {
    const response = await fetch(GOOGLE_SHEETS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'saveAttendance',
        data: attendance
      })
    });

    const result = await response.json();
    return result.success || false;
  } catch (error) {
    console.error('Error saving attendance:', error);
    return false;
  }
}

// Save assignment submission to Google Sheets
export async function saveAssignmentSubmission(submission: AssignmentSubmission): Promise<boolean> {
  try {
    const response = await fetch(GOOGLE_SHEETS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'saveAssignment',
        data: submission
      })
    });

    const result = await response.json();
    return result.success || false;
  } catch (error) {
    console.error('Error saving assignment submission:', error);
    return false;
  }
}

// Export participants list for a session
export async function exportParticipantsList(sessionId: string): Promise<Blob | null> {
  try {
    const response = await fetch(`${GOOGLE_SHEETS_API_URL}?action=exportParticipants&sessionId=${sessionId}`);
    
    if (!response.ok) {
      throw new Error('Failed to export participants list');
    }
    
    return await response.blob();
  } catch (error) {
    console.error('Error exporting participants list:', error);
    return null;
  }
}

export async function syncWithGoogleSheets(): Promise<void> {
  const result = await fetchGoogleSheetsData();
  
  if (result.success) {
    console.log('Successfully synced with Google Sheets:', result.data);
  } else {
    console.error('Failed to sync with Google Sheets:', result.error);
  }
}