import { NextFunction, Request, Response } from "express";

export function noRouteFoundMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.status(404).render("error", {
    error: "Deze site hebben we niet terug gevonden!",
  });
}
