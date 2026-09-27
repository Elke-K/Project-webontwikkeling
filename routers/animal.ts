import { Router } from "express";
import { Animal } from "../types";
import { getAnimalById, returnAnimals, updateAnimal } from "../database";
import { updateAnimalAdminCheck } from "../middleware/updateAnimalAdminCheckMiddleware";

export function animalRouter(): Router {
  const router: Router = Router();

  router.get("/:id", async (req, res) => {
    const animalId: string = req.params.id;
    const animalsReturned: Animal[] = await returnAnimals("name", "asc", "");

    const animalFound: Animal | undefined = animalsReturned.find(
      (an) => an.id === animalId,
    );

    if (animalFound === undefined) {
      res.status(404).render("error", {
        error: "Dier niet gevonden!",
      });
    }

    res.render("animal", {
      animal: animalFound,
    });
  });

  router.get("/:id/update", updateAnimalAdminCheck, async (req, res) => {
    const id: string = req.params.id;

    const animal: Animal | null = await getAnimalById(id);

    if (!animal) {
      res.status(400).render("error", {
        error: "Dier is niet gevonden!",
      });
    } else {
      res.render("animal-update", {
        animal: animal,
      });
    }
  });
  router.post("/:id/update", async (req, res) => {
    const {
      name,
      species,
      description,
      age,
      birthDate,
      imageUrl,
      hobbies,
      isActive,
    } = req.body;
    if (
      !name ||
      !species ||
      !description ||
      !age ||
      !birthDate ||
      !imageUrl ||
      typeof isActive === "undefined"
    ) {
      return res
        .status(400)
        .render("error", { error: "Vul alle verplichte velden in." });
    }
    const ageNum = Number(age);
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 100) {
      return res.status(400).render("error", {
        error: "Leeftijd moet een getal tussen 0 en 100 zijn.",
      });
    }

    let hobbiesArr: string[] = [];
    if (typeof hobbies === "string") {
      hobbiesArr = hobbies
        .split(",")
        .map((h: string) => h.trim())
        .filter((h: string) => h.length > 0);
    } else if (Array.isArray(hobbies)) {
      hobbiesArr = hobbies;
    }
    const isActiveBool: boolean = isActive === "true" || isActive === true;

    const oldAnimal = await getAnimalById(req.params.id);

    if (!oldAnimal) {
      return res.status(404).render("error", { error: "Dier niet gevonden!" });
    }

    if (oldAnimal) {
      const updatedAnimal: Animal = {
        id: req.params.id,
        name: name,
        species: species,
        description: description,
        age: ageNum,
        birthDate: birthDate,
        imageUrl: imageUrl,
        hobbies: hobbiesArr,
        isActive: isActiveBool,
        medicalRecord: oldAnimal.medicalRecord,
      };

      await updateAnimal(req.params.id, updatedAnimal);
      res.redirect(`/animal/${req.params.id}`);
    }
  });

  return router;
}
