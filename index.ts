import dotenv from "dotenv";
dotenv.config();
import { connect } from "./database";
import app from "./app";

app.listen(app.get("port"), async() => {
  await connect();
  console.log("Server started on http://localhost:" + app.get("port"));
});
