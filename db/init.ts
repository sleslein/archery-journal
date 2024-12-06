export const createSessionTable = `
  CREATE TABLE archery_session (
    session_id INTEGER PRIMARY KEY,
    date TEXT,
    distance INTEGER,
    arrows TEXT
  )
`;
