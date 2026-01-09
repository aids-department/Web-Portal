import { useLocation } from 'react-router-dom';

export default function ProfessionalAdminLayout({ children }) {
  const location = useLocation();
  
  const isActive = (path) => {
    if (path === '/adminpage') {
      return location.pathname === '/adminpage';
    }
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* ADMIN NAVBAR */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Admin Portal</h1>
                <p className="text-gray-500 text-sm">Management Dashboard</p>
              </div>
            </div>
            <button 
              onClick={() => {
                localStorage.removeItem('adminAuth');
                localStorage.removeItem('adminData');
                window.location.href = '/admin-login';
              }}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-sm font-medium border border-red-200"
            >
              Logout
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <a href="/adminpage" className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium border ${
              isActive('/adminpage') 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
            }`}>
              Dashboard
            </a>
            <a href="/adminpage/events" className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium border ${
              isActive('/adminpage/events') 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
            }`}>
              Events
            </a>
            <a href="/adminpage/manage-uploads" className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium border ${
              isActive('/adminpage/manage-uploads') 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
            }`}>
              Uploads
            </a>
            <a href="/adminpage/manage-content-updates" className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium border ${
              isActive('/adminpage/manage-content-updates') 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
            }`}>
              Updates
            </a>
            <a href="/adminpage/manage-content" className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium border ${
              isActive('/adminpage/manage-content') 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
            }`}>
              Content
            </a>
            <a href="/adminpage/leaderboard" className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium border ${
              isActive('/adminpage/leaderboard') 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
            }`}>
              Leaderboard
            </a>
            <a href="/adminpage/achievements" className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium border ${
              isActive('/adminpage/achievements') 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
            }`}>
              Achievements
            </a>
          </div>
        </div>
      </nav>

      {/* ADMIN CONTENT */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}