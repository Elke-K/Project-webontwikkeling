import { Router } from "express";
import { registerUser } from "../database";

export function registerRouter(): Router {
  const router: Router = Router();


  router.get("/", (req, res) => {
    res.render("register");
  });
  router.post("/", async (req, res) => {
    try {
      const username : string = req.body.username;
      const password : string = req.body.password;

      await registerUser(username, password);

      req.session.message = {
        message: "Succesvol geregistreerd!",
        type: "success",
      };
      
      res.redirect("/login");
    } catch (e: any) {
      req.session.message = { message: e.message, type: "error" };
      res.redirect("/register");
    }
  });

  return router;
}
