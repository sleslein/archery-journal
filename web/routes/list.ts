import { Hono } from "https://deno.land/x/hono@v4.0.9/mod.ts";
import { Layout } from "../views/Layout.ts";
import { SiteData } from "../views/Layout.ts";
import { html } from "https://deno.land/x/hono@v4.0.9/helper.ts";
import {
  ArcherySessionSortParams,
  SessionList,
  SortDirection,
  SortDirections,
  SortType,
  SortTypes,
} from "../../app/SessionList.ts";
import { TableHeader, TableRow } from "../views/list/sessionTable.ts";

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
  const sessionList = await SessionList.loadFromFile("../arch-jrnl.txt");
  const siteData: SiteData = {
    title: "My Archery Jounal",
    description: "List Page",
  };

  const sortParams = convertQueryToSortParams();

  const sessions = SessionList.sort(sessionList.sessions, sortParams);

  return context.html(Layout({
    ...siteData,
    children: html`
    <h1>My Archery List</h1>
    total sessions: ${sessions.length}
    <table>
      ${TableHeader(sortParams)}
      ${
      sessions.map((session) => {
        return TableRow(session);
      })
    }
    </table>`,
  }));
});

export default app;
