"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppStore } from "@/lib/store";
import { useUser } from "@clerk/nextjs";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";

export function RenameModal() {
  const [isRenameModalOpen, setIsRenameModalOpen, fileId, setFileId, filename] =
    useAppStore((state) => [
      state.isRenameModalOpen,
      state.setIsRenameModalOpen,
      state.fileId,
      state.setFileId,
      state.filename,
    ]);
  const { user } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const [name, setName] = useState(filename);

  useEffect(() => {
    setName(filename);
  }, [isRenameModalOpen, filename]);

  const handleRenameFile = async () => {
    if (!user || !fileId) return;
    const docRef = doc(db, "users", user.id, "files", fileId);
    try {
      setIsUpdating(true);
      await updateDoc(docRef, { filename: name });
      toast.success("File renamed successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to rename file");
    } finally {
      setName("");
      setIsUpdating(false);
      setIsRenameModalOpen(false);
      setFileId(null);
    }
  };

  return (
    <Dialog
      open={isRenameModalOpen}
      onOpenChange={(isOpen) => {
        setIsRenameModalOpen(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rename File</DialogTitle>
          <DialogDescription>Add a new file name below</DialogDescription>
        </DialogHeader>

        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter new file name"
        />
        <DialogFooter>
          <div className="flex gap-3">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>

            <Button onClick={handleRenameFile}>
              <span className="sr-only">Save</span>
              {isUpdating ? "Updating..." : "Save"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
