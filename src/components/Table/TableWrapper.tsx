"use client";
import { useState, type FC, use, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "./DataTable";
import { Columns } from "./Columns";
import { collection, orderBy, query } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "@/lib/firebase";
import { FileType } from "@/types";

interface TableWrapperProps {
  initialFiles: FileType[];
  userId: string;
}

const TableLoading = ({ rows = 5 }) => {
  const loadingStates = Array(rows).fill("loading");
  return (
    <div className="border rounded-sm">
      <div className="flex gap-4 border-b p-4">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
      </div>
      <div className="p-4">
        {loadingStates.map((l, i) => (
          <div className="flex items-center gap-2 mb-4" key={i}>
            <Skeleton className="h-12 w-12" />
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const TableWrapper: FC<TableWrapperProps> = ({
  initialFiles = [],
  userId,
}) => {
  const collectionRef = collection(db, "users", userId, "files");
  const [files, setFiles] = useState<FileType[]>(initialFiles);
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [docs, loading] = useCollection(
    query(collectionRef, orderBy("timestamp", sort))
  );
  const isEmpty = files.length === 0;
  const isDisabled = loading || isEmpty;
  const sortLabel = sort === "asc" ? "Oldest" : "Most Recent";

  const handleSort = () => {
    setSort((sort) => (sort === "asc" ? "desc" : "asc"));
  };

  useEffect(() => {
    if (!docs) return;
    const files = docs.docs.map((doc) => ({
      id: doc.id,
      filename: doc.data().filename,
      timestamp: new Date(doc.data().timestamp?.seconds * 1000),
      fullname: doc.data().fullname,
      downloadURL: doc.data().downloadURL,
      size: doc.data().size,
      type: doc.data().type,
    }));
    setFiles(files);
  }, [docs]);

  return (
    <div>
      <div className="flex justify-between my-8">
        <h2 className="font-bold">All Files</h2>
        <Button
          className="disabled:hover:cursor-not-allowed disabled:pointer-events-auto text-xs"
          // disabled={isDisabled}
          size={"sm"}
          variant="outline"
          onClick={handleSort}
        >
          Sort By: {sortLabel}
        </Button>
      </div>
      {loading ? (
        <TableLoading />
      ) : (
        <DataTable columns={Columns} data={files} />
      )}
    </div>
  );
};
