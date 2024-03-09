// import { parse } from "https://deno.land/std@0.108.0/flags/mod.ts";
import { parseArgs } from "https://deno.land/std@0.219.0/cli/mod.ts";
import { tryDecodeArrowValue } from "../app/arrow-value.ts";
import { ArcherySession } from "../app/ArcherySession.ts";
import { SessionList } from "../app/SessionList.ts";
import { fmtSessionDetails, fmtSessionList } from "./fmt.ts";

const commands = ["decode", "record", "update", "get", "list"] as const;
type Command = typeof commands[number];

const args = parseArgs(Deno.args);
const cmd = args._[0] as Command;

if (!commands.includes(cmd)) {
  Deno.stdout.write(new TextEncoder().encode(`unknown command ${cmd}`));
  Deno.exit(1);
}

/**
 * Records a new session
 */
if (cmd === "record") {
  /** Desired cli interface
   * ~ record --distance --date [... arrows]
   * ~ record --distance 20 --date 2023-10-10 tm10br br9b bl8tr
   */
  const date = args.date;
  const distance = args.distance;
  const [_command, ...arrows] = args._;

  const encodedSession = ArcherySession.encodeSession({
    date,
    distance,
    arrows,
  });
  const session = new ArcherySession(encodedSession);
  session.save();

  Deno.stdout.write(
    new TextEncoder().encode(
      `Successfuly Recorded New Session\n${fmtSessionDetails(session)}`,
    ),
  );

  Deno.exit(0);
}

/**
 * Update existin session
 */
if (cmd === "update") {
  /**
   * update --id [4] --date [yyyy-mm-dd] --distance [20] ...[[idx:arrow]]
   * update --id 1 5:tr5tr 7:tr8bw
   */
  const sessionList = await SessionList.loadFromFile();
  const { date, distance, id } = args;

  if (!id) {
    Deno.stderr.write(
      new TextEncoder().encode(
        "ERROR: Unable to complete update: --id flag is required",
      ),
    );
    Deno.exit(1);
  }

  const session = sessionList.sessions[id];

  if (distance) {
    session.distance = distance;
  }

  if (date) {
    session.date = date;
  }

  const [_command, ...arrows] = args._;
  (arrows as string[]).forEach((arrowUpdate: string) => {
    const [idx, encodedValue] = arrowUpdate.split(":");
    session.updateArrow(parseInt(idx), encodedValue);
  });

  sessionList.saveToFile();

  Deno.stdout.write(
    new TextEncoder().encode(
      `Successfully updated session:\n\n ${fmtSessionDetails(session)}`,
    ),
  );

  Deno.exit(0);
}

/**
 * Lists all sessions with brief details
 */
if (cmd === "list") {
  const sessionList = await SessionList.loadFromFile();

  const filterParams = {
    distance: args.distance?.toString(),
  };
  let sessions = sessionList.filter(filterParams);
  if(args.last !== undefined){
    sessions = sessions.splice(-args.last);
  }
  const output = fmtSessionList(sessions);

  Deno.stdout.write(new TextEncoder().encode(output));

  Deno.exit(0);
}

/**
 * by default the get command returns the last session
 */
if (cmd === "get") {
  const sessionList = await SessionList.loadFromFile();

  const session = sessionList.sessions[sessionList.sessions.length - 1];

  Deno.stdout.write(
    new TextEncoder().encode(
      `Session Stats: ${fmtSessionDetails(session)}`,
    ),
  );

  Deno.exit(0);
}

/**
 * Parses a single encoded arrow
 */
if (cmd === "decode") {
  const encodedValue = args._[1] as string;
  const decodedValue = tryDecodeArrowValue(encodedValue);

  Deno.stdout.write(
    new TextEncoder().encode(`decoded arrow:${JSON.stringify(decodedValue)}`),
  );
  Deno.exit(0);
}

Deno.stdout.write(
  new TextEncoder().encode(`The ${cmd} command has not been implemented`),
);
Deno.exit(1);
