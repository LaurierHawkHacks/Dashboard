import { Socials } from "@/services/utils/types";
import { create } from "zustand";

export interface UserStore {
    socials: Socials | null;
    setSocials: (socials: Socials | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
    socials: null,
    setSocials: (socials) =>
        set((state) => {
            state.socials = socials;
            return state;
        }),
}));
