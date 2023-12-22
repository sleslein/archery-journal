import { ArcherySession } from "../app/ArcherySession.ts";

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
