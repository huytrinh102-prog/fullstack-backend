import express from "express";
import configViewEngine from "./config/viewEngine.js";
import initWebRoutes from "./routes/web.js";
import dotenv from "dotenv";
import connection from "./config/connect.js";
import cors from "cors";
import initApiRoutes from "./routes/api.js";
import cookieParser from "cookie-parser";
import { checkToken } from "./middleware/jwt-action.js";

dotenv.config();
const app = express(); // req.body undifile
app.use(express.urlencoded({ extended: true })); // form submit (x-www-form-urlencoded)
app.use(express.json());
// cookie
app.use(cookieParser());
// accept connect to react
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
// init wed routes
configViewEngine(app);
initWebRoutes(app);
initApiRoutes(app);
const PORT = Number(process.env.PORT) || 8081;
const HOST = process.env.HOST || "::";
const server = app.listen({ port: PORT, host: HOST, ipv6Only: false }, () => {
  console.log(`backend listening on http://localhost:${PORT}`);
});

// middleware
app.use((req, res, next) => {
  return res.send("not found 404");
});

// check connection
connection();
server.on("error", (err) => {
  console.error("Failed to start server:", err);
  process.exitCode = 1;
});
