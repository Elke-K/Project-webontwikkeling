import { ObjectId } from "mongodb";

export interface MedicalRecord {
  _id?: string;
  id: string;
  chipNumber: string;
  lastVaccination: string;
  bloodType: string;
  isSterilized: boolean;
  healthNote: string;
  imageUrl: string;
}

export interface Animal {
  _id?: string;
  id: string;
  name: string;
  description: string;
  age: number;
  isActive: boolean;
  birthDate: string;
  imageUrl: string;
  species: string;
  hobbies: string[];
  medicalRecord: MedicalRecord;
}

export interface User {
  _id?: ObjectId;
  username: string;
  password?: string;
  role?: "USER" | "ADMIN";
}

export interface FlashMessage {
  type: "error" | "success";
  message: string;
}
