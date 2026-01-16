import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

export default function BulkEnrichOrganizations() {
  const [orgsData, setOrgsData] = useState('');
  const [result, setResult] = useState<any>(null);

  const enrichMutation = useMutation({
    mutationFn: (params: any) => api.bulkEnrichOrganizations(params),
    onSuccess: (data) => {
      setResult(data);
      toast.success(`Enriched ${data.matches?.length || 0} organizations`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Bulk enrichment failed');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const organizations = JSON.parse(orgsData);
      enrichMutation.mutate({ organizations });
    } catch (error) {
      toast.error('Invalid JSON format');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bulk Enrich Organizations</h1>
        <p className="text-gray-600 mt-2">Enrich multiple organizations at once</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label htmlFor="orgsData" className="block text-sm font-medium text-gray-700 mb-1">
            Organizations Data (JSON Array)
          </label>
          <textarea
            id="orgsData"
            value={orgsData}
            onChange={(e) => setOrgsData(e.target.value)}
            className="input-field font-mono text-sm"
            rows={10}
            placeholder='[{"domain": "example.com"}, {"name": "Acme Inc"}]'
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter an array of objects with domain or name fields
          </p>
        </div>

        <button
          type="submit"
          disabled={enrichMutation.isPending}
          className="btn-primary"
        >
          {enrichMutation.isPending ? 'Enriching...' : 'Bulk Enrich'}
        </button>
      </form>

      {result && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Results</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
