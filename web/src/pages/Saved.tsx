import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export default function Saved() {
  const { data, isLoading } = useQuery({
    queryKey: ['saved'],
    queryFn: () => api.getSavedResults(),
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
        <h1 className="text-3xl font-bold text-gray-900">Saved Results</h1>
        <p className="text-gray-600 mt-2">View your bookmarked companies and people</p>
      </div>

      {data?.data && data.data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.data.map((item: any) => (
            <div key={item.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {item.result_type}
                </span>
              </div>
              <pre className="text-sm text-gray-700 bg-gray-50 p-3 rounded overflow-auto max-h-48">
                {JSON.stringify(item.result_data, null, 2)}
              </pre>
              {item.notes && (
                <p className="text-sm text-gray-600 mt-3 italic">{item.notes}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-500">No saved results yet. Start saving results to see them here.</p>
        </div>
      )}
    </div>
  );
}
