import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

export default function EnrichCompany() {
  const [domain, setDomain] = useState('');
  const [name, setName] = useState('');
  const [result, setResult] = useState<any>(null);

  const enrichMutation = useMutation({
    mutationFn: (params: any) => api.enrichCompany(params),
    onSuccess: (data) => {
      setResult(data);
      toast.success('Company enriched successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Enrichment failed');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params: any = {};
    if (domain) params.domain = domain;
    if (name) params.name = name;

    enrichMutation.mutate(params);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Enrich Company</h1>
        <p className="text-gray-600 mt-2">Enrich a company by domain or name</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
            Domain
          </label>
          <input
            id="domain"
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="input-field"
            placeholder="example.com"
          />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            placeholder="Acme Inc"
          />
        </div>

        <button
          type="submit"
          disabled={enrichMutation.isPending}
          className="btn-primary"
        >
          {enrichMutation.isPending ? 'Enriching...' : 'Enrich Company'}
        </button>
      </form>

      {result && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Enriched Data</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
