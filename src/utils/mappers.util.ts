import { IEvaluateReq, ISelectedAntibiotic, ISelectedMicroorganism } from "@/interfaces/entities.interface";

export const MapStoreToEvaluateReqDto = (
  mos: ISelectedMicroorganism[],
  abxs: ISelectedAntibiotic[]
): IEvaluateReq => {};
