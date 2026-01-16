import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import toast from 'react-hot-toast';
import ResultsTable from '../components/ResultsTable';

export default function SearchCompanies() {
  const [query, setQuery] = useState('');
  const [locations, setLocations] = useState('');
  const [keywords, setKeywords] = useState('');
  const [employeeRanges, setEmployeeRanges] = useState('');
  const [results, setResults] = useState<any>(null);

  const searchMutation = useMutation({
    mutationFn: (params: any) => api.searchCompanies(params),
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
    if (locations) filters.organization_locations = locations.split(',').map(s => s.trim());
    if (keywords) filters.q_organization_keyword_tags = keywords.split(',').map(s => s.trim());
    if (employeeRanges) filters.organization_num_employees_ranges = employeeRanges.split(',').map(s => s.trim());

    searchMutation.mutate({
      q: query,
      ...filters,
      per_page: 25,
    });
  };

  const columns = [
    { key: 'name', label: 'Company' },
    { key: 'industry', label: 'Industry' },
    { key: 'employee_count', label: 'Employees' },
    { key: 'location', label: 'Location' },
    {
      key: 'website',
      label: 'Website',
      render: (url: string) => url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
          Visit
        </a>
      ) : '-'
    },
  ];

  const simplifiedCompanies = results?.organizations?.map((company: any) => ({
    name: company.name,
    industry: company.industry,
    employee_count: company.employee_count,
    location: `${company.city || ''}, ${company.state || ''}, ${company.country || ''}`.replace(/^,\s*/, '').replace(/,\s*$/, ''),
    website: company.website_url,
  })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Search Companies</h1>
        <p className="text-gray-600 mt-2">Find companies in Apollo's database with advanced filtering</p>
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
            placeholder="e.g., education technology, fintech"
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
            <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-1">
              Keywords (comma-separated)
            </label>
            <input
              id="keywords"
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="input-field"
              placeholder="e.g., edtech, saas, fintech"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="employeeRanges" className="block text-sm font-medium text-gray-700 mb-1">
              Employee Ranges (comma format: 11,20 or 21,50)
            </label>
            <input
              id="employeeRanges"
              type="text"
              value={employeeRanges}
              onChange={(e) => setEmployeeRanges(e.target.value)}
              className="input-field"
              placeholder="e.g., 11,20, 21,50, 51,100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use comma format like "11,20" not "11-20". This filter is very restrictive.
            </p>
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
            data={simplifiedCompanies}
            columns={columns}
            loading={searchMutation.isPending}
          />
        </div>
      )}
    </div>
  );
}
