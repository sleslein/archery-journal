import { Hono } from "https://deno.land/x/hono@v4.0.9/mod.ts";
import { Layout } from "../views/Layout.ts";
import { SiteData } from "../views/Layout.ts";
import { html } from "https://deno.land/x/hono@v4.0.9/helper.ts";
import {
  ArcherySession,
  SessionStats,
  TargetSessionStats,
} from "../../app/ArcherySession.ts";
import { DecodedArrow, DecodedDirection } from "../../app/arrow-value.ts";
import { SaveSession } from "../SessionData.ts";

const app = new Hono();

const siteData: SiteData = {
  title: "My Archery Jounal",
  description: "List Page",
};

app.get("/", async (context) => {
  return await context.html(Layout({
    ...siteData,
    children: html`
      <h1>New Session</h1>
      <form method="post" action="new" class="table rows">
      <p><label for="date">Date</label><input name="date" type="date" /></p>
      <p>
        <label for="distance">Distance</label>
        <select name='distance'>
          <option value="">--</option>
          <option value="20">20 yards</option>
          <option value="30">30 yards</option>
        </select>
      </p>
      <p> 
        <label for="arrowInput">Encoded Arrow</label>
        <input 
          id='arrowInput' 
          name="arrowInput" 
          type="text" 
        />
        <button type="button" onclick='handleArrowAdd()'>Add</button>
      </p>
      <input type="hidden"
        name="arrows" 
        id="arrows" 
        hx-get="/new/calc"
        hx-trigger="change"
        hx-target="#details"
      />
      <p><button type="submit">Save</button></p>
      </form>
      <section>

        <h2>Details</h2>
        <div id="details">
          <ul id='arrowList'></ul>
          <div>
            <span>Total Arrows: </span>
            <span id="totalArrows">
          </div>
          <div>
            <span>Average: </span>
            <span id="statsAvg">
          </div>
        </div>
      </section>
      ${EditDialog()}
      <script src='/static/js/client-new.js'>
      </script>
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
  SaveSession(session);

  return context.redirect("/list", 303);
});

export default app;
