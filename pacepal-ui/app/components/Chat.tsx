"use client";

import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface ChatMessage {
    sender: string;
    content: string;
}

export default function Chat({ username }: { username: string }) {
    const [client, setClient] = useState<Client | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [text, setText] = useState("");

    useEffect(() => {
        console.log("Chat component mounted");

        const sock = new SockJS("http://localhost:8080/ws");

        const stompClient = new Client({
            webSocketFactory: () => sock as any,
            reconnectDelay: 3000
        });

        stompClient.onConnect = () => {
            console.log("CONNECTED TO SOCKET");

            stompClient.subscribe("/topic/chat", (msg) => {
                const body = JSON.parse(msg.body);
                setMessages((prev) => [...prev, body]);
            });
        };

        stompClient.onStompError = (frame) => {
            console.error("Broker error:", frame.headers["message"]);
        };

        stompClient.activate();
        setClient(stompClient);

        return () => {
            stompClient.deactivate();
        };
    }, []);

    const sendMessage = () => {
        if (!client || !text.trim()) return;

        client.publish({
            destination: "/app/chat",
            body: JSON.stringify({
                sender: username,
                content: text
            })
        });

        setText("");
    };

    return (
        <div>
            <h3>Chat</h3>

            <div
                style={{
                    border: "1px solid #ccc",
                    height: 200,
                    overflowY: "auto",
                    marginBottom: 10
                }}
            >
                {messages.map((m, i) => (
                    <p key={i}>
                        <strong>{m.sender}: </strong> {m.content}
                    </p>
                ))}
            </div>

            <input value={text} onChange={(e) => setText(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}
