import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  UserIcon,
  BuildingStorefrontIcon,
  UsersIcon,
  BriefcaseIcon,
  InformationCircleIcon,
  NewspaperIcon,
  ClockIcon,
  BookmarkIcon,
  ArrowRightOnRectangleIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Search People', href: '/search-people', icon: MagnifyingGlassIcon },
  { name: 'Search Companies', href: '/search-companies', icon: BuildingOfficeIcon },
  { name: 'Enrich Person', href: '/enrich-person', icon: UserIcon },
  { name: 'Enrich Company', href: '/enrich-company', icon: BuildingStorefrontIcon },
  { name: 'Bulk Enrich People', href: '/bulk-enrich-people', icon: UsersIcon },
  { name: 'Bulk Enrich Organizations', href: '/bulk-enrich-organizations', icon: BuildingStorefrontIcon },
  { name: 'Organization Jobs', href: '/organization-jobs', icon: BriefcaseIcon },
  { name: 'Organization Info', href: '/organization-info', icon: InformationCircleIcon },
  { name: 'Search News', href: '/search-news', icon: NewspaperIcon },
];

const secondaryNav = [
  { name: 'Search History', href: '/history', icon: ClockIcon },
  { name: 'Saved Results', href: '/saved', icon: BookmarkIcon },
  { name: 'API Key Setup', href: '/api-key-setup', icon: KeyIcon },
];

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Apollo.io Web</h1>
          <p className="text-sm text-gray-600 mt-1">{user?.email}</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 space-y-1">
            {secondaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
