import React from 'react';
import { RefreshCw, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { useGoogleSheets } from '../hooks/useGoogleSheets';

export default function GoogleSheetsSync() {
  const { data, loading, error, refetch } = useGoogleSheets();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Database className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text">Google Sheets Sync</h3>
            <p className="text-text/60 text-sm">Real-time data synchronization</p>
          </div>
        </div>
        
        <button
          onClick={refetch}
          disabled={loading}
          className="flex items-center space-x-2 bg-secondary hover:bg-secondary/90 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-all"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Syncing...' : 'Sync Now'}</span>
        </button>
      </div>

      {/* Status */}
      <div className="mb-4">
        {error ? (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">{error}</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm">
              Successfully synced {data.length} records
            </span>
          </div>
        )}
      </div>

      {/* Data Preview */}
      {data.length > 0 && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <h4 className="font-medium text-text">Data Preview</h4>
          </div>
          <div className="p-4 max-h-64 overflow-y-auto">
            <pre className="text-sm text-text/70 whitespace-pre-wrap">
              {JSON.stringify(data.slice(0, 3), null, 2)}
              {data.length > 3 && '\n... and more'}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}