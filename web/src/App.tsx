import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import ApiKeySetup from './pages/ApiKeySetup';
import SearchPeople from './pages/SearchPeople';
import SearchCompanies from './pages/SearchCompanies';
import EnrichPerson from './pages/EnrichPerson';
import EnrichCompany from './pages/EnrichCompany';
import BulkEnrichPeople from './pages/BulkEnrichPeople';
import BulkEnrichOrganizations from './pages/BulkEnrichOrganizations';
import OrganizationJobs from './pages/OrganizationJobs';
import OrganizationInfo from './pages/OrganizationInfo';
import SearchNews from './pages/SearchNews';
import History from './pages/History';
import Saved from './pages/Saved';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/" element={<Dashboard />}>
        <Route index element={<Navigate to="/search-people" replace />} />
        <Route path="api-key-setup" element={<ApiKeySetup />} />
        <Route path="search-people" element={<SearchPeople />} />
        <Route path="search-companies" element={<SearchCompanies />} />
        <Route path="enrich-person" element={<EnrichPerson />} />
        <Route path="enrich-company" element={<EnrichCompany />} />
        <Route path="bulk-enrich-people" element={<BulkEnrichPeople />} />
        <Route path="bulk-enrich-organizations" element={<BulkEnrichOrganizations />} />
        <Route path="organization-jobs" element={<OrganizationJobs />} />
        <Route path="organization-info" element={<OrganizationInfo />} />
        <Route path="search-news" element={<SearchNews />} />
        <Route path="history" element={<History />} />
        <Route path="saved" element={<Saved />} />
      </Route>
    </Routes>
  );
}

export default App;
