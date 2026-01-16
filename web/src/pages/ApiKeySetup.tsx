import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

export default function ApiKeySetup() {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.saveApiKey(apiKey);
      toast.success('API key saved successfully!');
      navigate('/search-people');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save API key');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/search-people');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Set Up Your Apollo.io API Key</h1>
        <p className="text-gray-600 mb-6">
          To use the Apollo.io tools, you need to provide your Apollo.io API key. This key will be securely
          encrypted and stored.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">How to get your API key:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
            <li>Go to Apollo.io and sign in to your account</li>
            <li>Navigate to Settings → Integrations</li>
            <li>Find the API option and click Connect</li>
            <li>Click "API keys" and create a new key</li>
            <li>Copy the key and paste it below</li>
          </ol>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
              Apollo.io API Key
            </label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="input-field"
              placeholder="Enter your Apollo.io API key"
            />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={loading || !apiKey} className="flex-1 btn-primary">
              {loading ? 'Saving...' : 'Save API Key'}
            </button>
            <button type="button" onClick={handleSkip} className="flex-1 btn-secondary">
              Skip for Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
