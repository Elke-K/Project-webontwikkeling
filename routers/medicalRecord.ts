import { Router } from "express";
import { Animal } from "../types";
import { returnAnimals } from "../database";

export function medicalRecordRouter(): Router {
  const router: Router = Router();

  router.get("/:id", async (req, res) => {
    const recordId: string = req.params.id;
    const animalsReturned: Animal[] = await returnAnimals("name", "asc", "");

    const animalFound = animalsReturned.find(
      (an) => an.medicalRecord.id === recordId,
    );

    if (animalFound === undefined) {
      res.status(404).render("error", {
        error: "Medisch record niet gevonden!",
      });
    }

    res.render("medicalrecord", {
      animal: animalFound,
    });
  });

  return router;
}
