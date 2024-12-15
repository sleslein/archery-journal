import { html } from "@hono/hono/html";
import { ArcherySession } from "../../../app/ArcherySession.ts";
import {
  ArcherySessionFilterParams,
  ArcherySessionSortParams,
  SortType,
} from "../../../app/SessionList.ts";

export function Table(
  sessions: ArcherySession[],
  sortParams: ArcherySessionSortParams,
  filterParams: ArcherySessionFilterParams,
) {
  return html`
      <table>
      ${TableHeader(sortParams, filterParams)}
      ${
    sessions.map((session) => {
      return TableRow(session, sortParams, filterParams);
    })
  }
    </table>`;
}

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
        Action
      </th>
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

function buildSortByQuery(sortParams: ArcherySessionSortParams | undefined) {
  if (sortParams === undefined) {
    return "";
  }

  return `sortBy=${sortParams.type}&sortDirection=${sortParams.direction}`;
}

function buildFilterQuery(
  filterParams: ArcherySessionFilterParams | undefined,
) {
  if (filterParams === undefined) {
    return "";
  }

  return `distance=${filterParams.distance}`;
}

export function TableRow(
  session: ArcherySession,
  sortParams: ArcherySessionSortParams | undefined,
  filterParams: ArcherySessionFilterParams | undefined,
) {
  const sortQuery = buildSortByQuery(sortParams);
  const filterQuery = buildFilterQuery(filterParams);

  let query = "";
  if (sortQuery && filterQuery) {
    query = `?${sortQuery}&${filterQuery}`;
  } else if (sortQuery) {
    query = `?${sortQuery}`;
  } else if (filterQuery) {
    query = `?${filterQuery}`;
  }

  return html`
    <tr>
      <td>
        <button 
          hx-delete="/delete/${session.id}${query}"
          hx-swap="innerHTML swap:1s"
          hx-target="#sessions"
          hx-confirm="Are you sure you want to delete this session?"
          class="iconButton"
        >
          <img src="/static/icons/icon-trash.svg" style={height:100%} />
        </button>
      </td>
      <td>${session.date}</td>
      <td>${session.distance}</td>
      <td>${session.stats.avg.toFixed(2)}</td>
      <td>${session.stats.tens}</td>
      <td>${session.stats.misses}</td>
      <td>${session.stats.invalidEntries.join(", ")}</td>
    </tr>
    `;
}
