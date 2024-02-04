"use client";
import { useState, FC } from "react";
import DropzoneComponent from "react-dropzone";
import toast from "react-hot-toast";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useUser } from "@clerk/nextjs";
import { db, storage } from "@/lib/firebase";
import { cn } from "@/lib/utils";

export const Dropzone: FC = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const maxFileSize = 20971520; // 20MB
  const maxFileSizeLabel = (maxFileSize / (1024 * 1024)).toFixed(0) + " MB";

  const uploadFile = async (selectedFile: File) => {
    if (loading || !user) return;
    setLoading(true);
    const toastId = toast.loading("Loading...");
    try {
      const docRef = await addDoc(collection(db, "users", user.id, "files"), {
        userId: user.id,
        filename: selectedFile.name,
        fullname: user.fullName,
        profileImg: user.imageUrl,
        timestamp: serverTimestamp(),
        type: selectedFile.type,
        size: selectedFile.size,
      });

      // Defines a reference (imageStorageRef) to a path in Firebase Storage where the file will be stored. This path includes the user's ID and the newly created document ID to ensure that the file is stored in a user-specific and document-specific location.
      const imageStorageRef = ref(
        storage,
        `users/${user.id}/files/${docRef.id}`
      );

      // Calls uploadBytes to upload the file to Firebase Storage at the specified imageStorageRef. Once the upload is complete, it proceeds to get the download URL of the uploaded file.
      await uploadBytes(imageStorageRef, selectedFile);
      const downloadURL = await getDownloadURL(imageStorageRef);
      await updateDoc(doc(db, "users", user.id, "files", docRef.id), {
        downloadURL,
      });
      toast.success("File uploaded successfully", { id: toastId });
    } catch (error) {
      console.log(error);
      toast.error("Failed to upload file", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleFileDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onabort = () => toast.error("File reading was aborted");
      reader.onerror = () => toast.error("File reading has failed");
      reader.onload = async () => {
        await uploadFile(file);
      };
      reader.readAsArrayBuffer(file);
    });
  };
  return (
    <DropzoneComponent onDrop={handleFileDrop}>
      {({
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject,
        fileRejections,
      }) => {
        const isFileTooLarge = fileRejections.some(
          ({ file }) => file.size > maxFileSize
        );
        return (
          <section className="my-10">
            <div
              {...getRootProps()}
              className={cn(
                "flex w-full h-52 justify-center items-center p-5 border border-slate-200 border-dashed rounded-md text-center hover:cursor-pointer hover:bg-slate-200 transition-all duration-150 ease-in dark:border-slate-600",
                isDragActive
                  ? "bg-blue-500 text-white"
                  : "bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-400"
              )}
            >
              <input {...getInputProps()} />
              <div className="text-xl">
                {!isDragActive && "Click or drop a file to upload"}
                {isDragActive && !isDragReject && "Drop it like it's hot!"}
                {isDragReject && "File type not accepted, sorry!"}
                {isFileTooLarge && "File is too large!"}
                <p className="text-sm m-2">Max file size: {maxFileSizeLabel}</p>
              </div>
            </div>
          </section>
        );
      }}
    </DropzoneComponent>
  );
};
