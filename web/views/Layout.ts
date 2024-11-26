import { html } from "@hono/hono/html";
import { HtmlEscapedString } from "@hono/hono/utils/html";

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
            <script src="/static/js/vendor/htmx-1.9.12.min.js"></script>
        </head>
        <body>
          <main>
            ${children}
          </main>
        </body>
    </html>
    `;
}
