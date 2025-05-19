import type { User } from "./User";

export class RoomManager {
  rooms: Map<string, User[]> = new Map();

  static instance: RoomManager | null; // Singleton pattern

  private constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new RoomManager();
    }
    return this.instance;
  }

  public addUser(spaceId: string, user: User) {
    if (!this.rooms.has(spaceId)) {
      this.rooms.set(spaceId, [user]);
      return;
    }

    this.rooms.set(spaceId, [...(this.rooms.get(spaceId) ?? []), user]);
  }

  public removeUser(user: User, spaceId: string) {
    if (!this.rooms.has(spaceId)) {
      user.ws.close();
      return;
    }
    const newRoom = this.rooms.get(spaceId)?.filter((u) => u.id !== user.id) ?? []
    this.rooms.set(spaceId, newRoom)
  }

  public broadcast(message: any, user: User, roomId: string) {
    if (this.rooms.has(roomId)) {
      return;
    }

    this.rooms.get(roomId)?.forEach((u) => {
      if (u.id !== user.id) {
        u.send(message);
      }
    });
  }
}
