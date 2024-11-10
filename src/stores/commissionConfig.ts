import { ConfigData } from "@/interfaces/api";
import { create } from "zustand";

// Định nghĩa type cho Zustand store
interface CommissionConfigStore {
  commissionConfig: ConfigData | null;
  commissionType: ConfigData | null;
  isLoading: boolean;
  setCommissionConfig: (data: ConfigData) => void;
  setCommissionType: (data: ConfigData) => void;
  setLoading: (loading: boolean) => void;
}

// Tạo Zustand store
export const commissionConfigStore = create<CommissionConfigStore>((set) => ({
  commissionConfig: null,
  commissionType: null,
  isLoading: false,
  setCommissionConfig: (data) => set({ commissionConfig: data }),
  setCommissionType: (data) => set({ commissionType: data }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
