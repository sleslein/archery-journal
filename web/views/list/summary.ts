import { html } from "@hono/hono/html";
import { ArcherySession } from "../../../app/ArcherySession.ts";

export function Summary(sessions: ArcherySession[]) {
  return html`
    <p>
      total sessions: ${sessions.length}
      <a href="/new">New Session</a>
    </p>
  `;
}
