import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { formatDistance } from '../lib/utils';

export default function History() {
  const { data, isLoading } = useQuery({
    queryKey: ['history'],
    queryFn: () => api.getSearchHistory(1, 50),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Search History</h1>
        <p className="text-gray-600 mt-2">View your recent searches</p>
      </div>

      {data?.data && data.data.length > 0 ? (
        <div className="space-y-3">
          {data.data.map((item: any) => (
            <div key={item.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.tool_name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Results: {item.result_count} • {formatDistance(item.created_at)}
                  </p>
                  <pre className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded overflow-auto">
                    {JSON.stringify(item.query_params, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-500">No search history yet. Start searching to see your history here.</p>
        </div>
      )}
    </div>
  );
}
