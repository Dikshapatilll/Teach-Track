
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { UserRole, TimeTableEntry } from '../types';
import Card from '../components/shared/Card';
import { parseTimetableWithGemini } from '../services/geminiService';

const TimetableGrid = ({ timetable, teachers }: { timetable: TimeTableEntry[], teachers: {id: string, name: string}[] }) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const periods = Array.from({ length: 8 }, (_, i) => i + 1);

    const getTeacherName = (id: string) => teachers.find(t => t.id === id)?.name || 'Unknown';

    if (timetable.length === 0) {
        return <p className="text-center text-secondary-500 mt-8">No timetable data available. Please upload or parse a timetable.</p>;
    }

    return (
        <div className="overflow-x-auto mt-6">
            <table className="min-w-full border-collapse">
                <thead>
                    <tr className="bg-secondary-100 dark:bg-secondary-800">
                        <th className="p-2 border border-secondary-200 dark:border-secondary-700 w-28">Day/Period</th>
                        {periods.map(p => <th key={p} className="p-2 border border-secondary-200 dark:border-secondary-700">Period {p}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {days.map(day => (
                        <tr key={day}>
                            <td className="p-2 border border-secondary-200 dark:border-secondary-700 font-semibold">{day}</td>
                            {periods.map(period => {
                                const entry = timetable.find(e => e.day === day && e.period === period);
                                return (
                                    <td key={`${day}-${period}`} className="p-2 border border-secondary-200 dark:border-secondary-700 h-24 align-top">
                                        {entry && (
                                            <div className="bg-primary-50 dark:bg-primary-900/50 p-2 rounded-md text-xs">
                                                <p className="font-bold">{entry.subject}</p>
                                                <p>{entry.className}</p>
                                                <p className="text-primary-600 dark:text-primary-400">{getTeacherName(entry.teacherId)}</p>
                                            </div>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const TimetableUploader = () => {
    const { state, dispatch } = useAppContext();
    const [timetableText, setTimetableText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const teacherNameIdMap = state.teachers.map(t => ({id: t.id, name: t.name}));

    const handleParse = async () => {
        if (!timetableText.trim()) {
            setError('Please paste timetable data.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const parsedTimetable = await parseTimetableWithGemini(timetableText, teacherNameIdMap);
            dispatch({ type: 'SET_TIMETABLE', payload: parsedTimetable });
            setTimetableText('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <h2 className="text-xl font-semibold mb-4 text-secondary-900 dark:text-white">Parse Timetable with AI</h2>
            <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">Paste unstructured timetable data below. The AI will parse it into a structured format. For best results, include day, period, subject, class, and teacher name for each entry. Make sure teacher names match those in the system.</p>
            <textarea
                value={timetableText}
                onChange={(e) => setTimetableText(e.target.value)}
                placeholder="e.g., Monday Period 1: Maths for 10-A by John Doe..."
                className="w-full h-40 p-2 border rounded-md bg-secondary-50 dark:bg-secondary-800 border-secondary-300 dark:border-secondary-700"
                disabled={isLoading}
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <button
                onClick={handleParse}
                disabled={isLoading}
                className="mt-4 px-4 py-2 rounded-md bg-primary-600 text-white font-medium hover:bg-primary-700 disabled:bg-primary-300 flex items-center justify-center w-40"
            >
                {isLoading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : 'Parse Timetable'}
            </button>
        </Card>
    );
};

const Timetable = () => {
    const { state } = useAppContext();
    const { currentUser, timetable, teachers } = state;
    const teacherNameIdMap = teachers.map(t => ({id: t.id, name: t.name}));

    return (
        <div>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-6">Class Timetable</h1>
            {currentUser.role === UserRole.Admin &&
                <div className="mb-6">
                    <TimetableUploader />
                </div>
            }
            <Card>
                <TimetableGrid timetable={timetable} teachers={teacherNameIdMap} />
            </Card>
        </div>
    );
};

export default Timetable;
