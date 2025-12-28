'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Timer() {
  const [seconds, setSeconds] = useState(60); // 25 minutes
  const [isActive, setIsActive] = useState(false);
  const [topic, setTopic] = useState('');

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
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
      // Add the headers object as the third argument
      await axios.post('http://localhost:8080/api/sessions/save', 
        {
          durationMinutes: 1, // Testing with 1 minute
          topic: topic || 'General Study'
        },
        { 
          headers: { 
            Authorization: `Bearer ${token}` // This is the missing piece!
          } 
        }
      );
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
    <div className="p-6 bg-white rounded-xl shadow-inner text-center">
      <h2 className="text-2xl font-bold mb-4">Focus Timer</h2>
      <input 
        type="text" 
        placeholder="What are you studying?" 
        className="mb-4 p-2 border rounded w-full"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <div className="text-6xl font-mono font-bold mb-6 text-indigo-600">
        {formatTime(seconds)}
      </div>
      <div className="space-x-4">
        <button 
          onClick={() => setIsActive(!isActive)}
          className={`px-6 py-2 rounded-full font-bold text-white ${isActive ? 'bg-orange-500' : 'bg-green-500'}`}
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button 
          onClick={() => {setIsActive(false); setSeconds(1500);}}
          className="px-6 py-2 rounded-full bg-gray-300 font-bold"
        >
          Reset
        </button>
      </div>
    </div>
  );
}