import { Router } from "express";

export function logoutRouter(): Router {
  const router: Router = Router();

  router.post("/", (req, res) => {
    req.session.message = { message: "Succesvol uitgelogd!", type: "success" };
    req.session.destroy(() => {
      res.redirect("/login");
    });
  });

  return router;
}
