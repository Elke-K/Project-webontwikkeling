import { Router } from "express";
import { Animal } from "../types";
import {returnAnimals } from "../database";

export function indexRouter(): Router {
  const router: Router = Router();

  router.get("/", async (req, res) => {
    const sortField: string =
      typeof req.query.sortField === "string" ? req.query.sortField : "name";
    const sortDirection: string =
      typeof req.query.sortDirection === "string"
        ? req.query.sortDirection
        : "asc";
    const search: string =
      typeof req.query.search === "string" ? req.query.search : "";


    let animalsReturned: Animal[] = await returnAnimals(sortField, sortDirection, search);
    res.render("index", {
      animals: animalsReturned,
      q: search,
      sortField: sortField,
      sortDirection: sortDirection,
    });
  });

  return router;
}
