import { ArcherySession } from "./ArcherySession.ts";

export class SessionList {
  sessions: ArcherySession[];

  constructor(encodedSessions: string) {
    const lines = encodedSessions.split("\n").filter((x) => x !== "");
    this.sessions = lines.map((line) => {
      return new ArcherySession(line);
    });
  }

  static async loadFromFile(): Promise<SessionList> {
    const data = await Deno.readTextFile("./arch-jrnl.txt");
    return new SessionList(data);
  }
}
