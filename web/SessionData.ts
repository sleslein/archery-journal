import { ArcherySession } from "../app/ArcherySession.ts";
import { SessionList } from "../app/SessionList.ts";

let sessionList: SessionList | undefined = undefined;
const fileLocation = "../arch-jrnl.txt";

export async function LoadSessionListFromFile() {
  if (sessionList === undefined) {
    sessionList = await SessionList.loadFromFile(fileLocation);
  }
  return sessionList;  
}

export async function SaveSession(session: ArcherySession) {
  if(sessionList === undefined) {
    sessionList = await LoadSessionListFromFile();
  }
  sessionList.sessions.push(session);

  sessionList.saveToFile(fileLocation);
}