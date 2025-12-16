// components/Navbar.jsx
import { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { LogIn } from "lucide-react";

export default function Navbar({ toggleSidebar }) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const avatarRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  // close dropdown on outside click
  useEffect(() => {
    function onDocClick(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(e.target)
      ) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-10 py-4 flex items-center justify-between shadow-sm fixed top-0 z-40">
      <Link to="/">
        <h1 className="text-2xl font-extrabold text-blue-900 cursor-pointer">
          AI & DS Association
        </h1>
      </Link>

      {/* RIGHT SIDE */}
      {!user ? (
        <Link
          to="/login"
          className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition font-medium"
        >
          <LogIn size={18} />
          Login
        </Link>
      ) : (
        <div className="relative">
          {/* Avatar */}
          <div
            ref={avatarRef}
            className="cursor-pointer text-blue-800"
            onClick={(e) => {
              e.stopPropagation();
              setProfileMenuOpen((s) => !s);
            }}
          >
            <FaUserCircle size={42} />
          </div>

          {/* Dropdown */}
          {profileMenuOpen && (
            <div
              ref={menuRef}
              className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border z-[9999]"
            >
              <ul className="py-2">
                <li>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-50"
                    onClick={() => navigate("/profile")}
                  >
                    My Profile
                  </button>
                </li>
                <li>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-50"
                    onClick={() => navigate("/edit-profile")}
                  >
                    Edit Profile
                  </button>
                </li>
                <li>
                  <button
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
