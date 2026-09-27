import { Collection, MongoClient, Sort } from "mongodb";
import { Animal, User } from "./types";
import bcrypt from "bcrypt";

import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGODB_URI) {
  console.error("Mongo connection string is undefined!");
  process.exit(1);
}

export const MONGODB_URI: string = process.env.MONGODB_URI;

const client: MongoClient = new MongoClient(MONGODB_URI);
const animalsCollection: Collection<Animal> = client
  .db("animal-db")
  .collection("animals");
const usersCollection: Collection<User> = client
  .db("animal-db")
  .collection("userInfo");

const saltRounds: number = 10;

export async function connect(): Promise<void> {
  try {
    await client.connect();
    await seed();
    await createInitialUsers();
    console.log("Successfully connected to the database!");
    process.on("SIGINT", exit);
    process.on("SIGUSR2", exit);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

export async function exit(): Promise<void> {
  try {
    await client.close();
    console.log("Database exited.");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

export async function exitTests(): Promise<void> {
  try {
    await client.close();
    console.log("Database exited.");
  } catch (error) {
    console.error(error);
  }
}

async function seed(): Promise<void> {
  const animals: Animal[] = await returnAnimals("", "", "");

  if ((await animalsCollection.countDocuments()) === 0) {
    await animalsCollection.insertMany(animals);
    console.log("Successfully seeded animals.");
  }
}

async function createInitialUsers() {
  if (
    !process.env.ADMIN_USERNAME ||
    !process.env.ADMIN_PASSWORD ||
    !process.env.ADMIN_ROLE ||
    !process.env.USER_USERNAME ||
    !process.env.USER_PASSWORD ||
    !process.env.USER_ROLE
  ) {
    console.error(
      "Please define ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_ROLE, USER_USERNAME, USER_PASSWORD and USER_ROLE in .env!",
    );
    process.exit(1);
  }

  if (
    (process.env.ADMIN_ROLE != "USER" && process.env.ADMIN_ROLE != "ADMIN") ||
    (process.env.USER_ROLE != "USER" && process.env.USER_ROLE != "ADMIN")
  ) {
    console.error("ADMIN ROLE OR USER ROLE MUST BE ADMIN OR USER!");
    process.exit(1);
  }

  const adminUser: User = {
    username: process.env.ADMIN_USERNAME.toLowerCase(),
    password: await bcrypt.hash(process.env.ADMIN_PASSWORD, saltRounds),
    role: process.env.ADMIN_ROLE,
  };
  const normalUser: User = {
    username: process.env.USER_USERNAME.toLowerCase(),
    password: await bcrypt.hash(process.env.USER_PASSWORD, saltRounds),
    role: process.env.USER_ROLE,
  };

  const usersToAdd: User[] = [adminUser, normalUser];

  if ((await usersCollection.countDocuments()) === 0) {
    await usersCollection.insertMany(usersToAdd);
    console.log("Successfully added initial users!");
  }
}

export async function loginUser(
  username: string,
  password: string,
): Promise<User | undefined> {
  if (username === "" || password === "") {
    throw new Error(
      "Gebruikersnaam en wachtwoord moeten beiden worden ingevuld!",
    );
  }
  const lowercaseUsername: string = username.toLowerCase();

  const givenUser: User = { username: username, password: password };
  const userFound: User | null = await usersCollection.findOne({
    username: lowercaseUsername,
  });

  if (!userFound) {
    throw new Error(
      "Deze gebruiker bestaat niet. Registreer deze gebruiker voor dat je hiermee inlogd!",
    );
  }

  if (
    userFound.password &&
    (await bcrypt.compare(password, userFound.password))
  ) {
    return userFound;
  } else {
    throw new Error("Wachtwoord was niet juist.");
  }
}

export async function registerUser(
  username: string,
  password: string,
): Promise<User> {
  if (username === "" || password === "") {
    throw new Error(
      "Gebruikersnaam en wachtwoord moeten beiden worden ingevuld!",
    );
  }

  if (password.length < 8) {
    throw new Error("Wachtwoord moet minimaal 8 tekens bevatten!");
  }

  const lowercaseUsername: string = username.toLowerCase();

  const existingUser = await usersCollection.findOne({
    username: lowercaseUsername,
  });
  if (existingUser) {
    throw new Error("Deze gebruikersnaam is al in gebruik!");
  }

  const hashed = await bcrypt.hash(password, saltRounds);
  const newUser: User = {
    username: lowercaseUsername,
    password: hashed,
    role: "USER",
  };
  await usersCollection.insertOne(newUser);
  return newUser;
}

export async function returnAnimals(
  sortField: string,
  sortDirection: string,
  search: string,
): Promise<Animal[]> {
  const sortDirectionNum = sortDirection === "asc" ? 1 : -1;
  let animals: Animal[] = [];
  switch (sortField) {
    case "name":
      animals = await animalsCollection
        .find({ name: { $regex: search, $options: "i" } })
        .sort({ name: sortDirectionNum })
        .toArray();
      break;
    case "birthdate":
      animals = await animalsCollection
        .find({ name: { $regex: search, $options: "i" } })
        .sort({ birthDate: sortDirectionNum })
        .toArray();
      break;
    case "hobbies":
      animals = await animalsCollection
        .find({ name: { $regex: search, $options: "i" } })
        .toArray();
      animals = animals.sort((a, b) =>
        sortDirectionNum === 1
          ? a.hobbies.length - b.hobbies.length
          : b.hobbies.length - a.hobbies.length,
      );
      break;
    case "age":
      animals = await animalsCollection
        .find({ name: { $regex: search, $options: "i" } })
        .sort({ age: sortDirectionNum })
        .toArray();
      break;
    case "active":
      animals = await animalsCollection
        .find({ name: { $regex: search, $options: "i" } })
        .sort({ isActive: sortDirectionNum })
        .toArray();
      break;
    default:
      animals = await animalsCollection
        .find({ name: { $regex: search, $options: "i" } })
        .sort({ name: sortDirectionNum })
        .toArray();
      break;
  }
  return animals;
}

export async function getAnimalById(givenId: string) {
  const animal: Animal | null = await animalsCollection.findOne({
    id: givenId,
  });

  return animal;
}

export async function updateAnimal(
  givenId: string,
  givenAnimal: Animal,
): Promise<boolean> {
  await animalsCollection.updateOne(
    { id: givenId },
    {
      $set: {
        name: givenAnimal.name,
        species: givenAnimal.species,
        description: givenAnimal.description,
        age: givenAnimal.age,
        birthDate: givenAnimal.birthDate,
        imageUrl: givenAnimal.imageUrl,
        hobbies: givenAnimal.hobbies,
        isActive: givenAnimal.isActive,
      },
    },
  );

  return true;
}
