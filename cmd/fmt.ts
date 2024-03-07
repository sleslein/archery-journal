import { ArcherySession, TargetSessionStats } from "../app/ArcherySession.ts";
import { SessionList } from "../app/SessionList.ts";
import { DecodedDirection } from "../app/arrow-value.ts";

function fmtField(
  label: string,
  val: string | number,
  totalLen: number,
): string {
  return `${label}: ${val}`.padEnd(totalLen);
}

function fmtTargetPlacements(
  targetPlacements: Map<DecodedDirection, TargetSessionStats>,
): string {
  const targetNameLen = 14; // max length of Decoded Direction
  let result = `
Target         | Total | Pts  | Avg  | 10 | 0 
-------------- | ----- | ---- | ---- | -- | --
`;

  targetPlacements.forEach((value, key) => {
    result = result.concat(
      key.padEnd(targetNameLen),
      " | ",
      value.totalArrows.toString().padEnd(5),
      " | ",
      value.totalPoints.toString().padEnd(4),
      " | ",
      value.avg.toFixed(2),
      " | ",
      value.tens.toString().padEnd(2),
      " | ",
      value.misses.toString().padEnd(2),
      "\n",
    );
  });
  return result;
}

export function fmtSessionDetails(session: ArcherySession) {
  const byTarget = fmtTargetPlacements(session.stats.scoreByTarget);
  return `
Session Info
${fmtField("Date", session.date, 20)} ${
    fmtField("Distance", session.distance, 20)
  }
Invalid Entries: ${session.stats.invalidEntries.join(" ")}

Session Summary
${fmtField("Total Shots", session.stats.totalArrows, 20)} ${
    fmtField("Avg", session.stats.avg.toFixed(2), 20)
  }
10: ${session.stats.tens}
0: ${session.stats.misses}

Summary By Target Placement ${byTarget}
`;
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
