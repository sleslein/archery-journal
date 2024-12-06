import { SessionList } from "../../../app/SessionList.ts";
import { createRepository } from "../../repository.ts";

const sessionsList = await SessionList.loadFromFile("./arch-jrnl.txt");
const repository = createRepository();

for (const session of sessionsList.sessions) {
  repository.create(session);
}
