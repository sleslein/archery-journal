import { Hono } from "@hono/hono";
import { Layout } from "../views/Layout.ts";
import { SiteData } from "../views/Layout.ts";
import { html } from "@hono/hono/html";
import {
  ArcherySession,
  SessionStats,
  TargetSessionStats,
} from "../../app/ArcherySession.ts";
import { DecodedArrow, DecodedDirection } from "../../app/arrow-value.ts";
import { createRepository } from "@repository";
import { sessionForm } from "../views/add-edit/form.ts";

const app = new Hono();
const respository = createRepository();

const siteData: SiteData = {
  title: "My Archery Jounal",
  description: "List Page",
};

app.get("/", async (context) => {
  return await context.html(Layout({
    ...siteData,
    children: html`
      ${sessionForm({ pageTitle: "New Session" })}
    `,
  }));
});

app.post("/calc", async (context) => {
  console.log(`calc/called`);
  const body = await context.req.parseBody();
  console.log(JSON.stringify(body["arrows"]));
  const inputArrows = body["arrows"].toString();

  const session = new ArcherySession(`9999-12-12 0 ${inputArrows}`);
  const arrows = session.arrows;

  console.log(`Session Stats:${JSON.stringify(session.stats)}`);

  const arrowListEl = ArrowList(arrows);
  return context.html(`
  <div class="f-switch">
    ${arrowListEl}
    ${StatsDisplay(session.stats)}
  </div>`);
});

function StatsDisplay(stats: SessionStats) {
  const scoreByTargetHtml: {
    target: DecodedDirection;
    stats: TargetSessionStats;
  }[] = [];

  stats.scoreByTarget.forEach((value, key) => {
    scoreByTargetHtml.push({ target: key, stats: value });
  });

  console.log(`Stat Count: ${scoreByTargetHtml.length}`);

  return html`
<table>
  <thead>
    <tr>
      <th>Target</th>
      <th>total</th>
      <th>points</th>
      <th>avg</th>
      <th>10s</th>
      <th>misses</th>
    </tr>
  </thead>
  <tbody>
    ${
    scoreByTargetHtml.map((item) => {
      return StatTableRow(item.target, item.stats);
    })
  }
  </tbody>
  <tfoot>
    <tr>
      <td>totals</td>
      <td>${stats.totalArrows}</td>
      <td>${stats.totalPoints}</td>
      <td>${stats.avg}</td>
      <td>${stats.tens}</td>
      <td>${stats.misses}</td>
    </tr>
  </tfoot>
</table>
  `;
}

function StatTableRow(target: DecodedDirection, stats: TargetSessionStats) {
  return html`
    <tr>
      <td>${target}</td>
      <td>${stats.totalArrows}</td>
      <td>${stats.totalPoints}</td>
      <td>${stats.avg}</td>
      <td>${stats.tens}</td>
      <td>${stats.misses}</td>
    </tr>`;
}

function ArrowList(arrows: Array<[boolean, DecodedArrow]>) {
  return `<ul>
    ${
    arrows.map((decodedArrow, idx) => {
      return ArrowListItem(decodedArrow, idx);
    }).join("")
  }
  </ul>`;
}

function ArrowListItem(decodedArrow: [boolean, DecodedArrow], idx: number) {
  const [isvalid, arrowVal] = decodedArrow;
  return `
    <li${!isvalid ? ' class="bad color bg"' : ""}>
      ${arrowVal.encodedValue}
      <span role="button" class="<a> text-sm" data-arrow-index="${idx}" onClick="openEditDialog(${idx})">Edit</span>
    </li>
  `;
}

function EditDialog() {
  return html`<dialog id='edit-dialog' >
      <input id='edit-arrow-index' type="hidden" />
      <input id="edit-arrow" type="input" />
      <button onClick="editArrow()">Update</button>
    </dialog>`;
}

app.post("/", async (context) => {
  const body = await context.req.parseBody();

  const requestSession = {
    date: body["date"].toString(),
    distance: body["distance"].toString(),
    arrows: [...body["arrows"].toString().split(" ")],
  };

  const encodedSession = ArcherySession.encodeSession(requestSession);
  const session = new ArcherySession(encodedSession);
  respository.create(session);

  return context.redirect("/list", 303);
});

export default app;
