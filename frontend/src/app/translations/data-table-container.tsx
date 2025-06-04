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

    const tableColumns = [
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