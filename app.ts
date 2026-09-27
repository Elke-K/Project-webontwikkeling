import express, { Express } from "express";
import path from "path";
import { indexRouter } from "./routers";
import { medicalRecordsRouter} from "./routers/medical_records";
import { animalRouter } from "./routers/animal";
import { medicalRecordRouter } from "./routers/medicalRecord";
import { loginRouter } from "./routers/login";
import { registerRouter } from "./routers/register";
import session from "./session";
import { secureMiddleware } from "./middleware/secureMiddleware";
import { flashMiddleware } from "./middleware/flashMiddleware";
import { logoutRouter } from "./routers/logout";
import { userLoggedInMiddleware } from "./middleware/userLoggedInMiddleware";
import { noRouteFoundMiddleware } from "./middleware/noRouteFoundMiddleware";

const app: Express = express();

app.set("view engine", "ejs");
app.use(session);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.set("port", process.env.PORT || 3000);

app.use(flashMiddleware);
app.use("/login", userLoggedInMiddleware, loginRouter());
app.use("/register", userLoggedInMiddleware, registerRouter());
app.use("/logout", logoutRouter());
app.use("/", secureMiddleware, indexRouter());
app.use("/medical_records", secureMiddleware, medicalRecordsRouter());
app.use("/animal", secureMiddleware, animalRouter());
app.use("/medicalrecord", secureMiddleware, medicalRecordRouter());
app.use(noRouteFoundMiddleware);

export default app;