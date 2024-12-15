import { Hono } from "@hono/hono";
import { createRepository } from "@repository";
import { Summary } from "../views/list/summary.ts";
import { Table } from "../views/list/sessionTable.ts";
import { html } from "@hono/hono/html";
import { SessionList } from "../../app/SessionList.ts";
import {
  convertQueryToFilterParams,
  convertQueryToSortParams,
} from "../helpers/sessionListHelpers.ts";

const app = new Hono();
const repository = createRepository();

app.delete("/:session_id", (context) => {
  const { session_id } = context.req.param();

  if (session_id === undefined) {
    context.status(400);
    return context.body("session_id is required");
  }

  const id = Number.parseInt(session_id);
  if (typeof id !== "number") {
    context.status(400);
    return context.body("session_id must be a number");
  }

  repository.delete(id);
  const sessionList = repository.readAll();

  const filterParams = convertQueryToFilterParams(context.req.query());
  let sessions = SessionList.filter(sessionList, filterParams);

  const sortParams = convertQueryToSortParams(context.req.query());
  sessions = SessionList.sort(sessions, sortParams);

  context.status(200);
  const result = html`
    ${Summary(sessions)}
    ${Table(sessions, sortParams, filterParams)}
  `;
  return context.html(result);
});

export default app;
