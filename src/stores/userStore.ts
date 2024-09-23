import { User } from "@/interfaces/api";
import { removeAccents } from "@/lib/utils";
import { create } from "zustand";

// Định nghĩa type cho Zustand store
interface UserStore {
  users: User[];
  isLoading: boolean;
  setUsers: (users: User[]) => void;
  setLoading: (loading: boolean) => void;
  addMoreUser: (users: User[]) => void;
}

// Tạo Zustand store
export const userStore = create<UserStore>((set) => ({
  users: [],
  isLoading: false,
  setUsers: (users) => set({ users: users.map((item) => ({...item, nameForSearch: removeAccents(item.name)})) }),
  setLoading: (loading) => set({ isLoading: loading }),
  addMoreUser: (users) =>
    set((state) => ({
      users: [...(state.users ?? []), ...users],
    })),
}));
