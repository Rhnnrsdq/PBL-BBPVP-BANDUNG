import { useState, useEffect } from 'react';
import { fetchGoogleSheetsData, GoogleSheetsResponse } from '../utils/googleSheetsApi';

export function useGoogleSheets() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchGoogleSheetsData();
      
      if (result.success) {
        setData(result.data);
      } else {
        const errorMsg = result.error || 'Failed to fetch data from Google Sheets';
        setError(errorMsg);
        console.warn('[GOOGLE_SHEETS_HOOK] Failed to fetch data:', errorMsg);
        // Don't throw error, just set error state
      }
    } catch (err) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('[GOOGLE_SHEETS_HOOK] Error fetching data:', errorMsg);
      setError(errorMsg);
      // Don't re-throw the error to prevent app crashes
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