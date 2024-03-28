import { ArcherySession } from "./ArcherySession.ts";

export interface ArcherySessionFilterParams {
  distance?: string;
}

export interface ArcherySessionSortParams {
  type: SortType;
  direction: SortDirection;
}

export const SortTypes = [
  "date",
  "distance",
  "avg",
  "tens",
  "misses",
  "distance",
  "invalid",
] as const;
export type SortType = typeof SortTypes[number];

export const SortDirections = ["asc", "desc"] as const;
export type SortDirection = typeof SortDirections[number];

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

  static async loadFromFile(
    fileLocation = "./arch-jrnl.txt",
  ): Promise<SessionList> {
    const data = await Deno.readTextFile(fileLocation);
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

  static sort(
    list: ArcherySession[],
    sortParams: ArcherySessionSortParams,
  ): ArcherySession[] {
    function sortByDate(a: ArcherySession, b: ArcherySession) {
      if (a.date === b.date) return 0;

      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      if (sortParams.direction === "asc") {
        return aDate < bDate ? -1 : 1;
      }

      return aDate > bDate ? -1 : 1;
    }

    function sortByDistance(a: ArcherySession, b: ArcherySession) {
      if (a.distance === b.distance) return 0;

      const aDist = parseInt(a.distance);
      const bDist = parseInt(b.distance);
      if (sortParams.direction === "asc") {
        return aDist < bDist ? -1 : 1;
      }

      return aDist > bDist ? -1 : 1;
    }

    type StatType = "avg" | "tens" | "misses";

    function sortByStats(type: StatType) {
      return (a: ArcherySession, b: ArcherySession) => {
        const aVal = a.stats[type];
        const bVal = b.stats[type];
        if (aVal === bVal) return 0;

        if (sortParams.direction === "asc") {
          return aVal < bVal ? -1 : 1;
        }

        return aVal > bVal ? -1 : 1;
      };
    }

    function sortByInvalidEntries(a: ArcherySession, b: ArcherySession) {
      const aInvalid = a.stats.invalidEntries.length;
      const bInvalid = b.stats.invalidEntries.length;
      if (sortParams.direction === "asc") {
        return aInvalid > bInvalid ? -1 : 1;
      }

      return aInvalid < bInvalid ? -1 : 1;
    }

    switch (sortParams.type) {
      case "date":
        return list.sort(sortByDate);
      case "distance":
        return list.sort(sortByDistance);
      case "avg":
      case "tens":
      case "misses":
        return list.sort(sortByStats(sortParams.type));
      case "invalid":
        return list.sort(sortByInvalidEntries);
      default:
        return list;
    }
  }
}
