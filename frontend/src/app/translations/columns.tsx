"use client"

import {ColumnDef} from "@tanstack/react-table";
import {Checkbox} from "@/components/ui/checkbox";
import {DataTableColumnHeader} from "@/components/custom/data-table-column-header";
import {Translation} from "@/types/models";

export const columns: ColumnDef<Translation>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                className="rounded-full"
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                className="rounded-full"
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "key",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Key" />
        ),
    }
]