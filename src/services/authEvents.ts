
// Sistema de eventos para comunicação entre API e AuthContext
class AuthEventEmitter {
  private listeners: { [key: string]: (() => void)[] } = {};

  on(event: string, listener: () => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  off(event: string, listener: () => void) {
    if (!this.listeners[event]) return;
    const index = this.listeners[event].indexOf(listener);
    if (index > -1) {
      this.listeners[event].splice(index, 1);
    }
  }

  emit(event: string) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(listener => listener());
  }
}

export const authEvents = new AuthEventEmitter();
