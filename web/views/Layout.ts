import { html } from "https://deno.land/x/hono@v4.0.9/helper.ts";
import { HtmlEscapedString } from "https://deno.land/x/hono@v4.0.9/utils/html.ts";

export interface SiteData {
  title: string;
  description: string;
  children?: HtmlEscapedString | Promise<HtmlEscapedString>;
}

export function Layout({ title, description, children }: SiteData) {
  return html`
    <html>
        <head>
            <meta charset="UTF-8">
            <title>${title}</title>
            <meta name="description" content="${description}">
            <head prefix="og: http://ogp.me/ns#">
            <meta property="og:type" content="article">
            <!-- More elements slow down JSX, but not template literals. -->
            <meta property="og:title" content="${title}">
            <link rel="stylesheet" href="https://unpkg.com/missing.css@1.1.1">
            <link rel='stylesheet' type="text/css" href="/static/global.css" />
        </head>
        <body>
          <main>
            ${children}
          </main>
        </body>
    </html>
    `;
}
