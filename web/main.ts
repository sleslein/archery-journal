import { Hono } from "https://deno.land/x/hono@v4.0.9/mod.ts";
import { serveStatic } from "https://deno.land/x/hono@v4.0.9/middleware.ts";
import list from "./routes/list.ts";

const app = new Hono();

app.use("/static/*", serveStatic({ root: "./" }));

app.route("/", list);
app.route("/list", list);

Deno.serve(app.fetch);
