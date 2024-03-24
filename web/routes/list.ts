import { Hono } from "https://deno.land/x/hono@v4.0.9/mod.ts";
import { Layout } from "../views/Layout.ts";
import { SiteData } from "../views/Layout.ts";
import { html } from "https://deno.land/x/hono@v4.0.9/helper.ts";
import { SessionList } from "../../app/SessionList.ts";

const app = new Hono();

app.get("/", async (context) => {
  const sessionList = await SessionList.loadFromFile('../arch-jrnl.txt');
  const siteData: SiteData = {
    title: "My Archery Jounal",
    description: "List Page",
  };
  return context.html(Layout({
    ...siteData,
    children: html`
    <h1>My Archery List</h1>
    total sessions: ${sessionList.sessions.length}
    <table>
        <tr>
            <td>Date</td>
            <td>Distance</td>
            <td>Average</td>
            <td>10s</td>
            <td>0s</td>
            <td>invalid</td>
        </tr> 
        ${sessionList.sessions.map((session) => {
          return html`
          <tr>
            <td>${session.date}</td>
            <td>${session.distance}</td>
            <td>${session.stats.avg.toFixed(2)}</td>
            <td>${session.stats.tens}</td>
            <td>${session.stats.misses}</td>
            <td>${session.stats.invalidEntries}</td>
          </tr>
          `
        })
        }
    </table>`,
  }));
});

export default app;
