const express = require("express");
const { initMessageModel } = require("./models/Message");
const messageRoutes = require("./routes/messageRoutes");
const { initGymRegistrationModel } = require("./models/GymRegistration");
const gymRegistrationRoutes = require("./routes/gymRegistrationRoutes");
const { initSessionBookingModel } = require("./models/SessionBoking");
const sessionBookingRoutes = require("./routes/sessionBookingRoutes");

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/messages", messageRoutes);
app.use("/registrations", gymRegistrationRoutes);
app.use("/sessions", sessionBookingRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(400).json({ error: err.message || "Bad Request" });
});

async function initModels() {
  await initMessageModel();
  await initGymRegistrationModel();
  await initSessionBookingModel();
}

module.exports = { app, initModels };
