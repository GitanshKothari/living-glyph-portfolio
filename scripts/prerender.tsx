import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { renderToString } from "react-dom/server";
import { App } from "../src/App";
import { routes, pageTitle } from "../src/content";
const template = readFileSync("dist/index.html", "utf8");
for (const path of [...routes, "/404"]) {
  const folder = path === "/" ? "dist" : "dist" + path;
  mkdirSync(folder, { recursive: true });
  const title = pageTitle(path) + " — Software, vision & robotics";
  const html = template
    .replace("<!--app-->", renderToString(<App initialPath={path} />))
    .replace("<title>Gitansh Kothari</title>", "<title>" + title + "</title>")
    .replace(
      'content="Gitansh Kothari — Selected work"',
      'content="' + title + '"',
    )
    .replace(
      'href="https://gitanshkothari.vercel.app/"',
      'href="https://gitanshkothari.vercel.app' + path + '"',
    );
  writeFileSync(folder + "/index.html", html);
  if (path === "/404") writeFileSync("dist/404.html", html);
}
writeFileSync(
  "dist/sitemap.xml",
  '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    routes
      .map(
        (p) =>
          "<url><loc>https://gitanshkothari.vercel.app" + p + "</loc></url>",
      )
      .join("") +
    "</urlset>",
);
