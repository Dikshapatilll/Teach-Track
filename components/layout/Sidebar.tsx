import React from 'react';
import { NavLink } from 'react-router-dom';
import { ICONS } from '../../constants';
import { useAppContext } from '../../context/AppContext';
import { UserRole } from '../../types';

const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
          isActive
            ? 'bg-primary-500 text-white shadow-lg'
            : 'text-secondary-600 dark:text-secondary-300 hover:bg-primary-100 dark:hover:bg-secondary-800'
        }`
      }
    >
      <span className="mr-3">{icon}</span>
      <span className="font-medium">{label}</span>
    </NavLink>
  </li>
);

const Sidebar = () => {
  const { state } = useAppContext();
  const { role } = state.currentUser;

  return (
    <div className="w-64 bg-white dark:bg-secondary-950/70 backdrop-blur-sm border-r border-secondary-200 dark:border-secondary-800 flex-col hidden md:flex">
      <div className="flex items-center justify-center h-20 border-b border-secondary-200 dark:border-secondary-800">
        <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">TeachTrack</h1>
      </div>
      <nav className="flex-1 p-4">
        <ul>
          <NavItem to="/dashboard" icon={ICONS.dashboard} label="Dashboard" />
          
          {(role === UserRole.Admin || role === UserRole.Principal) && (
            <NavItem to="/teachers" icon={ICONS.teachers} label="Teachers" />
          )}

          <NavItem to="/timetable" icon={ICONS.timetable} label="Timetable" />
          
          {(role === UserRole.Admin || role === UserRole.Principal) && (
            <NavItem to="/reports" icon={ICONS.reports} label="Reports" />
          )}
          
          <NavItem to="/leave" icon={ICONS.leave} label="Leave" />
        </ul>
      </nav>
      <div className="p-4 border-t border-secondary-200 dark:border-secondary-800">
        <button className="flex items-center justify-center w-full p-3 rounded-lg text-secondary-600 dark:text-secondary-300 hover:bg-primary-100 dark:hover:bg-secondary-800">
          <span className="mr-3">{ICONS.logout}</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;