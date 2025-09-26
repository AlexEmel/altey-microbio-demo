import { microbioApi } from "@/api/index.api";
import {
  IAntibiotic,
  IEvaluationReq,
  IEvaluationRes,
  IMicroorganism,
  ISelectedAntibiotic,
  ISelectedMicroorganism,
  IZoneReq,
  IZoneRes,
} from "@/interfaces/entities.interface";
import { TRootState } from "@/store/store";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IAppState {
  isPreLoading: boolean;
  isLoading: boolean;
  antibiogram: {
    selectedMos: ISelectedMicroorganism[];
    selectedAbxs: ISelectedAntibiotic[];
  };
  dictionaries: {
    microorganisms: IMicroorganism[];
    antibiotics: IAntibiotic[];
  };
  evaluation: IEvaluationRes | null;
}

const initialState: IAppState = {
  isPreLoading: false,
  isLoading: false,
  antibiogram: {
    selectedMos: [],
    selectedAbxs: [],
  },
  dictionaries: {
    microorganisms: [],
    antibiotics: [],
  },
  evaluation: null,
};

export const getMicroorganisms = createAsyncThunk<IMicroorganism[], undefined, { rejectValue: string }>(
  "getMicroorganisms",
  async (_, { rejectWithValue }) => {
    const res = await microbioApi.getMicroorganisms();
    if (res.success && res.payload) {
      return res.payload;
    }
    if (!res.success && res.error) {
      return rejectWithValue(res.error!);
    }
    return rejectWithValue("Unexpected error occurred");
  }
);

export const getAntibiotics = createAsyncThunk<IAntibiotic[], undefined, { rejectValue: string }>(
  "getAntibiotics",
  async (_, { rejectWithValue }) => {
    const res = await microbioApi.getAntibiotics();
    if (res.success && res.payload) {
      return res.payload;
    }
    if (!res.success && res.error) {
      return rejectWithValue(res.error!);
    }
    return rejectWithValue("Unexpected error occurred");
  }
);

export const getZone = createAsyncThunk<IZoneRes, string, { rejectValue: string }>(
  "getZone",
  async (abxId, { rejectWithValue, getState }) => {
    const { microbio } = getState() as TRootState;
    const targetAbx = microbio.antibiogram.selectedAbxs.find((abx) => abx.id === abxId);
    const targetMo = microbio.antibiogram.selectedMos.find((mo) => mo.id === targetAbx?.moId);
    if (targetMo && targetAbx && targetAbx.zone) {
      const payload: IZoneReq = {
        microorganismCode: targetMo.code,
        antibioticCode: targetAbx.code,
        zone: targetAbx.zone.toString(),
      };
      const res = await microbioApi.getZone(payload);
      if (res.success && res.payload) {
        return { ...res.payload, abxId: targetAbx.id };
      }
      if (!res.success && res.error) {
        return rejectWithValue(res.error!);
      }
    }
    return rejectWithValue("Unexpected error occurred");
  }
);

export const evaluateResults = createAsyncThunk<IEvaluationRes, IEvaluationReq, { rejectValue: string }>(
  "evaluateResults",
  async (req, { rejectWithValue }) => {
    const res = await microbioApi.evaluate(req);
    if (res.success && res.payload) {
      return res.payload;
    }
    if (!res.success && res.error) {
      return rejectWithValue(res.error!);
    }
    return rejectWithValue("Unexpected error occurred");
  }
);

export const microbioSlice = createSlice({
  name: "microbio",
  initialState,
  reducers: {
    reset: () => initialState,
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAntibiogramMos: (state, action: PayloadAction<ISelectedMicroorganism[]>) => {
      state.antibiogram.selectedMos = action.payload;
    },
    setAntibiogramAbxsForMo: (state, action: PayloadAction<{ moId: string; abxs: ISelectedAntibiotic[] }>) => {
      const { moId, abxs } = action.payload;
      const rest = state.antibiogram.selectedAbxs.filter(abx => abx.moId !== moId);
      state.antibiogram.selectedAbxs = [...rest, ...abxs];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMicroorganisms.pending, (state) => {
        state.isPreLoading = true;
      })
      .addCase(getMicroorganisms.fulfilled, (state, action) => {
        state.isPreLoading = false;
        state.dictionaries.microorganisms = action.payload;
      })
      .addCase(getMicroorganisms.rejected, (state) => {
        state.isPreLoading = false;
      })
      .addCase(getAntibiotics.pending, (state) => {
        state.isPreLoading = true;
      })
      .addCase(getAntibiotics.fulfilled, (state, action) => {
        state.isPreLoading = false;
        state.dictionaries.antibiotics = action.payload;
      })
      .addCase(getAntibiotics.rejected, (state) => {
        state.isPreLoading = false;
      })
      .addCase(getZone.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getZone.fulfilled, (state, action) => {
        state.isLoading = false;
        const targetAbx = state.antibiogram.selectedAbxs.find((abx) => abx.id === action.payload.abxId);
        if (targetAbx) {
          targetAbx.SIR = action.payload.SIR;
        }
      })
      .addCase(getZone.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(evaluateResults.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(evaluateResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.evaluation = action.payload;
      })
      .addCase(evaluateResults.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { reset, setIsLoading, setAntibiogramMos, setAntibiogramAbxsForMo } = microbioSlice.actions;
