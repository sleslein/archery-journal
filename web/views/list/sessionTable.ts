import { html } from "@hono/hono/html";
import { ArcherySession } from "../../../app/ArcherySession.ts";
import {
  ArcherySessionFilterParams,
  ArcherySessionSortParams,
  SortType,
} from "../../../app/SessionList.ts";

export function TableHeader(
  sortParams: ArcherySessionSortParams,
  filterParams: ArcherySessionFilterParams,
) {
  function buildSortParams(field: SortType) {
    return `sortBy=${field}${
      (sortParams.type === field && sortParams.direction === "asc")
        ? "&sortDirection=desc"
        : ""
    }${filterParams.distance ? `&distance=${filterParams.distance}` : ""}`;
  }
  return html`
    <thead>
    <tr>
      <th>
        <a href='?${buildSortParams("date")}'>Date</a>
      </th>
      <th>
        <a href='?${buildSortParams("distance")}'>Distance</a>
      </th>
      <th>
        <a href='?${buildSortParams("avg")}'>Average</a>
      </th>
      <th>
        <a href='?${buildSortParams("tens")}'>10s</a>
      </th>
      <th>
        <a href='?${buildSortParams("misses")}'>0s</a>
      </td>
      <th>
        <a href='?${buildSortParams("invalid")}'>invalid</a>
      </th>
    </tr>
    </thead>`;
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
