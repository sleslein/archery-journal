import { Hono } from "@hono/hono";
import { Layout } from "../views/Layout.ts";
import { SiteData } from "../views/Layout.ts";
import { html } from "@hono/hono/html";
import { SessionList } from "../../app/SessionList.ts";
import { Table } from "../views/list/sessionTable.ts";
import { createRepository } from "@repository";
import { Summary } from "../views/list/summary.ts";
import {
  convertQueryToFilterParams,
  convertQueryToSortParams,
} from "../helpers/sessionListHelpers.ts";

const app = new Hono();
const repository = createRepository();

app.get("/", (context) => {
  const siteData: SiteData = {
    title: "My Archery Jounal",
    description: "List Page",
  };
  const sessionList = repository.readAll();

  const filterParams = convertQueryToFilterParams(context.req.query());
  let sessions = SessionList.filter(sessionList, filterParams);

  const sortParams = convertQueryToSortParams(context.req.query());
  sessions = SessionList.sort(sessions, sortParams);

  return context.html(Layout({
    ...siteData,
    children: html`
    <h1>My Archery List</h1>
    <form action="list" class="f-row align-items:center">
      <label for="distance"> Distance: </label>
      <select name='distance'>
        <option value="">--</option>
        <option value="20" ${
      filterParams.distance === "20" && "selected"
    }>20 yards</option>
        <option value="30" ${
      filterParams.distance === "30" && "selected"
    }>30 yards</option>
      </select>
      <button>Filter</button>
    </form>
    <div id="sessions">
    ${Summary(sessions)}
    ${Table(sessions, sortParams, filterParams)}
    </div>
    `,
  }));
});

export default app;
