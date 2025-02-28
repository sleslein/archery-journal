import { Hono } from "@hono/hono";
import { Layout } from "../views/Layout.ts";
import { SiteData } from "../views/Layout.ts";
import { html } from "@hono/hono/html";
import { createRepository } from "@repository";
import { sessionForm } from "../views/add-edit/form.ts";
import { ArcherySession } from "../../app/ArcherySession.ts";

const app = new Hono();
const respository = createRepository();

const siteData: SiteData = {
  title: "My Archery Jounal",
  description: "Edit Session",
};

app.get("/:sessionId", async (context) => {
  const { sessionId } = context.req.param();
  const session = respository.getSessionById(parseInt(sessionId));

  return await context.html(Layout({
    ...siteData,
    children: html`
      ${sessionForm({ pageTitle: "Edit Session", session })}
    `,
  }));
});

app.post("/:sessionId", async (context) => {
  const body = await context.req.parseBody();

  const requestSession = {
    id: body["id"].toString(),
    date: body["date"].toString(),
    distance: body["distance"].toString(),
    arrows: [...body["arrows"].toString().split(" ")],
  };

  const encodedSession = ArcherySession.encodeSession(requestSession);
  const updatedSession = new ArcherySession(encodedSession);

  updatedSession.id = parseInt(requestSession.id);

  respository.update(updatedSession);

  return context.redirect("/list", 303);
});

export default app;
