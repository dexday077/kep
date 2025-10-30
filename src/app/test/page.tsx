'use client';

import { useEffect, useState } from 'react';
import { supabase, isSupabaseEnabled } from '@/lib/supabase';

export default function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [error, setError] = useState<string>('');
  const [tables, setTables] = useState<string[]>([]);

  useEffect(() => {
    const testConnection = async () => {
      if (!isSupabaseEnabled || !supabase) {
        setConnectionStatus('error');
        setError('Supabase is not enabled or not configured');
        return;
      }

      try {
        // Test basic connection
        const { data, error } = await supabase.from('profiles').select('count').limit(1);

        if (error) {
          setConnectionStatus('error');
          setError(error.message);
          return;
        }

        setConnectionStatus('connected');

        // Test available tables
        const tableTests = [
          { name: 'profiles', query: () => supabase.from('profiles').select('count').limit(1) },
          { name: 'products', query: () => supabase.from('products').select('count').limit(1) },
          { name: 'categories', query: () => supabase.from('categories').select('count').limit(1) },
          { name: 'orders', query: () => supabase.from('orders').select('count').limit(1) },
          { name: 'tenants', query: () => supabase.from('tenants').select('count').limit(1) },
        ];

        const availableTables: string[] = [];

        for (const table of tableTests) {
          try {
            const { error } = await table.query();
            if (!error) {
              availableTables.push(table.name);
            }
          } catch (e) {
            // Table doesn't exist or other error
          }
        }

        setTables(availableTables);
      } catch (err: any) {
        setConnectionStatus('error');
        setError(err.message || 'Unknown error');
      }
    };

    testConnection();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">🔧 Supabase Bağlantı Testi</h1>

      <div className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${connectionStatus === 'checking' ? 'bg-yellow-500 animate-pulse' : connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="font-medium">
            {connectionStatus === 'checking' && 'Bağlantı kontrol ediliyor...'}
            {connectionStatus === 'connected' && '✅ Supabase bağlantısı başarılı!'}
            {connectionStatus === 'error' && '❌ Bağlantı hatası'}
          </span>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-medium text-red-800 mb-2">Hata Detayı:</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Available Tables */}
        {connectionStatus === 'connected' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-800 mb-2">✅ Mevcut Tablolar:</h3>
            <div className="flex flex-wrap gap-2">
              {tables.map((table) => (
                <span key={table} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                  {table}
                </span>
              ))}
            </div>
            {tables.length === 0 && <p className="text-green-700 text-sm">Henüz hiç tablo oluşturulmamış.</p>}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 mb-2">📋 Sonraki Adımlar:</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>1. Supabase Dashboard → SQL Editor</li>
            <li>
              2. <code className="bg-blue-100 px-1 rounded">supabase-schema.sql</code> dosyasını çalıştır
            </li>
            <li>
              3. <code className="bg-blue-100 px-1 rounded">complete-database-setup.sql</code> dosyasını çalıştır
            </li>
            <li>4. Storage buckets oluştur</li>
            <li>5. Sayfayı yenile</li>
          </ul>
        </div>

        {/* Environment Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-800 mb-2">🔧 Konfigürasyon:</h3>
          <div className="text-gray-700 text-sm space-y-1">
            <p>
              <strong>Supabase Enabled:</strong> {isSupabaseEnabled ? '✅ Yes' : '❌ No'}
            </p>
            <p>
              <strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
            </p>
            <p>
              <strong>Supabase Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
