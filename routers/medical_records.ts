import { Router } from "express";
import { Animal, MedicalRecord } from "../types";
import { fillMedicalRecords } from "../methods";
import { returnAnimals } from "../database";

export function medicalRecordsRouter(): Router {
  const router: Router = Router();

  router.get("/", async (req, res) => {
    const animalsReturned: Animal[] = await returnAnimals("name", "asc", "");
    const medicalRecords: MedicalRecord[] = fillMedicalRecords(animalsReturned);
    res.render("medical_records", {
      records: medicalRecords,
    });
  });

  return router;
}
