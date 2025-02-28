import { html } from "@hono/hono/html";

export function EditDialog() {
  return html`<dialog id='edit-dialog' >
      <input id='edit-arrow-index' type="hidden" />
      <input id="edit-arrow" type="input" />
      <button onClick="editArrow()">Update</button>
    </dialog>`;
}
