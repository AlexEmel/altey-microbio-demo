import { IApiRes } from "@/interfaces/api.interface";
import { IAntibiotic, IMicroorganism } from "@/interfaces/entities.interface";
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
    return await handleApiRes<IApiRes<IMicroorganism[]>>(
      this.api.get(`${this.path}/microorganisms`)
    );
  }

    public async getAntibiotics(): Promise<IApiRes<IAntibiotic[]>> {
    return await handleApiRes<IApiRes<IAntibiotic[]>>(
      this.api.get(`${this.path}/antibiotics`)
    );
  }
}
