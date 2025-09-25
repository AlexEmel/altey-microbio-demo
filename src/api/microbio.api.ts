import { IApiRes } from "@/interfaces/api.interface";
import {
  IAntibiotic,
  IEvaluateReq,
  IEvaluateRes,
  IMicroorganism,
  IZoneReq,
  IZoneRes,
} from "@/interfaces/entities.interface";
import { handleApiRes } from "@/utils/api.util";
import { AxiosInstance } from "axios";

export class MicrobioApi {
  private api: AxiosInstance;
  private path: string;

  constructor(api: AxiosInstance) {
    this.api = api;
    this.path = "";
  }

  public async getMicroorganisms(): Promise<IApiRes<IMicroorganism[]>> {
    return await handleApiRes<IApiRes<IMicroorganism[]>>(this.api.get(`${this.path}/microorganisms`));
  }

  public async getAntibiotics(): Promise<IApiRes<IAntibiotic[]>> {
    return await handleApiRes<IApiRes<IAntibiotic[]>>(this.api.get(`${this.path}/antibiotics`));
  }

  public async getZone(payload: IZoneReq): Promise<IApiRes<IZoneRes>> {
    return await handleApiRes<IApiRes<IZoneRes>>(this.api.post(`${this.path}/give-sir`, payload));
  }

  public async evaluate(payload: IEvaluateReq): Promise<IApiRes<IEvaluateRes>> {
    return await handleApiRes<IApiRes<IEvaluateRes>>(this.api.post(`${this.path}/give-es`, payload));
  }
}
