import { html } from "@hono/hono/html";
import {
  ArcherySession,
  SessionStats,
  TargetSessionStats,
} from "../../../app/ArcherySession.ts";
import { DecodedArrow, DecodedDirection } from "../../../app/arrow-value.ts";

export function arrowListCalculationResult(
  session: ArcherySession | undefined,
) {
  const arrows = session?.arrows;

  console.log(`Session Stats:${JSON.stringify(session?.stats)}`);

  return html`
  <div class="f-switch">
    ${ArrowList(arrows)}
    ${StatsDisplay(session?.stats)}
  </div>`;
}

function StatsDisplay(stats: SessionStats | undefined) {
  const scoreByTargetHtml: {
    target: DecodedDirection;
    stats: TargetSessionStats;
  }[] = [];

  stats?.scoreByTarget.forEach((value, key) => {
    scoreByTargetHtml.push({ target: key, stats: value });
  });

  console.log(`Stat Count: ${scoreByTargetHtml.length}`);

  return html`
  <section>
  <h3>Summary</h3>
<table class="align-self:start">
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
      <td>${stats?.totalArrows ?? 0}</td>
      <td>${stats?.totalPoints ?? 0}</td>
      <td>${stats?.avg.toFixed(2) ?? 0}</td>
      <td>${stats?.tens ?? 0}</td>
      <td>${stats?.misses ?? 0}</td>
    </tr>
  </tfoot>
</table>
  </section>`;
}

function StatTableRow(target: DecodedDirection, stats: TargetSessionStats) {
  return html`
    <tr>
      <td>${target}</td>
      <td>${stats.totalArrows}</td>
      <td>${stats.totalPoints}</td>
      <td>${stats.avg.toFixed(2)}</td>
      <td>${stats.tens}</td>
      <td>${stats.misses}</td>
    </tr>`;
}

function ArrowList(arrows: Array<[boolean, DecodedArrow]> | undefined) {
  return html`
    <section>
    <h3>Arrows</h3>
    <ul>
    ${
    arrows?.map((decodedArrow, idx) => {
      return ArrowListItem(decodedArrow, idx);
    })
  }
  </ul>
  </section>`;
}

function ArrowListItem(decodedArrow: [boolean, DecodedArrow], idx: number) {
  const [isvalid, arrowVal] = decodedArrow;
  return html`<li${!isvalid ? ' class="bad color bg"' : ""}>
      ${arrowVal.encodedValue}
      <span role="button" class="<a> text-sm" data-arrow-index="${idx}" onClick="openEditDialog(${idx})">Edit</span>
    </li>`;
}
