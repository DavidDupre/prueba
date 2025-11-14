import { Client, Frame } from "@stomp/stompjs";
import { toast } from "src/helpers/toast";
import { sgdeaAxios } from ".";

class AssignmentWebSocketService {
  private client: Client;

  constructor() {
    this.client = new Client({
      brokerURL: process.env.WEB_SOCKET,
      // debug: (str: string) => {
      //
      // },

      onStompError: (frame: Frame) => {
        toast.error("Error de conexión con el servidor WebSocket");
      },

      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
    });

    this.setupWebSocket();
  }

  private setupWebSocket(): void {
    this.client.onConnect = (frame: Frame) => {
      this.client.subscribe("/topic/estado", (message) => {
        const data: string = message.body;
      });
    };

    this.client.onWebSocketClose = (event: CloseEvent) => {
      console.warn("WebSocket cerrado:", event);
      toast.error("Conexión WebSocket cerrada inesperadamente");

      setTimeout(() => this.client.activate(), 5000);
    };

    this.client.activate();
  }

  private async startAlertTimer(id: string): Promise<void> {
    setTimeout(async () => {
      try {
        const { data } = await sgdeaAxios.get(`/medicina/casos/${id}`);
        if (data.estado.estado === "Por asignar") {
          toast.warning(`El tiempo de asignación del radicado ${id} ha expirado`);
          // Redirección
          setTimeout(() => {
            window.location.href = '/bandeja';
          }, 10000);
        }
      } catch (error) {
        toast.error("Ocurrió un problema al obtener el caso.");
      }
    }, 910000); // 15 minutos
  }

  public startAssignmentTimer(id: string): void {
    this.client.publish({
      destination: "/appws/estadoRadicado",
      body: id,
    });

    this.startAlertTimer(id);
  }

  public disconnect(): void {
    if (this.client) {
      this.client.deactivate();
    }
  }
}

export const assignmentWebSocket = new AssignmentWebSocketService();
