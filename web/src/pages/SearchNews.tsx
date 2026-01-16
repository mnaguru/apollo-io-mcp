import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

export default function SearchNews() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);

  const searchMutation = useMutation({
    mutationFn: (params: any) => api.searchNews(params),
    onSuccess: (data) => {
      setResult(data);
      toast.success(`Found ${data.pagination?.total_entries || 0} articles`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Search failed');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchMutation.mutate({ q: query, per_page: 25 });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Search News Articles</h1>
        <p className="text-gray-600 mt-2">Search for news articles related to companies</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-1">
            Search Query
          </label>
          <input
            id="query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input-field"
            placeholder="e.g., AI funding, tech acquisitions"
            required
          />
        </div>

        <button
          type="submit"
          disabled={searchMutation.isPending}
          className="btn-primary"
        >
          {searchMutation.isPending ? 'Searching...' : 'Search News'}
        </button>
      </form>

      {result && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            News Articles ({result.pagination?.total_entries || 0})
          </h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
