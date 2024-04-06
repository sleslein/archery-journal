import { Hono } from "https://deno.land/x/hono@v4.0.9/mod.ts";
import { serveStatic } from "https://deno.land/x/hono@v4.0.9/middleware.ts";
import list from "./routes/list.ts";
import newSession from "./routes/new.ts";

const app = new Hono();

app.use("/static/*", serveStatic({ root: "./" }));

app.route("/", list);
app.route("/list", list);
app.route("/new", newSession);

Deno.serve(app.fetch);
