'use client'; 
import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8080/api/auth/register", {
        username,
        password
      });

      setMessage("Account created successfully 🎉");
      setUsername("");
      setPassword("");
    } catch (err: any) {
      setMessage(err?.response?.data || "Something went wrong");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Create account</h2>

      <form onSubmit={handleRegister}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Register</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
