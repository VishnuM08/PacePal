"use client";

import { useEffect, useState } from "react";

interface TimerProps {
  token: string;
  onSave?: () => void;   // 👈 NEW
}

export default function Timer({ token, onSave }: TimerProps) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [topic, setTopic] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const startTimer = () => {
    setSeconds(0);
    setIsRunning(true);
  };

  const stopTimer = async () => {
    setIsRunning(false);

    const durationMinutes = Math.floor(seconds / 60);

    await fetch("http://localhost:8080/api/sessions/save", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startTime: new Date(Date.now() - seconds * 1000),
        endTime: new Date(),
        durationMinutes,
        topic,
      }),
    });

    alert("Session saved!");

    // 👇 CALL DASHBOARD REFRESH
    if (onSave) onSave();

    setTopic("");
    setSeconds(0);
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Study Timer</h3>

      <input
        placeholder="Topic / what you're studying"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      <h2>
        {Math.floor(seconds / 60)} : {String(seconds % 60).padStart(2, "0")}
      </h2>

      {!isRunning && <button onClick={startTimer}>Start</button>}

      {isRunning && <button onClick={stopTimer}>Stop & Save</button>}
    </div>
  );
}
