"use client"

import {TranslationTable} from "@/app/translations/data-table";
import {columns} from "@/app/translations/columns";
import {TranslationTableSkeleton} from "@/components/skeletons/translation-table-skeleton";
import {useTranslations} from "@/app/translations/hooks/use-translations";
import {useLocales} from "@/app/translations/hooks/use-locales";
import {CellContext, HeaderContext} from "@tanstack/react-table";
import {DataTableColumnHeader} from "@/components/custom/data-table-column-header";
import * as React from "react";
import {Translation} from "@/types/models";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Edit2} from "lucide-react";
import {TranslationUpdateDialog} from "@/app/translations/translation-update-dialog";

export function TranslationTableContainer() {
    const { locales, loading: isLoadingLocales, error } = useLocales()
    const { translations, loading: isLoadingTranslations } = useTranslations(locales)

    const localesColumns = !error ? locales.map((locale: string) => ({
        accessorKey: locale,
        header: ({ column }: HeaderContext<Translation, unknown>) => (
            <DataTableColumnHeader column={column} title={locale} />
        ),
    })) : []

    let tableColumns = [
        ...columns,
        ...localesColumns,
        {
            accessorKey: "actions",
            header: "Actions",
            cell: ({ row }: CellContext<Translation, unknown>) => (
                <TranslationUpdateDialog translation={row.original}/>
            )
        }
    ]

    if (isLoadingTranslations || isLoadingLocales) return (
        <TranslationTableSkeleton />
    )

    return (
        <TranslationTable columns={tableColumns} data={translations || []} />
    )
}