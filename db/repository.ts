import { Database } from "@db/sqlite";
import { SessionDetails } from "../app/ArcherySession.ts";
import { ArcherySession } from "../app/ArcherySession.ts";
import { DecodedArrow } from "../app/arrow-value.ts";

function createDb() {
  const db = new Database(new URL("./test.db", import.meta.url));
  return db;
}

type SessionRepository = {
  create(session: SessionDetails): void;
  readAll(): ArcherySession[];
  getSessionById(id: number): ArcherySession;
  update(session: SessionDetails): void;
  delete(id: number): void;
};

export function createRepository() {
  const repository: SessionRepository = {
    create: createSession,
    readAll: readSessions,
    getSessionById,
    update,
    delete: deleteSession,
  };

  return repository;
}

// export function checkDbVer() {
//   const db = createDb();
//   const [version] = db.prepare("select sqlite_version()").value<[string]>()!;
//   console.log(version);

//   db.close();
// }

// export function initDb() {

//   const db = createDb();
//   const statement = db.exec(createSessionTable);
//   console.log(JSON.stringify(statement));
//   db.close();
//   return;
// }
type ArcherySessionDBModel = {
  session_id: number;
  date: string;
  distance: string | undefined;
  arrows: string;
};

export function createSession(session: SessionDetails) {
  const arrows = session.arrows.map((arrow) => {
    const [_, encodedArrow] = arrow;
    return encodedArrow.encodedValue;
  });
  const dbModel: Omit<ArcherySessionDBModel, "session_id"> = {
    date: session.date,
    distance: session.distance,
    arrows: arrows.join(" "),
  };
  const db = createDb();
  const _ = db.exec(
    `
    insert into archery_session 
      (date, distance, arrows) 
      values (:date, :distance, :arrows);
    `,
    dbModel,
  );

  db.close();
  return;
}

export function readSessions() {
  const db = createDb();
  const statement = db.prepare(`select * from archery_session;`);
  const data = statement.all<ArcherySessionDBModel>();
  const sessions = data.map((item) => {
    // TODO: update constructor to take params
    const s = new ArcherySession(
      `${item.date} ${item.distance} ${item.arrows}`,
    );
    s.id = item.session_id;
    return s;
  });

  return sessions;
}

export function getSessionById(id: number) {
  const db = createDb();
  const data = db.sql<
    ArcherySessionDBModel
  >`select * from archery_session where session_id=${id}`[0];
  const session = new ArcherySession(
    `${data.date} ${data.distance} ${data.arrows}`,
  );
  session.id = data.session_id;
  return session;
}

function update(session: SessionDetails) {
  const arrows = convertArrowsToStringArray(session.arrows);
  const db = createDb();
  db.sql`
    update archery_session 
    set date = ${session.date},
        distance = ${session.distance},
        arrows = ${arrows.join(" ")}
    where session_id = ${session.id};
    `;

  db.close();

  return;
}

function deleteSession(id: number) {
  const db = createDb();
  db.sql`delete from archery_session where session_id = ${id} `;
  db.close();
}

function convertArrowsToStringArray(arr: [boolean, DecodedArrow][]) {
  return arr.map((arrow) => {
    const [_, encodedArrow] = arrow;
    return encodedArrow.encodedValue;
  });
}
