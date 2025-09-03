
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { LeaveRequest, UserRole } from '../types';
import Card from '../components/shared/Card';
import Modal from '../components/shared/Modal';

const LeaveForm = ({ onClose }: { onClose: () => void }) => {
    const { state, dispatch } = useAppContext();
    const { currentUser } = state;
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        reason: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newRequest: LeaveRequest = {
            id: `LR${Date.now()}`,
            teacherId: currentUser.id,
            ...formData,
            status: 'pending',
        };
        dispatch({ type: 'ADD_LEAVE_REQUEST', payload: newRequest });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">Start Date</label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="mt-1 block w-full rounded-md border-secondary-300 dark:border-secondary-600 dark:bg-secondary-700 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">End Date</label>
                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className="mt-1 block w-full rounded-md border-secondary-300 dark:border-secondary-600 dark:bg-secondary-700 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">Reason</label>
                <textarea name="reason" value={formData.reason} onChange={handleChange} required rows={3} className="mt-1 block w-full rounded-md border-secondary-300 dark:border-secondary-600 dark:bg-secondary-700 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border border-secondary-300 text-sm font-medium text-secondary-700 dark:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-600">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-md border border-transparent bg-primary-600 text-sm font-medium text-white hover:bg-primary-700">Submit Request</button>
            </div>
        </form>
    );
};

const LeaveManagement = () => {
    const { state, dispatch } = useAppContext();
    const { leaveRequests, teachers, currentUser } = state;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getTeacherName = (id: string) => teachers.find(t => t.id === id)?.name || 'Unknown';

    const handleStatusChange = (id: string, status: 'approved' | 'rejected') => {
        dispatch({ type: 'UPDATE_LEAVE_STATUS', payload: { id, status } });
    };

    const StatusBadge = ({ status }: { status: LeaveRequest['status'] }) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        };
        return (
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[status]}`}>
                {status}
            </span>
        );
    };

    const requestsToShow = currentUser.role === UserRole.Teacher
        ? leaveRequests.filter(lr => lr.teacherId === currentUser.id)
        : leaveRequests;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Leave Management</h1>
                {currentUser.role === UserRole.Teacher &&
                    <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 rounded-md bg-primary-600 text-white font-medium hover:bg-primary-700 flex items-center space-x-2">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                        <span>Apply for Leave</span>
                    </button>
                }
            </div>

            <Card className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b-2 border-secondary-200 dark:border-secondary-700">
                        <tr>
                            {currentUser.role !== UserRole.Teacher && <th className="p-4">Teacher</th>}
                            <th className="p-4">Dates</th>
                            <th className="p-4">Reason</th>
                            <th className="p-4">Status</th>
                            {currentUser.role === UserRole.Admin && <th className="p-4">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {requestsToShow.map(req => (
                            <tr key={req.id} className="border-b border-secondary-100 dark:border-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-800/50">
                                {currentUser.role !== UserRole.Teacher && <td className="p-4 font-medium">{getTeacherName(req.teacherId)}</td>}
                                <td className="p-4">{req.startDate} to {req.endDate}</td>
                                <td className="p-4 text-secondary-500 dark:text-secondary-400 max-w-sm truncate">{req.reason}</td>
                                <td className="p-4 capitalize"><StatusBadge status={req.status} /></td>
                                {currentUser.role === UserRole.Admin && (
                                    <td className="p-4 space-x-2">
                                        {req.status === 'pending' && (
                                            <>
                                                <button onClick={() => handleStatusChange(req.id, 'approved')} className="text-green-600 hover:text-green-800 font-semibold">Approve</button>
                                                <button onClick={() => handleStatusChange(req.id, 'rejected')} className="text-red-600 hover:text-red-800 font-semibold">Reject</button>
                                            </>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {requestsToShow.length === 0 && <p className="text-center p-8 text-secondary-500">No leave requests found.</p>}
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Apply for Leave">
                <LeaveForm onClose={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default LeaveManagement;
