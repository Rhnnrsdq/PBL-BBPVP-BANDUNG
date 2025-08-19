import { useState, useEffect } from 'react';
import { testGoogleSheetsConnection, GoogleSheetsResponse } from '../utils/googleSheetsApi';

export function useGoogleSheets() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('[GOOGLE_SHEETS_HOOK] Testing connection...');
      const result = await testGoogleSheetsConnection();
      
      if (result.success) {
        setData(result.data);
        console.log('[GOOGLE_SHEETS_HOOK] Connection successful:', result.data);
      } else {
        const errorMsg = result.error || 'Failed to connect to Google Sheets';
        setError(errorMsg);
        console.warn('[GOOGLE_SHEETS_HOOK] Connection failed:', errorMsg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('[GOOGLE_SHEETS_HOOK] Error:', errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}