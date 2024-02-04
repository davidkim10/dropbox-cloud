import { create } from "zustand";
// State management with Zustand

interface AppState {
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (isOpen: boolean) => void;

  isRenameModalOpen: boolean;
  setIsRenameModalOpen: (isOpen: boolean) => void;

  fileId: string | null;
  setFileId: (id: string | null) => void;

  filename: string;
  setFilename: (name: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isDeleteModalOpen: false,
  setIsDeleteModalOpen: (isOpen) => set({ isDeleteModalOpen: isOpen }),

  isRenameModalOpen: false,
  setIsRenameModalOpen: (isOpen) => set({ isRenameModalOpen: isOpen }),

  fileId: null,
  setFileId: (id) => set({ fileId: id }),

  filename: "",
  setFilename: (name) => set({ filename: name }),
}));
