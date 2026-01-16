import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

export default function OrganizationInfo() {
  const [orgId, setOrgId] = useState('');
  const [result, setResult] = useState<any>(null);

  const infoMutation = useMutation({
    mutationFn: (id: string) => api.getOrganizationInfo(id),
    onSuccess: (data) => {
      setResult(data);
      toast.success('Organization info retrieved');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to fetch organization info');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    infoMutation.mutate(orgId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Complete Organization Info</h1>
        <p className="text-gray-600 mt-2">Get complete information for a specific organization</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label htmlFor="orgId" className="block text-sm font-medium text-gray-700 mb-1">
            Organization ID
          </label>
          <input
            id="orgId"
            type="text"
            value={orgId}
            onChange={(e) => setOrgId(e.target.value)}
            className="input-field"
            placeholder="Enter Apollo organization ID"
            required
          />
        </div>

        <button
          type="submit"
          disabled={infoMutation.isPending}
          className="btn-primary"
        >
          {infoMutation.isPending ? 'Fetching...' : 'Get Organization Info'}
        </button>
      </form>

      {result && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Organization Information</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
