"use client";
import { FileType } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import prettyBytes from "pretty-bytes";
import { FileIcon, defaultStyles } from "react-file-icon";

export const FileColorMap = {
  doc: "#2B579a",
  docx: "#2B579a",
  jpg: "d4af37",
  mp4: "#e74c3c",
  pdf: "#0160FE",
  png: "#4fb6f4",
  ppt: "#b7472a",
  pptx: "#b7472a",
  xls: "#217346",
  xlsx: "#217346",
};

export const TableColumns: ColumnDef<FileType>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ renderValue, ...props }) => {
      const type = renderValue<string>();
      const extension = type.split("/")[1];
      const colorMapKey = extension as keyof typeof FileColorMap;
      return (
        <div className="w-10">
          <FileIcon
            extension={extension}
            labelColor={FileColorMap[colorMapKey] || "#000"}
            {...defaultStyles[extension as keyof typeof defaultStyles]}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "filename",
    header: "Filename",
  },
  {
    accessorKey: "timestamp",
    header: "Date Added",
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ renderValue, ...props }) => {
      return <span>{prettyBytes(renderValue<number>())}</span>;
    },
  },
  {
    accessorKey: "downloadURL",
    header: "Actions",
  },
];
