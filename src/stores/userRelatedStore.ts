import { UserRelated } from "@/interfaces/api";
import { removeAccents } from "@/lib/utils";
import { create } from "zustand";

// Định nghĩa type cho Zustand store
interface UserRelatedStore {
  userRelated: UserRelated[];
  isLoading: boolean;
  setUserRelated: (users: UserRelated[]) => void;
  setLoading: (loading: boolean) => void;
  addMoreUserRelated: (users: UserRelated[]) => void;
  updateUserRelated: (user: UserRelated) => void;
}

// Tạo Zustand store
export const userRelatedStore = create<UserRelatedStore>((set) => ({
  userRelated: [],
  isLoading: false,
  setUserRelated: (users) => set({ userRelated: users }),
  setLoading: (loading) => set({ isLoading: loading }),
  addMoreUserRelated: (users) =>
    set((state) => ({
      userRelated: [...(state.userRelated ?? []), ...users],
    })),
  updateUserRelated: (user) =>
    set((state) => {
      const users = state.userRelated?.map((item) => {
        if(user.id === item.id) return user;

        return item;
      })
      return {
        userRelated: users,
      }
    }),
}));
