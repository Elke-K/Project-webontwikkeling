import { connect, exitTests, returnAnimals } from "./database";
import dotenv from "dotenv";
dotenv.config();

beforeAll(async () => {
  await connect();
});

//tests for index page, regular unit tests for returnAnimals.

describe("returnAnimals", () => {
  test("returns all animals when search is empty", async () => {
    const animals = await returnAnimals("name", "asc", "");
    expect(animals.length).toBeGreaterThan(0);
  });

  test("filters animals by name case-insensitively", async () => {
    const animals = await returnAnimals("name", "asc", "bella");
    animals.forEach((animal) => {
      expect(animal.name.toLowerCase()).toContain("bella");
    });
  });

  test("returns empty array when search has no matches", async () => {
    const animals = await returnAnimals("name", "asc", "abcdefg");
    expect(animals).toHaveLength(0);
  });

  test("sorts by name ascending", async () => {
    const animals = await returnAnimals("name", "asc", "");
    for (let i = 0; i < animals.length - 1; i++) {
      expect(
        animals[i].name.localeCompare(animals[i + 1].name),
      ).toBeLessThanOrEqual(0);
    }
  });

  test("sorts by name descending", async () => {
    const animals = await returnAnimals("name", "desc", "");
    for (let i = 0; i < animals.length - 1; i++) {
      expect(
        animals[i].name.localeCompare(animals[i + 1].name),
      ).toBeGreaterThanOrEqual(0);
    }
  });

  test("sorts by age ascending", async () => {
    const animals = await returnAnimals("age", "asc", "");
    for (let i = 0; i < animals.length - 1; i++) {
      expect(animals[i].age).toBeLessThanOrEqual(animals[i + 1].age);
    }
  });

  test("sorts hobbies by count ascending", async () => {
    const animals = await returnAnimals("hobbies", "asc", "");
    for (let i = 0; i < animals.length - 1; i++) {
      expect(animals[i].hobbies.length).toBeLessThanOrEqual(
        animals[i + 1].hobbies.length,
      );
    }
  });
});

afterAll(async () => {
  exitTests();
});
