
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/shared/Card';
import Modal from '../components/shared/Modal';
import { Teacher, UserRole } from '../types';

const TeacherForm = ({ teacher, onClose, onSave }: { teacher?: Teacher; onClose: () => void; onSave: (teacher: Teacher) => void }) => {
    const [formData, setFormData] = useState<Omit<Teacher, 'id'>>({
        name: teacher?.name || '',
        email: teacher?.email || '',
        subject: teacher?.subject || '',
        classTeacherOf: teacher?.classTeacherOf || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: teacher?.id || `T${Date.now()}`, ...formData });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-secondary-300 dark:border-secondary-600 dark:bg-secondary-700 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full rounded-md border-secondary-300 dark:border-secondary-600 dark:bg-secondary-700 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">Subject</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleChange} required className="mt-1 block w-full rounded-md border-secondary-300 dark:border-secondary-600 dark:bg-secondary-700 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">Class Teacher Of (Optional)</label>
                <input type="text" name="classTeacherOf" value={formData.classTeacherOf} onChange={handleChange} className="mt-1 block w-full rounded-md border-secondary-300 dark:border-secondary-600 dark:bg-secondary-700 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border border-secondary-300 text-sm font-medium text-secondary-700 dark:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-600">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-md border border-transparent bg-primary-600 text-sm font-medium text-white hover:bg-primary-700">Save Teacher</button>
            </div>
        </form>
    );
};


const Teachers = () => {
    const { state, dispatch } = useAppContext();
    const { teachers, currentUser } = state;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState<Teacher | undefined>(undefined);

    if (currentUser.role === UserRole.Teacher) {
        return <Card><p>You do not have permission to view this page.</p></Card>;
    }

    const handleAdd = () => {
        setEditingTeacher(undefined);
        setIsModalOpen(true);
    };
    
    const handleEdit = (teacher: Teacher) => {
        setEditingTeacher(teacher);
        setIsModalOpen(true);
    };
    
    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this teacher?')) {
            dispatch({ type: 'DELETE_TEACHER', payload: id });
        }
    };

    const handleSave = (teacher: Teacher) => {
        if (editingTeacher) {
            dispatch({ type: 'UPDATE_TEACHER', payload: teacher });
        } else {
            dispatch({ type: 'ADD_TEACHER', payload: teacher });
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Teacher Management</h1>
                {currentUser.role === UserRole.Admin &&
                    <button onClick={handleAdd} className="px-4 py-2 rounded-md bg-primary-600 text-white font-medium hover:bg-primary-700 flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                        <span>Add Teacher</span>
                    </button>
                }
            </div>

            <Card className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b-2 border-secondary-200 dark:border-secondary-700">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Subject</th>
                            <th className="p-4">Class Teacher</th>
                            <th className="p-4">Email</th>
                            { currentUser.role === UserRole.Admin && <th className="p-4">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {teachers.map(teacher => (
                            <tr key={teacher.id} className="border-b border-secondary-100 dark:border-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-800/50">
                                <td className="p-4 font-medium">{teacher.name}</td>
                                <td className="p-4">{teacher.subject}</td>
                                <td className="p-4">{teacher.classTeacherOf || 'N/A'}</td>
                                <td className="p-4 text-secondary-500 dark:text-secondary-400">{teacher.email}</td>
                                { currentUser.role === UserRole.Admin &&
                                    <td className="p-4 space-x-2">
                                        <button onClick={() => handleEdit(teacher)} className="text-primary-600 hover:text-primary-800">Edit</button>
                                        <button onClick={() => handleDelete(teacher.id)} className="text-red-600 hover:text-red-800">Delete</button>
                                    </td>
                                }
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTeacher ? 'Edit Teacher' : 'Add Teacher'}>
                <TeacherForm teacher={editingTeacher} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
            </Modal>
        </div>
    );
};

export default Teachers;
