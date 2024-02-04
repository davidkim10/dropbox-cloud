"use client";
import { DownloadIcon, EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { FileType } from "@/types";
import { useAppStore } from "@/lib/store";

interface DataTableProps {
  columns: ColumnDef<FileType, keyof FileType>[];
  data: FileType[];
}

export function DataTable<FileUpload, TValue>({
  columns,
  data,
}: DataTableProps) {
  const [setIsDeleteModalOpen, setIsRenameModalOpen, setFilename, setFileId] =
    useAppStore((state) => [
      state.setIsDeleteModalOpen,
      state.setIsRenameModalOpen,
      state.setFilename,
      state.setFileId,
    ]);

  const openDeleteModal = (id: string) => {
    setFileId(id);
    setIsDeleteModalOpen(true);
  };

  const openRenameModal = (id: string, filename: string) => {
    console.log("oepn rename modal", filename);
    setFileId(id);
    setFilename(filename);
    setIsRenameModalOpen(true);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const { filename, id, timestamp, downloadURL } = row.original;
              const date = new Date(timestamp);
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {
                    switch (cell.column.id) {
                      case "timestamp":
                        return (
                          <TableCell key={cell.id}>
                            <div className="flex flex-col gap-1">
                              <span>{date.toLocaleDateString()}</span>
                              <span className="text-gray-500 text-xs">
                                {date.toLocaleTimeString()}
                              </span>
                            </div>
                          </TableCell>
                        );
                      case "downloadURL":
                        return (
                          <TableCell key={cell.id}>
                            <div className="flex gap-2">
                              <Button
                                size={"sm"}
                                variant={"outline"}
                                onClick={() => openRenameModal(id, filename)}
                              >
                                <PencilIcon size={16} />
                              </Button>

                              <Button variant={"outline"} size={"sm"} asChild>
                                <a href={downloadURL} target="_blank">
                                  <EyeIcon size={16} />
                                </a>
                              </Button>

                              <Button
                                size={"sm"}
                                variant={"outline"}
                                onClick={() => openDeleteModal(id)}
                              >
                                <TrashIcon size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        );
                      default:
                        return (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                    }
                  })}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Upload your first file to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
