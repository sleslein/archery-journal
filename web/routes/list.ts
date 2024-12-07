import { Hono } from "@hono/hono";
import { Layout } from "../views/Layout.ts";
import { SiteData } from "../views/Layout.ts";
import { html } from "@hono/hono/html";
import {
  ArcherySessionFilterParams,
  ArcherySessionSortParams,
  SessionList,
  SortDirection,
  SortDirections,
  SortType,
  SortTypes,
} from "../../app/SessionList.ts";
import { TableHeader, TableRow } from "../views/list/sessionTable.ts";
import { createRepository } from "@repository";

const app = new Hono();
const repository = createRepository();

app.get("/", (context) => {
  function convertQueryToSortParams(): ArcherySessionSortParams {
    const { sortBy, sortDirection } = context.req.query();

    const type: SortType = SortTypes.includes(sortBy as SortType)
      ? sortBy as SortType
      : "date";
    const direction: SortDirection =
      SortDirections.includes(sortDirection as SortDirection)
        ? sortDirection as SortDirection
        : "asc";
    return {
      type,
      direction,
    };
  }
  const siteData: SiteData = {
    title: "My Archery Jounal",
    description: "List Page",
  };

  const sessionList = repository.readAll();

  const { distance: queryDistance } = context.req.query();
  let distance: string | undefined = queryDistance;
  if (queryDistance !== undefined && queryDistance.trim() === "") {
    distance = undefined;
  }
  const filterParams: ArcherySessionFilterParams = { distance };
  let sessions = SessionList.filter(sessionList, filterParams);

  const sortParams = convertQueryToSortParams();
  sessions = SessionList.sort(sessions, sortParams);

  return context.html(Layout({
    ...siteData,
    children: html`
    <h1>My Archery List</h1>
    <form action="list" class="f-row align-items:center">
      <label for="distance"> Distance: </label>
      <select name='distance'>
        <option value="">--</option>
        <option value="20" ${distance === "20" && "selected"}>20 yards</option>
        <option value="30" ${distance === "30" && "selected"}>30 yards</option>
      </select>
      <button>Filter</button>
    </form>
    <p>
      total sessions: ${sessions.length}
      <a href="/new">New Session</a>
    </p>
    <table>
      ${TableHeader(sortParams, filterParams)}
      ${
      sessions.map((session) => {
        return TableRow(session);
      })
    }
    </table>`,
  }));
});

export default app;
