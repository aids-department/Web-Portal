// components/Navbar.jsx
import { Link } from "react-router-dom";
import { User, LogOut, LogIn } from "lucide-react";

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="w-full bg-white border-b border-gray-200 px-10 py-4 flex items-center justify-between shadow-sm fixed top-0 z-40">
      <Link to="/">
        <h1 className="text-2xl font-extrabold text-blue-900 cursor-pointer hover:text-blue-700 transition">
          AI & DS Association
        </h1>
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="flex items-center gap-2 text-blue-900">
              <User size={20} />
              <span className="font-medium">{user.fullName || user.username}</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium"
            >
              <LogOut size={18} />
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition font-medium"
          >
            <LogIn size={18} />
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}