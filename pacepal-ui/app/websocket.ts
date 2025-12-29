import SockJS from "sockjs-client";
import Stomp, { Client, Message } from "stompjs";

let stompClient: Client | null = null;

export interface StatusMessage {
  username: string;
  status: string;
}

export const connectSocket = (
  onStatusMessage: (msg: StatusMessage) => void
): void => {
  const socket = new SockJS("http://localhost:8080/ws");
  stompClient = Stomp.over(socket);

  stompClient.connect({}, () => {
    console.log("Connected to WebSocket");

    stompClient?.subscribe("/topic/status", (message: Message) => {
      const body: StatusMessage = JSON.parse(message.body);
      onStatusMessage(body);
    });
  });
};

export const sendStatus = (username: string, status: string): void => {
  if (!stompClient) return;

  const payload: StatusMessage = { username, status };

  stompClient.send("/app/status", {}, JSON.stringify(payload));
};
