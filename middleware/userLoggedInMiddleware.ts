import { NextFunction, Request, Response } from "express";

export async function userLoggedInMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.session.user) {
    return res.redirect("/");
  }
  next();
}
