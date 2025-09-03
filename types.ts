
export enum UserRole {
  Admin = 'Admin',
  Teacher = 'Teacher',
  Principal = 'Principal',
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  classTeacherOf?: string;
}

export interface TimeTableEntry {
  day: string;
  period: number;
  subject: string;
  className: string;
  teacherId: string;
}

export interface DailyLog {
  id: string;
  date: string; // YYYY-MM-DD
  teacherId: string;
  periodsTaken: number;
  proxyPeriods: number;
  onLeave: boolean;
}

export interface LeaveRequest {
  id: string;
  teacherId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface AppState {
  currentUser: {
    id: string;
    name: string;
    role: UserRole;
  };
  teachers: Teacher[];
  timetable: TimeTableEntry[];
  dailyLogs: DailyLog[];
  leaveRequests: LeaveRequest[];
}

export type AppAction =
  | { type: 'SWITCH_USER'; payload: { id: string; name: string; role: UserRole } }
  | { type: 'ADD_TEACHER'; payload: Teacher }
  | { type: 'UPDATE_TEACHER'; payload: Teacher }
  | { type: 'DELETE_TEACHER'; payload: string }
  | { type: 'SET_TIMETABLE'; payload: TimeTableEntry[] }
  | { type: 'ADD_LOG'; payload: DailyLog }
  | { type: 'ADD_LEAVE_REQUEST'; payload: LeaveRequest }
  | { type: 'UPDATE_LEAVE_STATUS'; payload: { id: string; status: 'approved' | 'rejected' } };
