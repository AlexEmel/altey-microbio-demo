import { ISelectedAntibiotic } from "@/interfaces/entities.interface";
import { v4 as uuidv4 } from "uuid";

export const getDummyAbx = (moId: string): ISelectedAntibiotic => {
  return {
    id: uuidv4(),
    moId,
    code: "",
    name: "",
    zone: null,
    SIR: "",
  };
};
