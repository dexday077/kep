'use client';

import { useState, useEffect } from 'react';
import { supabase, isSupabaseEnabled } from '@/lib/supabase';
import { ApiService } from '@/lib/api';

export default function TestSupabasePage() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...');
  const [testResults, setTestResults] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const testSupabaseConnection = async () => {
      const results: any = {};

      try {
        // 1. Environment Variables Test
        results.environment = {
          USE_SUPABASE: process.env.NEXT_PUBLIC_USE_SUPABASE,
          SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not Set',
          SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not Set',
          NODE_ENV: process.env.NODE_ENV,
        };

        // 2. Supabase Client Test
        if (!isSupabaseEnabled) {
          results.client = { status: 'Disabled', message: 'USE_SUPABASE is not true' };
        } else if (!supabase) {
          results.client = { status: 'Error', message: 'Supabase client is null' };
        } else {
          results.client = { status: 'Created', message: 'Supabase client created successfully' };
        }

        // 3. Basic Connection Test
        if (supabase) {
          try {
            const { data, error } = await supabase.from('categories').select('count').limit(1);
            if (error) {
              results.connection = { 
                status: 'Error', 
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
              };
            } else {
              results.connection = { 
                status: 'Success', 
                message: 'Successfully connected to Supabase',
                data: data
              };
            }
          } catch (err: any) {
            results.connection = { 
              status: 'Error', 
              message: err.message,
              type: 'Network or Auth Error'
            };
          }
        } else {
          results.connection = { status: 'Skipped', message: 'Supabase client not available' };
        }

        // 4. API Service Test
        try {
          const categories = await ApiService.getCategories();
          results.apiService = {
            status: 'Success',
            message: `getCategories returned ${categories.length} items`,
            data: categories
          };
        } catch (err: any) {
          results.apiService = {
            status: 'Error',
            message: err.message,
            type: 'API Service Error'
          };
        }

        // 5. Products Test
        try {
          const products = await ApiService.getProducts();
          results.products = {
            status: 'Success',
            message: `getProducts returned ${products.data.length} items`,
            count: products.count
          };
        } catch (err: any) {
          results.products = {
            status: 'Error',
            message: err.message,
            type: 'Products API Error'
          };
        }

        setTestResults(results);
        setConnectionStatus('Test completed');
      } catch (error: any) {
        setConnectionStatus('Test failed');
        setTestResults({ error: error.message });
      } finally {
        setIsLoading(false);
      }
    };

    testSupabaseConnection();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Supabase Connection Test</h1>
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Testing connection...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Supabase Connection Test</h1>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Connection Status</h2>
            <div className={`px-4 py-2 rounded-lg ${
              connectionStatus === 'Test completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {connectionStatus}
            </div>
          </div>

          <div className="space-y-6">
            {Object.entries(testResults).map(([key, value]: [string, any]) => (
              <div key={key} className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                
                {typeof value === 'object' && value !== null ? (
                  <div className="space-y-2">
                    {Object.entries(value).map(([subKey, subValue]: [string, any]) => (
                      <div key={subKey} className="flex justify-between">
                        <span className="font-medium text-gray-600">{subKey}:</span>
                        <span className={`px-2 py-1 rounded text-sm ${
                          subKey === 'status' 
                            ? (subValue === 'Success' || subValue === 'Created' 
                                ? 'bg-green-100 text-green-800' 
                                : subValue === 'Error' 
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800')
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {typeof subValue === 'object' ? JSON.stringify(subValue) : String(subValue)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-600">{String(value)}</div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Test Instructions</h3>
            <ul className="text-blue-700 space-y-1">
              <li>• Check if all status indicators are green</li>
              <li>• If you see errors, check your environment variables</li>
              <li>• Make sure your Supabase project is active</li>
              <li>• Verify that the required tables exist in your database</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}



