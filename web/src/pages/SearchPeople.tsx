import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import toast from 'react-hot-toast';
import ResultsTable from '../components/ResultsTable';

export default function SearchPeople() {
  const [query, setQuery] = useState('');
  const [locations, setLocations] = useState('');
  const [seniority, setSeniority] = useState('');
  const [titles, setTitles] = useState('');
  const [industries, setIndustries] = useState('');
  const [results, setResults] = useState<any>(null);

  const searchMutation = useMutation({
    mutationFn: (params: any) => api.searchPeople(params),
    onSuccess: (data) => {
      setResults(data);
      toast.success(`Found ${data.pagination?.total_entries || 0} results`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Search failed');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const filters: any = {};
    if (locations) filters.locations = locations.split(',').map(s => s.trim());
    if (seniority) filters.seniority = seniority.split(',').map(s => s.trim());
    if (titles) filters.titles = titles.split(',').map(s => s.trim());
    if (industries) filters.industries = industries.split(',').map(s => s.trim());

    searchMutation.mutate({
      q: query,
      ...filters,
      per_page: 25,
    });
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'title', label: 'Title' },
    { key: 'company', label: 'Company' },
    { key: 'location', label: 'Location' },
    {
      key: 'email',
      label: 'Email',
      render: (email: string) => email ? (
        <a href={`mailto:${email}`} className="text-primary-600 hover:text-primary-700">
          {email}
        </a>
      ) : '-'
    },
  ];

  const simplifiedPeople = results?.people?.map((person: any) => ({
    name: person.name,
    title: person.title,
    company: person.organization?.name,
    location: person.formatted_address,
    email: person.email,
  })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Search People</h1>
        <p className="text-gray-600 mt-2">Find people in Apollo's database with advanced filtering</p>
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
            placeholder="e.g., CEO, Software Engineer"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="locations" className="block text-sm font-medium text-gray-700 mb-1">
              Locations (comma-separated)
            </label>
            <input
              id="locations"
              type="text"
              value={locations}
              onChange={(e) => setLocations(e.target.value)}
              className="input-field"
              placeholder="e.g., California, New York"
            />
          </div>

          <div>
            <label htmlFor="seniority" className="block text-sm font-medium text-gray-700 mb-1">
              Seniority (comma-separated)
            </label>
            <input
              id="seniority"
              type="text"
              value={seniority}
              onChange={(e) => setSeniority(e.target.value)}
              className="input-field"
              placeholder="e.g., C-Level, VP, Director"
            />
          </div>

          <div>
            <label htmlFor="titles" className="block text-sm font-medium text-gray-700 mb-1">
              Titles (comma-separated)
            </label>
            <input
              id="titles"
              type="text"
              value={titles}
              onChange={(e) => setTitles(e.target.value)}
              className="input-field"
              placeholder="e.g., CEO, CTO, Sales Manager"
            />
          </div>

          <div>
            <label htmlFor="industries" className="block text-sm font-medium text-gray-700 mb-1">
              Industries (comma-separated)
            </label>
            <input
              id="industries"
              type="text"
              value={industries}
              onChange={(e) => setIndustries(e.target.value)}
              className="input-field"
              placeholder="e.g., Software, Healthcare"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={searchMutation.isPending}
          className="btn-primary"
        >
          {searchMutation.isPending ? 'Searching...' : 'Search'}
        </button>
      </form>

      {results && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Results ({results.pagination?.total_entries || 0})
            </h2>
          </div>
          <ResultsTable
            data={simplifiedPeople}
            columns={columns}
            loading={searchMutation.isPending}
          />
        </div>
      )}
    </div>
  );
}
