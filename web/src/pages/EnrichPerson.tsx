import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

export default function EnrichPerson() {
  const [email, setEmail] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [result, setResult] = useState<any>(null);

  const enrichMutation = useMutation({
    mutationFn: (params: any) => api.enrichPerson(params),
    onSuccess: (data) => {
      setResult(data);
      toast.success('Person enriched successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Enrichment failed');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params: any = {};
    if (email) params.email = email;
    if (linkedinUrl) params.linkedin_url = linkedinUrl;
    if (name) params.name = name;
    if (company) params.company = company;

    enrichMutation.mutate(params);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Enrich Person</h1>
        <p className="text-gray-600 mt-2">Enrich a person by email, LinkedIn URL, or name+company</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-1">
            LinkedIn URL
          </label>
          <input
            id="linkedinUrl"
            type="url"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            className="input-field"
            placeholder="https://linkedin.com/in/..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              id="company"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="input-field"
              placeholder="Acme Inc"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={enrichMutation.isPending}
          className="btn-primary"
        >
          {enrichMutation.isPending ? 'Enriching...' : 'Enrich Person'}
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
