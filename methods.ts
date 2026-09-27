import { Animal, MedicalRecord } from "./types";

export function fillMedicalRecords(animals: Animal[]): MedicalRecord[] {
  const medialRecords: MedicalRecord[] = animals.map((animal) => {
    let medicalRecord = animal.medicalRecord;
    medicalRecord.imageUrl = animal.imageUrl;
    return medicalRecord;
  });

  return medialRecords;
}
