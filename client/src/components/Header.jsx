import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ProgressBar from './ProgressBar';
import { cn } from '../utils/cn';

export default function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 border-b",
      "bg-primary dark:bg-primary-dark",
      "border-primary-dark dark:border-primary"
    )}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="text-xl font-rpg font-bold text-white">
              RPG Todo
            </Link>
            <nav className="hidden md:flex gap-4">
              <Link
                to="/dashboard"
                className="text-white hover:text-primary-light transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/history"
                className="text-white hover:text-primary-light transition-colors"
              >
                History
              </Link>
              <Link
                to="/achievements"
                className="text-white hover:text-primary-light transition-colors"
              >
                Achievements
              </Link>
              <Link
                to="/profile"
                className="text-white hover:text-primary-light transition-colors"
              >
                Profile
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden md:block w-48">
                <ProgressBar
                  currentXP={user.total_xp}
                  currentLevel={user.current_level}
                />
              </div>
            )}
            <button
              onClick={toggleTheme}
              className="px-3 py-1 text-white hover:text-primary-light transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-white hover:text-primary-light transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}


