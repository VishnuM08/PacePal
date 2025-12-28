'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

// This interface is the "contract" that tells TypeScript to expect onSave
interface TimerProps {
    onSave: () => void;
}

export default function Timer({ onSave }: TimerProps) {
    const [seconds, setSeconds] = useState(10); // Set to 10 for quick testing
    const [isActive, setIsActive] = useState(false);
    const [topic, setTopic] = useState('');

    useEffect(() => {
        let interval: any = null;
        if (isActive && seconds > 0) {
            interval = setInterval(() => {
                setSeconds((s) => s - 1);
            }, 1000);
        } else if (seconds === 0) {
            clearInterval(interval);
            saveSession();
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    const saveSession = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:8080/api/sessions/save',
                {
                    durationMinutes: 1,
                    topic: topic || 'General Study'
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // CALL THE BOSS: This tells the Dashboard to refresh the table
            onSave();

            alert('Session saved!');
            setSeconds(60);
            setIsActive(false);
        } catch (err) {
            console.error("Error saving session", err);
        }
    };

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="text-center">
            <h2 className="text-xl font-bold mb-2">Focus Timer</h2>
            <input
                type="text"
                placeholder="Topic..."
                className="mb-2 p-1 border rounded w-full text-black"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
            />
            <div className="text-4xl font-mono font-bold mb-4 text-indigo-600">
                {formatTime(seconds)}
            </div>
            <div className="flex gap-2 justify-center">
                <button
                    disabled={!topic.trim() && !isActive} // Disable start if no topic
                    onClick={() => setIsActive(!isActive)}
                    className={`px-8 py-2 rounded-full font-bold text-white shadow-md transition 
      ${!topic.trim() && !isActive ? 'bg-gray-300 cursor-not-allowed' :
                            isActive ? 'bg-orange-400 hover:bg-orange-500' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                >
                    {isActive ? 'PAUSE' : 'START FOCUS'}
                </button>

                <button
                    onClick={() => { setIsActive(false); setSeconds(1500); }}
                    className="px-4 py-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition"
                >
                    RESET
                </button>
            </div>
            {!topic.trim() && !isActive && (
                <p className="text-xs text-red-500 mt-2">Please enter a topic to start focusing.</p>
            )}
        </div>
    );
}