
import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { AppState, AppAction, UserRole, Teacher } from '../types';

const TEACHERS: Teacher[] = [
    { id: 'T01', name: 'John Doe', email: 'john.doe@example.com', subject: 'Mathematics', classTeacherOf: '10-A' },
    { id: 'T02', name: 'Jane Smith', email: 'jane.smith@example.com', subject: 'Science' },
    { id: 'T03', name: 'Peter Jones', email: 'peter.jones@example.com', subject: 'History', classTeacherOf: '9-B' },
    { id: 'T04', name: 'Mary Johnson', email: 'mary.j@example.com', subject: 'English' },
];

const USERS = {
    [UserRole.Admin]: { id: 'U0A', name: 'Admin User', role: UserRole.Admin },
    [UserRole.Teacher]: { id: 'T01', name: 'John Doe', role: UserRole.Teacher },
    [UserRole.Principal]: { id: 'U0P', name: 'Principal', role: UserRole.Principal }
};

const initialState: AppState = {
    currentUser: USERS[UserRole.Admin],
    teachers: TEACHERS,
    timetable: [],
    dailyLogs: [
        { id: 'L01', date: '2024-07-20', teacherId: 'T01', periodsTaken: 4, proxyPeriods: 1, onLeave: false },
        { id: 'L02', date: '2024-07-20', teacherId: 'T02', periodsTaken: 5, proxyPeriods: 0, onLeave: false },
        { id: 'L03', date: '2024-07-21', teacherId: 'T03', periodsTaken: 0, proxyPeriods: 0, onLeave: true },
    ],
    leaveRequests: [
        { id: 'LR01', teacherId: 'T03', startDate: '2024-07-21', endDate: '2024-07-21', reason: 'Personal emergency', status: 'approved' },
        { id: 'LR02', teacherId: 'T04', startDate: '2024-07-25', endDate: '2024-07-26', reason: 'Family wedding', status: 'pending' }
    ],
};

const appReducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
        case 'SWITCH_USER':
            const role = action.payload.role;
            const user = USERS[role] || USERS[UserRole.Teacher];
            if (role === UserRole.Teacher) {
                const teacherUser = state.teachers.find(t => t.id === action.payload.id);
                return { ...state, currentUser: { id: teacherUser!.id, name: teacherUser!.name, role: UserRole.Teacher } };
            }
            return { ...state, currentUser: user };
        case 'ADD_TEACHER':
            return { ...state, teachers: [...state.teachers, action.payload] };
        case 'UPDATE_TEACHER':
            return {
                ...state,
                teachers: state.teachers.map(t => t.id === action.payload.id ? action.payload : t),
            };
        case 'DELETE_TEACHER':
            return {
                ...state,
                teachers: state.teachers.filter(t => t.id !== action.payload),
            };
        case 'SET_TIMETABLE':
            return { ...state, timetable: action.payload };
        case 'ADD_LOG':
             return { ...state, dailyLogs: [...state.dailyLogs, action.payload] };
        case 'ADD_LEAVE_REQUEST':
            return { ...state, leaveRequests: [...state.leaveRequests, action.payload] };
        case 'UPDATE_LEAVE_STATUS':
            return {
                ...state,
                leaveRequests: state.leaveRequests.map(lr =>
                    lr.id === action.payload.id ? { ...lr, status: action.payload.status } : lr
                ),
            };
        default:
            return state;
    }
};

const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<AppAction> } | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);
    return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
