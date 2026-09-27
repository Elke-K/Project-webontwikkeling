import { NextFunction, Request, Response } from "express";

export function updateAnimalAdminCheck(req: Request, res: Response, next: NextFunction) {
  if (res.locals.user.role != "ADMIN") {
    req.session.message = {
      message: "Je bent geen admin en je kan geen dier updaten.",
      type: "error",
    };
    return res.redirect("/");
  }
  next();
}
