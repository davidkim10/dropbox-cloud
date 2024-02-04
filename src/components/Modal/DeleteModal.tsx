"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { db, storage } from "@/lib/firebase";
import { deleteObject, ref } from "firebase/storage";
import { deleteDoc, doc } from "firebase/firestore";
import toast from "react-hot-toast";

export function DeleteModal() {
  const { user } = useUser();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen, fileId, setFileId] =
    useAppStore((state) => [
      state.isDeleteModalOpen,
      state.setIsDeleteModalOpen,
      state.fileId,
      state.setFileId,
    ]);

  const handleDeleteFile = async () => {
    if (!user || !fileId) return;
    const fileRef = ref(storage, `users/${user.id}/files/${fileId}`);
    try {
      setIsDeleting(true);
      await deleteObject(fileRef);
      await deleteDoc(doc(db, "users", user.id, "files", fileId));
      toast.success("File deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete file");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setFileId(null);
    }
  };

  return (
    <Dialog
      open={isDeleteModalOpen}
      onOpenChange={(isOpen) => {
        setIsDeleteModalOpen(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Once your delete this file, this action cannot be undone! Please
            confirm you want to remove this file.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex gap-3">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>

            <Button variant={"destructive"} onClick={handleDeleteFile}>
              <span className="sr-only">Delete</span>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
