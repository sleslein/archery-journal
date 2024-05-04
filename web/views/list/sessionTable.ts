import { html } from "https://deno.land/x/hono@v4.0.9/helper.ts";
import { ArcherySession } from "../../../app/ArcherySession.ts";
import {
ArcherySessionFilterParams,
  ArcherySessionSortParams,
  SortType,
} from "../../../app/SessionList.ts";

export function TableHeader(sortParams: ArcherySessionSortParams, filterParams: ArcherySessionFilterParams) {
  function buildSortParams(field: SortType) {
    return `sortBy=${field}${
      (sortParams.type === field && sortParams.direction === "asc")
        ? "&sortDirection=desc"
        : ""
    }${filterParams.distance ? `&distance=${filterParams.distance}` : ''}`;
  }
  return html`
    <tr>
      <td>
        <a href='?${buildSortParams("date")}'>Date</a>
      </td>
      <td>
        <a href='?${buildSortParams("distance")}'>Distance</a>
      </td>
      <td>
        <a href='?${buildSortParams("avg")}'>Average</a>
      </td>
      <td>
        <a href='?${buildSortParams("tens")}'>10s</a>
      </td>
      <td>
        <a href='?${buildSortParams("misses")}'>0s</a>
      </td>
      <td>
        <a href='?${buildSortParams("invalid")}'>invalid</a>
      </td>
    </tr>`;
}

export function TableRow(session: ArcherySession) {
  return html`
    <tr>
      <td>${session.date}</td>
      <td>${session.distance}</td>
      <td>${session.stats.avg.toFixed(2)}</td>
      <td>${session.stats.tens}</td>
      <td>${session.stats.misses}</td>
      <td>${session.stats.invalidEntries.join(", ")}</td>
    </tr>
    `;
}
