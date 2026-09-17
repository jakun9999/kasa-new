/**
 * Point d’entrée o2switch / Phusion Passenger.
 * cPanel → Setup Node.js App → Application startup file = `server.js`
 *
 * `dir: __dirname` : indispensable — le cwd Passenger n’est pas toujours la racine app.
 */
const { createServer } = require("http");
const { parse } = require("url");
const path = require("path");
const next = require("next");

// Force prod derrière Passenger (évite le mode dev si NODE_ENV manque).
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "production";
}

const dev = process.env.NODE_ENV !== "production";
const dir = path.resolve(__dirname);

const app = next({ dev, dir });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const hasJwt = Boolean(
      process.env.JWT_SECRET && String(process.env.JWT_SECRET).trim(),
    );
    const apiUrl =
      process.env.API_URL_INTERNAL || process.env.NEXT_PUBLIC_API_URL || "";
    console.error(
      `[kasa] boot dir=${dir} NODE_ENV=${process.env.NODE_ENV} JWT_SECRET=${hasJwt ? "oui" : "NON ⚠️"} API_URL=${apiUrl || "NON ⚠️"}`,
    );

    const server = createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    });

    server.on("error", (err) => {
      console.error("[kasa] server error:", err);
    });

    if (typeof PhusionPassenger !== "undefined") {
      // eslint-disable-next-line no-undef
      PhusionPassenger.configure({ autoInstall: false });
      server.listen("passenger");
      console.error("[kasa] listening via Phusion Passenger, dir=", dir);
      return;
    }

    const port = Number(process.env.PORT) || 3000;
    server.listen(port, () => {
      console.log(`[kasa] ready on http://localhost:${port} (dir=${dir})`);
    });
  })
  .catch((err) => {
    console.error("[kasa] next prepare() failed:", err);
    process.exit(1);
  });
