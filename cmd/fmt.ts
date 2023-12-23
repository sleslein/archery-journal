import { ArcherySession } from "../app/ArcherySession.ts";
import { SessionList } from "../app/SessionList.ts";

export function fmtSessionDetails(session: ArcherySession) {
  return `
date: ${session.date}
distance: ${session.distance}
total shots: ${session.stats.totalArrows}
avg: ${session.stats.avg.toFixed(2)}
10: ${session.stats.tens}
0: ${session.stats.misses}
invalid entries: ${session.stats.invalidEntries.join(" ")}\n`;
}

export function fmtSessionList(list: SessionList) {
  const header = `
idx date       dist avg  invalid 
--- ---------- ---- ---- -------------------
`;

  const listDetails: string[] = [];

  list.sessions.forEach((session, idx) => {
    const invalidEntries: string[] = [];
    session.arrows.forEach((arrow, arrowIdx) => {
      const [isValid, encodedArrow] = arrow;
      if (!isValid) {
        invalidEntries.push(`${arrowIdx}:${encodedArrow.encodedValue}`);
      }
    });

    listDetails.push(
      `${idx.toString().padStart(3)} ${session.date} ${
        session.distance.padEnd(4)
      } ${session.stats.avg.toFixed(2)} ${invalidEntries.join(" ")}`,
    );
  });

  return `${header}\n${listDetails.join("\n")}\n\n`;
}
