import { Hono } from "@hono/hono";
import { serveStatic } from "@hono/hono/deno";
import list from "./routes/list.ts";
import newSession from "./routes/new.ts";

const app = new Hono();

app.use("/static/*", serveStatic({ root: "./" }));

app.route("/", list);
app.route("/list", list);
app.route("/new", newSession);

Deno.serve(app.fetch);
