import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface Listing {
  id: string;
  title: string;
  pricePerNight: number;
  type: string;
  address: string;
  city: string;
  country: string;
  images: string[];
  description: string;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
}

export interface ListingsState {
  items: Listing[];
  loading: boolean;
  error: string | null;
}

const initialState: ListingsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchListings = createAsyncThunk(
  "listings/fetchListings",
  async () => {
    const response = await fetch("/api/v1/listings");
    if (!response.ok) {
      throw new Error("Failed to fetch listings");
    }
    const data = await response.json();
    return data.data;
  }
);

const listingsSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default listingsSlice.reducer;
