'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

interface Tenant {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  created_at: string;
}

interface TestResult {
  test: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  data?: any;
}

export default function MultiTenantTest() {
  const { user, userRole } = useAuth();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const runTests = async () => {
    setIsLoading(true);
    const results: TestResult[] = [];

    try {
      // Test 1: Tenants tablosunu oku
      const { data: tenantsData, error: tenantsError } = await supabase.from('tenants').select('*').order('created_at');

      if (tenantsError) {
        results.push({
          test: 'Tenants Table Access',
          status: 'error',
          message: `Error accessing tenants table: ${tenantsError.message}`,
        });
      } else {
        results.push({
          test: 'Tenants Table Access',
          status: 'success',
          message: `Successfully accessed tenants table. Found ${tenantsData?.length || 0} tenants.`,
          data: tenantsData,
        });
        setTenants(tenantsData || []);
      }

      // Test 2: Profiles tablosunu tenant_id ile oku
      const { data: profilesData, error: profilesError } = await supabase.from('profiles').select('id, email, role, tenant_id').limit(5);

      if (profilesError) {
        results.push({
          test: 'Profiles with Tenant ID',
          status: 'error',
          message: `Error accessing profiles: ${profilesError.message}`,
        });
      } else {
        const profilesWithTenant = profilesData?.filter((p: { tenant_id?: string }) => p.tenant_id) || [];
        results.push({
          test: 'Profiles with Tenant ID',
          status: profilesWithTenant.length > 0 ? 'success' : 'warning',
          message: `Found ${profilesWithTenant.length} profiles with tenant_id`,
          data: profilesWithTenant,
        });
      }

      // Test 3: Products tablosunu tenant_id ile oku
      const { data: productsData, error: productsError } = await supabase.from('products').select('id, title, tenant_id').limit(5);

      if (productsError) {
        results.push({
          test: 'Products with Tenant ID',
          status: 'error',
          message: `Error accessing products: ${productsError.message}`,
        });
      } else {
        const productsWithTenant = productsData?.filter((p: { tenant_id?: string }) => p.tenant_id) || [];
        results.push({
          test: 'Products with Tenant ID',
          status: productsWithTenant.length > 0 ? 'success' : 'warning',
          message: `Found ${productsWithTenant.length} products with tenant_id`,
          data: productsWithTenant,
        });
      }

      // Test 4: Helper fonksiyonları test et (RPC)
      if (user) {
        try {
          const { data: tenantData, error: tenantError } = await supabase.rpc('auth_tenant');

          if (tenantError) {
            results.push({
              test: 'Auth Tenant Function',
              status: 'error',
              message: `Error calling auth_tenant(): ${tenantError.message}`,
            });
          } else {
            results.push({
              test: 'Auth Tenant Function',
              status: 'success',
              message: `Current user tenant: ${tenantData}`,
              data: tenantData,
            });
          }
        } catch (error) {
          results.push({
            test: 'Auth Tenant Function',
            status: 'error',
            message: `Exception calling auth_tenant(): ${error}`,
          });
        }

        try {
          const { data: roleData, error: roleError } = await supabase.rpc('auth_role');

          if (roleError) {
            results.push({
              test: 'Auth Role Function',
              status: 'error',
              message: `Error calling auth_role(): ${roleError.message}`,
            });
          } else {
            results.push({
              test: 'Auth Role Function',
              status: 'success',
              message: `Current user role: ${roleData}`,
              data: roleData,
            });
          }
        } catch (error) {
          results.push({
            test: 'Auth Role Function',
            status: 'error',
            message: `Exception calling auth_role(): ${error}`,
          });
        }
      } else {
        results.push({
          test: 'Auth Functions',
          status: 'warning',
          message: 'User not authenticated, skipping auth function tests',
        });
      }

      // Test 5: RLS Policy Test (Tenant Isolation)
      if (user && tenants.length > 0) {
        try {
          // Farklı tenant'a ait veri okuyabilir miyiz test et
          const { data: allProfiles, error: allProfilesError } = await supabase.from('profiles').select('id, email, tenant_id').limit(10);

          if (allProfilesError) {
            results.push({
              test: 'RLS Tenant Isolation',
              status: 'error',
              message: `Error testing RLS: ${allProfilesError.message}`,
            });
          } else {
            const userTenant = allProfiles?.find((p: { id: string; tenant_id?: string }) => p.id === user.id)?.tenant_id;
            const otherTenants = allProfiles?.filter((p: { tenant_id?: string }) => p.tenant_id !== userTenant) || [];

            results.push({
              test: 'RLS Tenant Isolation',
              status: otherTenants.length === 0 ? 'success' : 'warning',
              message: `RLS working: ${otherTenants.length === 0 ? 'No cross-tenant data visible' : 'Cross-tenant data visible (may be expected)'}`,
              data: { userTenant, otherTenants: otherTenants.length },
            });
          }
        } catch (error) {
          results.push({
            test: 'RLS Tenant Isolation',
            status: 'error',
            message: `Exception testing RLS: ${error}`,
          });
        }
      }
    } catch (error) {
      results.push({
        test: 'General Error',
        status: 'error',
        message: `Unexpected error: ${error}`,
      });
    }

    setTestResults(results);
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      runTests();
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">🧪 Multi-Tenant Support Test</h1>

        {/* User Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Current User Info</h2>
          {user ? (
            <div className="space-y-1">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>ID:</strong> {user.id}
              </p>
              <p>
                <strong>Role:</strong> {userRole || 'Unknown'}
              </p>
              <p>
                <strong>Authenticated:</strong> ✅ Yes
              </p>
            </div>
          ) : (
            <p className="text-gray-600">❌ Not authenticated</p>
          )}
        </div>

        {/* Tenants List */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Available Tenants</h2>
          {tenants.length > 0 ? (
            <div className="space-y-2">
              {tenants.map((tenant) => (
                <div key={tenant.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div>
                    <span className="font-medium">{tenant.name}</span>
                    <span className="text-gray-500 ml-2">({tenant.slug})</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${tenant.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{tenant.is_active ? 'Active' : 'Inactive'}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No tenants found</p>
          )}
        </div>

        {/* Test Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Test Results</h2>
            <button onClick={runTests} disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {isLoading ? 'Running Tests...' : 'Run Tests'}
            </button>
          </div>

          {testResults.length > 0 ? (
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{getStatusIcon(result.status)}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold">{result.test}</h3>
                      <p className="text-sm mt-1">{result.message}</p>
                      {result.data && (
                        <details className="mt-2">
                          <summary className="text-xs cursor-pointer">View Data</summary>
                          <pre className="text-xs mt-2 p-2 bg-white rounded border overflow-auto">{JSON.stringify(result.data, null, 2)}</pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No test results yet. Click "Run Tests" to start.</p>
          )}
        </div>

        {/* Instructions */}
        <div className="p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">Test Instructions</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Make sure you're logged in to see all test results</li>
            <li>• Check that tenants table is accessible</li>
            <li>• Verify that all tables have tenant_id columns</li>
            <li>• Test that RLS policies are working (tenant isolation)</li>
            <li>• Verify helper functions (auth_tenant, auth_role) work</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
