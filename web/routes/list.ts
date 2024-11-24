import { Hono } from "https://deno.land/x/hono@v4.0.9/mod.ts";
import { Layout } from "../views/Layout.ts";
import { SiteData } from "../views/Layout.ts";
import { html } from "https://deno.land/x/hono@v4.0.9/helper.ts";
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
import { LoadSessionListFromFile } from "../SessionData.ts";

const app = new Hono();

app.get("/", async (context) => {
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

  const sessionList = await LoadSessionListFromFile();

  const { distance: queryDistance } = context.req.query();
  let distance: string | undefined = queryDistance;
  if (queryDistance !== undefined && queryDistance.trim() === "") {
    distance = undefined;
  }
  const filterParams: ArcherySessionFilterParams = { distance };
  let sessions = sessionList.filter(filterParams);

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
