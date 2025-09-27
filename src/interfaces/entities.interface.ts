import { EExpertSystem, ESusceptibility } from "@/enums/common.enum";

export interface IMicroorganism {
  code: string;
  name: string;
}

export interface ISelectedMicroorganism extends IMicroorganism {
  id: string;
}

export interface IAntibiotic {
  code: string;
  name: string;
}

export interface ISelectedAntibiotic extends IAntibiotic {
  id: string;
  moId: string;
  zone: number | null;
  SIR: ESusceptibility | string;
}

export interface IZoneReq {
  microorganismCode: string;
  antibioticCode: string;
  zone: string;
}

export interface IZoneRes extends IZoneReq {
  abxId?: string;
  SIR: ESusceptibility | string;
}

export interface IEvaluationReq {
  es: EExpertSystem;
  microorganisms: {
    microorganismCode: string;
    antibiotics: IZoneRes[];
  }[];
}

export interface IEvaluationResult {
  microorganismCode: string;
  microorganismName: string;
  antibiotics: IZoneRes[];
  markers: {
    markerCode: string;
    markerName: string;
  }[];
  esDescription: string;
  interpretation: string[];
}

export interface IEvaluation {
  es: EExpertSystem;
  microorganisms: IEvaluationResult[];
}
