import { microbioApi } from "@/api/index.api";
import {
  IAntibiotic,
  IExpertSystemReq,
  IExpertSystemRes,
  IMicroorganism,
  IZoneReq,
  IZoneRes,
} from "@/interfaces/entities.interface";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IAppState {
  isLoading: boolean;
  dictionaries: {
    microorganisms: IMicroorganism[];
    antibiotics: IAntibiotic[];
  };
}

const initialState: IAppState = {
  isLoading: false,
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

export const interpretate = createAsyncThunk<IExpertSystemRes, IExpertSystemReq, { rejectValue: string }>(
  "interpretate",
  async (req, { rejectWithValue }) => {
    const res = await microbioApi.interpetate(req);
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
      .addCase(interpretate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(interpretate.fulfilled, (state) => {
        state.isLoading = false;
        //implement later
      })
      .addCase(interpretate.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { reset } = microbioSlice.actions;
