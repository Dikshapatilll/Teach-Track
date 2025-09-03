
import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/shared/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { UserRole } from '../types';

const StatsCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) => (
    <Card className="flex items-center p-4">
        <div className="p-3 mr-4 text-primary-500 bg-primary-100 dark:bg-primary-900/50 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">{title}</p>
            <p className="text-2xl font-bold text-secondary-800 dark:text-secondary-100">{value}</p>
        </div>
    </Card>
);

const Dashboard = () => {
    const { state } = useAppContext();
    const { teachers, dailyLogs, leaveRequests, currentUser } = state;

    const workloadData = useMemo(() => {
        return teachers.map(teacher => {
            const logs = dailyLogs.filter(log => log.teacherId === teacher.id);
            const periodsTaken = logs.reduce((sum, log) => sum + log.periodsTaken, 0);
            const proxyPeriods = logs.reduce((sum, log) => sum + log.proxyPeriods, 0);
            return { name: teacher.name, 'Periods Taken': periodsTaken, 'Proxy Periods': proxyPeriods };
        });
    }, [teachers, dailyLogs]);
    
    const leaveData = useMemo(() => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyLeaves = monthNames.map(month => ({ name: month, Leaves: 0 }));
        
        leaveRequests.forEach(req => {
            if (req.status === 'approved') {
                const monthIndex = new Date(req.startDate).getMonth();
                monthlyLeaves[monthIndex].Leaves++;
            }
        });
        
        return monthlyLeaves;

    }, [leaveRequests]);

    const teacherData = useMemo(() => {
        if (currentUser.role !== UserRole.Teacher) return null;
        const logs = dailyLogs.filter(log => log.teacherId === currentUser.id);
        const periodsTaken = logs.reduce((sum, log) => sum + log.periodsTaken, 0);
        const proxyPeriods = logs.reduce((sum, log) => sum + log.proxyPeriods, 0);
        const onLeave = dailyLogs.filter(log => log.teacherId === currentUser.id && log.onLeave).length;
        
        return { periodsTaken, proxyPeriods, onLeave };

    }, [currentUser, dailyLogs]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-6">Dashboard</h1>
            
            { (currentUser.role === UserRole.Admin || currentUser.role === UserRole.Principal) &&
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard title="Total Teachers" value={teachers.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.281-1.27-.74-1.684M7 15H4v5h3v-5zM7 15a3 3 0 013-3h2a3 3 0 013 3v5H7v-5zM12 12a3 3 0 01-3-3V7a3 3 0 016 0v2a3 3 0 01-3 3z"/></svg>} />
                    <StatsCard title="Total Periods Logged" value={dailyLogs.reduce((sum, log) => sum + log.periodsTaken, 0)} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-5.747-8.494l11.494 0" /></svg>} />
                    <StatsCard title="Pending Leave Requests" value={leaveRequests.filter(lr => lr.status === 'pending').length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
                    <StatsCard title="Proxy Periods Assigned" value={dailyLogs.reduce((sum, log) => sum + log.proxyPeriods, 0)} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <h3 className="font-semibold mb-4 text-secondary-800 dark:text-secondary-100">Teacher Workload</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={workloadData}>
                                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: 'none', borderRadius: '0.5rem' }}/>
                                <Legend />
                                <Bar dataKey="Periods Taken" fill="#3b82f6" />
                                <Bar dataKey="Proxy Periods" fill="#8b5cf6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                    <Card>
                        <h3 className="font-semibold mb-4 text-secondary-800 dark:text-secondary-100">Monthly Leave Trends</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={leaveData}>
                                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: 'none', borderRadius: '0.5rem' }}/>
                                <Legend />
                                <Line type="monotone" dataKey="Leaves" stroke="#ef4444" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
            </>
            }
             { currentUser.role === UserRole.Teacher && teacherData &&
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatsCard title="My Periods Taken" value={teacherData.periodsTaken} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-5.747-8.494l11.494 0" /></svg>} />
                    <StatsCard title="My Proxy Periods" value={teacherData.proxyPeriods} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>} />
                    <StatsCard title="My Leaves Taken" value={teacherData.onLeave} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
                </div>
             }
        </div>
    );
};

export default Dashboard;
