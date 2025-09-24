import { microbioApi } from "@/api/index.api";
import {
  IAntibiotic,
  IExpertSystemReq,
  IExpertSystemRes,
  IMicroorganism,
  ISelectedAntibiotic,
  ISelectedMicroorganism,
  IZoneReq,
  IZoneRes,
} from "@/interfaces/entities.interface";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IAppState {
  isLoading: boolean;
  antibiogram: {
    selectedMos: ISelectedMicroorganism[];
    selectedAbx: ISelectedAntibiotic[];
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
    selectedAbx: [],
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

export const getZone = createAsyncThunk<IZoneRes, IZoneReq, { rejectValue: string }>(
  "getZone",
  async (req, { rejectWithValue }) => {
    const res = await microbioApi.getZone(req);
    if (res.success && res.payload) {
      return res.payload;
    }
    if (!res.success && res.error) {
      return rejectWithValue(res.error!);
    }
    return rejectWithValue("Unexpected error occurred");
  }
);

export const evaluate = createAsyncThunk<IExpertSystemRes, IExpertSystemReq, { rejectValue: string }>(
  "evaluate",
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
    setAntibiogramMos: (state, action: PayloadAction<ISelectedMicroorganism[]>) => {
      state.antibiogram.selectedMos = action.payload;
    },
    setAntibiogramAbx: (state, action: PayloadAction<ISelectedAntibiotic[]>) => {
      state.antibiogram.selectedAbx = action.payload;
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
      .addCase(getZone.fulfilled, (state) => {
        state.isLoading = false;
        //implement later
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

export const { reset, setAntibiogramMos, setAntibiogramAbx } = microbioSlice.actions;
