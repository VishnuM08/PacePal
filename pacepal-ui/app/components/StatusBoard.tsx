import { useEffect, useState } from "react";
import { connectSocket, sendStatus, StatusMessage } from "../websocket";

interface Props {
  username: string;
}

export default function StatusBoard({ username }: Props) {
  const [statuses, setStatuses] = useState<StatusMessage[]>([]);

  useEffect(() => {
    connectSocket((msg: StatusMessage) => {
      setStatuses((prev) => [...prev, msg]);
    });
  }, []);

  return (
    <div>
      <h2>Live Study Status</h2>

      <button onClick={() => sendStatus(username, "STUDYING")}>
        Start Studying
      </button>

      <button onClick={() => sendStatus(username, "OFFLINE")}>
        Stop
      </button>

      <ul>
        {statuses.map((s, idx) => (
          <li key={idx}>
            <strong>{s.username}</strong> — {s.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
