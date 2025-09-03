
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { UserRole } from '../../types';
import { ICONS } from '../../constants';

const Header = () => {
  const { state, dispatch } = useAppContext();
  const { currentUser, teachers } = state;
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value as UserRole;
    if (role === UserRole.Teacher) {
      // Switch to the first teacher for demo purposes
      dispatch({ type: 'SWITCH_USER', payload: { id: teachers[0].id, name: teachers[0].name, role } });
    } else {
      dispatch({ type: 'SWITCH_USER', payload: { id: '', name: role, role } });
    }
  };

  return (
    <header className="flex items-center justify-between h-20 px-6 bg-white dark:bg-secondary-950/70 backdrop-blur-sm border-b border-secondary-200 dark:border-secondary-800">
      <h2 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200">Welcome, {currentUser.name}</h2>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Role:</span>
            <select
                value={currentUser.role}
                onChange={handleRoleChange}
                className="bg-secondary-100 dark:bg-secondary-800 border border-secondary-300 dark:border-secondary-700 rounded-md p-1.5 text-sm focus:ring-primary-500 focus:border-primary-500"
            >
                <option value={UserRole.Admin}>Admin</option>
                <option value={UserRole.Teacher}>Teacher</option>
                <option value={UserRole.Principal}>Principal</option>
            </select>
        </div>
        
        <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-800">
            {darkMode ? ICONS.sun : ICONS.moon}
        </button>

        <div className="relative">
          <button className="p-2 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-800">
            {ICONS.leave}
          </button>
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </div>

        <div className="flex items-center space-x-3">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={`https://i.pravatar.cc/150?u=${currentUser.id}`}
            alt="User avatar"
          />
          <div>
            <p className="font-semibold text-sm text-secondary-800 dark:text-secondary-200">{currentUser.name}</p>
            <p className="text-xs text-secondary-500 dark:text-secondary-400">{currentUser.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
