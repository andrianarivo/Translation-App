import {Table} from "@tanstack/react-table";
import {Button} from "@/components/ui/button";
import {Loader2, Trash2} from "lucide-react";
import * as React from "react";
import {useDeleteTranslations} from "@/app/translations/hooks/use-delete-translations";
import {Translation} from "@/types/models";

export function DeleteTranslations<TData>({
                                                    table,
                                                }: {
    table: Table<TData>
}) {
    const { mutate: deleteTranslations, isPending } = useDeleteTranslations()

    const handleClick = () => {
        const keys = table.getFilteredSelectedRowModel().rows.map(row=> (row.original as Translation).key)
        deleteTranslations(keys, {
            onSettled: () => table.resetRowSelection(),
        })
    }

    return (
        table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button size="sm" onClick={handleClick}>
                {isPending ?
                    (<><Loader2 className="animate-spin"/> Removing...</>) :
                    (<><Trash2 />Remove ({table.getFilteredSelectedRowModel().rows.length})</>)
                }
            </Button>
        )
    )
}