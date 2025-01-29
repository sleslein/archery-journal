import { html } from "@hono/hono/html";
import { ArcherySession } from "../../../app/ArcherySession.ts";
import { EditDialog } from "./editArrowDialog.ts";
import { arrowListCalculationResult } from "./calcResult.ts";


export interface SessionFormProps {
  pageTitle: string;
  session?: ArcherySession;
}

export function sessionForm({ pageTitle, session}: SessionFormProps) {
  return html`
      <h1>${pageTitle}</h1>
      <form method="post" class="table rows">
      <input type="hidden" name="id" id="id" value='${session?.id}' />
      <p><label for="date">Date</label><input name="date" type="date" value="${session?.date}" /></p>
      <p>
        <label for="distance">Distance</label>
        <select name='distance'>
          <option value="">--</option>
          <option value="20" ${session?.distance === '20' ? 'selected' : ''}>20 yards</option>
          <option value="30" ${session?.distance === '30' ? 'selected' : ''}>30 yards</option>
        </select>
      </p>
      <div> 
        <label for="arrowInput">Encoded Arrow</label>
        <input 
          id='arrowInput' 
          name="arrowInput" 
          type="text" 
        />
        <button type="button" onclick='handleArrowAdd()'>Add</button>
      </div>
      <input type="hidden"
        name="arrows" 
        id="arrows" 
        value='${session?.arrows.map((arrow) => arrow[1].encodedValue).join(' ')}'
      />
      <div>
        <button type="submit">Save</button>
        <a style="display: inline-flex" class="<button>" href="/list">Cancel</a>
      </div>
      </form>
        <h2>Details</h2>
        <div id="details">
          ${arrowListCalculationResult(session)}
        </div>
      ${EditDialog()}
      <script src='/static/js/client-new.js'>
      </script>
    `;
}