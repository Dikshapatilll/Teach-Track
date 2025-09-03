
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';
import Card from '../components/shared/Card';

const Reports = () => {
    const { state } = useAppContext();
    const { dailyLogs, teachers, currentUser } = state;
    const [selectedTeacher, setSelectedTeacher] = useState<string>('all');
    const [selectedMonth, setSelectedMonth] = useState<string>('all');

    if (currentUser.role === UserRole.Teacher) {
        return <Card><p>You do not have permission to view this page.</p></Card>;
    }
    
    const getTeacherName = (id: string) => teachers.find(t => t.id === id)?.name || 'Unknown Teacher';

    const filteredLogs = useMemo(() => {
        return dailyLogs.filter(log => {
            const teacherMatch = selectedTeacher === 'all' || log.teacherId === selectedTeacher;
            const monthMatch = selectedMonth === 'all' || new Date(log.date).getMonth() === parseInt(selectedMonth);
            return teacherMatch && monthMatch;
        });
    }, [dailyLogs, selectedTeacher, selectedMonth]);

    const monthOptions = [
        { value: 'all', label: 'All Months' },
        ...Array.from({length: 12}, (_, i) => ({ value: i.toString(), label: new Date(0, i).toLocaleString('default', { month: 'long' }) }))
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-6">Activity Reports</h1>

            <Card className="mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    <div>
                        <label htmlFor="teacherFilter" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">Filter by Teacher</label>
                        <select
                            id="teacherFilter"
                            value={selectedTeacher}
                            onChange={e => setSelectedTeacher(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-secondary-300 dark:bg-secondary-800 dark:border-secondary-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                        >
                            <option value="all">All Teachers</option>
                            {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="monthFilter" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">Filter by Month</label>
                        <select
                            id="monthFilter"
                            value={selectedMonth}
                            onChange={e => setSelectedMonth(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-secondary-300 dark:bg-secondary-800 dark:border-secondary-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                        >
                            {monthOptions.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                        </select>
                    </div>
                </div>
            </Card>

            <Card className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="border-b-2 border-secondary-200 dark:border-secondary-700">
                        <tr>
                            <th className="p-4">Date</th>
                            <th className="p-4">Teacher</th>
                            <th className="p-4 text-center">Periods Taken</th>
                            <th className="p-4 text-center">Proxy Periods</th>
                            <th className="p-4 text-center">On Leave</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.length > 0 ? filteredLogs.map(log => (
                            <tr key={log.id} className="border-b border-secondary-100 dark:border-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-800/50">
                                <td className="p-4 font-medium">{new Date(log.date).toLocaleDateString()}</td>
                                <td className="p-4">{getTeacherName(log.teacherId)}</td>
                                <td className="p-4 text-center">{log.periodsTaken}</td>
                                <td className="p-4 text-center">{log.proxyPeriods}</td>
                                <td className="p-4 text-center">
                                    {log.onLeave ? 
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Yes</span> : 
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">No</span>
                                    }
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="text-center p-8 text-secondary-500">No logs found for the selected criteria.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default Reports;
