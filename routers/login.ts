import { Router } from "express";
import { loginUser } from "../database";
import { FlashMessage, User } from "../types";

export function loginRouter(): Router {
  const router: Router = Router();

  router.get("/", (req, res) => {
    res.render("login");
  });

  router.post("/", async (req, res) => {
    const username: string = req.body.username;
    const password: string = req.body.password;

    try {
      const user: User | undefined = await loginUser(username, password);

      if (user != undefined) {
        delete user.password;
        delete user._id;
        req.session.user = user;
        req.session.message = {message: "Je bent succesvol ingelogd!", type: "success"}
        res.redirect("/");
      }
    } catch (err: any) {
      req.session.message = { message: err.message, type: "error" };
      res.redirect("/login");
    }
  });

  return router;
}
