require("dotenv").config();
const { app, initModels } = require("./app");
const { sequelize } = require("./config/sequelize");

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    await initModels();
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
}

start();
