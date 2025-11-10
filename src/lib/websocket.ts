type WebSocketMessage = {
  type: "file_status";
  data: {
    file_id: string;
    status: "processing" | "completed" | "failed";
    progress?: number;
    error?: string;
  };
};

type WebSocketCallback = (message: WebSocketMessage) => void;

const BASE_SOCKET_URL = "wss://zapchecker.bigdates.com.br/ws";

class WebSocketService {
  isConnected() {
    throw new Error("Method not implemented.");
  }
  disconnect() {
    throw new Error("Method not implemented.");
  }
  private socket: WebSocket | null = null;
  private callbacks: Map<string, Set<WebSocketCallback>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.connect();
  }

  private connect() {
    try {
      this.socket = new WebSocket(BASE_SOCKET_URL);

      this.socket.onopen = () => {
        this.reconnectAttempts = 0;
      };

      this.socket.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error("❌ Erro ao parsear mensagem:", error);
        }
      };

      this.socket.onerror = (error) => {
        console.error("❌ Erro no WebSocket:", error);
      };

      this.socket.onclose = () => {
        this.attemptReconnect();
      };
    } catch (error) {
      this.attemptReconnect();
    }
  }

  private handleMessage(message: WebSocketMessage) {
    if (message.type !== "file_status") return;

    const fileId = message.data.file_id;

    const callbacks = this.callbacks.get(fileId);
    if (callbacks) {
      callbacks.forEach((callback) => callback(message));
    }

    const globalCallbacks = this.callbacks.get("*");
    if (globalCallbacks) {
      globalCallbacks.forEach((callback) => callback(message));
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      return;
    }

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    this.reconnectAttempts++;

    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  public subscribe(fileId: string, callback: WebSocketCallback): () => void {
    if (!this.callbacks.has(fileId)) {
      this.callbacks.set(fileId, new Set());
    }

    this.callbacks.get(fileId)!.add(callback);

    return () => {
      const callbacks = this.callbacks.get(fileId);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.callbacks.delete(fileId);
        }
      }
    };
  }

  public close() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    this.callbacks.clear();
  }
}

export const websocketService = new WebSocketService();
