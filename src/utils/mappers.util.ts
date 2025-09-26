import { EExpertSystem } from "@/enums/common.enum";
import {
  IEvaluationReq,
  ISelectedAntibiotic,
  ISelectedMicroorganism,
  IZoneRes,
} from "@/interfaces/entities.interface";

export const MapEvaluationReqDto = (
  mos: ISelectedMicroorganism[],
  abxs: ISelectedAntibiotic[]
): IEvaluationReq => {
  const mosAbxMap = new Map<string, IZoneRes[]>();
  mos.forEach((mo) => {
    const abxResults: IZoneRes[] = abxs
      .filter((abx) => {
        if (abx.moId === mo.id && abx.SIR) {
          return abx;
        } else return;
      })
      .map((abx) => {
        return {
          microorganismCode: mo.code,
          antibioticCode: abx.code,
          zone: abx.zone ? abx.zone.toString() : "",
          SIR: abx.SIR,
        };
      });
    mosAbxMap.set(mo.code, abxResults);
  });

  const req: IEvaluationReq = {
    es: EExpertSystem.EUCAST2024,
    microorganisms: [],
  };

  for (const [key, value] of mosAbxMap) {
    const mappedMo = {
      microorganismCode: key,
      antibiotics: value,
    };
    req.microorganisms.push(mappedMo);
  }

  return req;
};
