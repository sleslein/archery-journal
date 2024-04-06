import { Hono } from "https://deno.land/x/hono@v4.0.9/mod.ts";
import { Layout } from "../views/Layout.ts";
import { SiteData } from "../views/Layout.ts";
import { html } from "https://deno.land/x/hono@v4.0.9/helper.ts";

const app = new Hono();

const siteData: SiteData = {
  title: "My Archery Jounal",
  description: "List Page",
};

app.get("/", async (context) => {

  return context.html(Layout({ ...siteData,
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
          <label for='arrows'>Arrows</label>
          <textarea name="arrows"></textarea>
        </p>
        <p><button type="submit">Save</button></p>
      </form>
    `
  }));
});

app.post('/', async (context) => {
  return context.redirect('/list', 303);
})

export default app;