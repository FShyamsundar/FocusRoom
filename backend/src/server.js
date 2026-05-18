import "dotenv/config";

import http from "http";

import { Server } from "socket.io";

import app from "./app.js";
import { corsOptions } from "./config/cors.js";
import { connectDatabase } from "./config/db.js";
import { FocusSession } from "./models/FocusSession.js";
import { scheduleWeeklyDigest } from "./services/digestService.js";
import { registerFocusSocketHandlers } from "./sockets/focusSocketHandler.js";

const PORT = Number(process.env.PORT || 5000);

const startServer = async () => {
  await connectDatabase();

  // Active sessions without live sockets would create ghost presence after a restart.
  await FocusSession.deleteMany({ status: "active" });

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: corsOptions,
  });
  app.set("io", io);

  registerFocusSocketHandlers(io);
  scheduleWeeklyDigest();

  server.listen(PORT, () => {
    console.log(`FocusRoom backend listening on port ${PORT}`);
  });
};

startServer();
