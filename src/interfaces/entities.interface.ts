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
}


export interface IZoneReq {
  antibioticCode: string;
  antibioticName: string;
  value: string;
}

export interface IZoneRes extends IZoneReq {
  SIR: string;
}

export interface IExpertSystemReq {
  es: string;
  microorganisms: {
    microorganismCode: string;
    antibiotics: IZoneRes[];
  }[];
}

export interface IExpertSystemRes {
  es: string;
  microorganisms: {
    microorganismCode: string;
    antibiotics: IZoneRes[];
    markers: {
      markerCode: string;
      markerName: string;
    }[];
    esDescription: string;
    interpretation: string[];
  }[];
}
