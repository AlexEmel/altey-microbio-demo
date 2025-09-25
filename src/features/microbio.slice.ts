import { microbioApi } from "@/api/index.api";
import {
  IAntibiotic,
  IEvaluateReq,
  IEvaluateRes,
  IMicroorganism,
  ISelectedAntibiotic,
  ISelectedMicroorganism,
  IZoneReq,
  IZoneRes,
} from "@/interfaces/entities.interface";
import { TRootState } from "@/store/store";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IAppState {
  isLoading: boolean;
  antibiogram: {
    selectedMos: ISelectedMicroorganism[];
    selectedAbxs: ISelectedAntibiotic[];
  };
  dictionaries: {
    microorganisms: IMicroorganism[];
    antibiotics: IAntibiotic[];
  };
}

const initialState: IAppState = {
  isLoading: false,
  antibiogram: {
    selectedMos: [],
    selectedAbxs: [],
  },
  dictionaries: {
    microorganisms: [],
    antibiotics: [],
  },
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

export const evaluate = createAsyncThunk<IEvaluateRes, IEvaluateReq, { rejectValue: string }>(
  "evaluate",
  async (req, { rejectWithValue, getState }) => {
    // const { microbio } = getState() as TRootState;
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
    setAntibiogramAbxs: (state, action: PayloadAction<ISelectedAntibiotic[]>) => {
      state.antibiogram.selectedAbxs = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMicroorganisms.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMicroorganisms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dictionaries.microorganisms = action.payload;
      })
      .addCase(getMicroorganisms.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getAntibiotics.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAntibiotics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dictionaries.antibiotics = action.payload;
      })
      .addCase(getAntibiotics.rejected, (state) => {
        state.isLoading = false;
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
      .addCase(evaluate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(evaluate.fulfilled, (state) => {
        state.isLoading = false;
        //implement later
      })
      .addCase(evaluate.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { reset, setIsLoading, setAntibiogramMos, setAntibiogramAbxs } = microbioSlice.actions;
