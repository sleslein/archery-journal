import { ArcherySession } from "./ArcherySession.ts";

export interface ArcherySessionFilterParams {
  distance?: string;
}

export class SessionList {
  sessions: ArcherySession[];
  filter(params: ArcherySessionFilterParams): ArcherySession[] {
    return this.sessions.filter((session) => {
      let include = true;
      if (params.distance !== undefined) {
        include = session.distance === params.distance;
      }
      return include;
    });
  }

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

  async saveToFile() {
    // copy/rename old file
    Deno.renameSync(
      "./arch-jrnl.txt",
      `./arch-jrnl.txt-${new Date().toISOString()}`,
    );

    // generate new string with all sessions
    const output = this.sessions.reduce(
      (prev: string, current: ArcherySession) => {
        return prev.concat(
          ArcherySession.encodeSession({
            date: current.date,
            distance: current.distance,
            arrows: current.arrows.map((x) => x[1].encodedValue),
          }),
        ).concat("\n");
      },
      "",
    );
    // save to new file
    await Deno.writeTextFile("arch-jrnl.txt", output);
  }
}
