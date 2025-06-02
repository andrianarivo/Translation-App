"use client"

import {TranslationTable} from "@/app/translations/data-table";
import {columns} from "@/app/translations/columns";
import {TranslationTableSkeleton} from "@/components/skeletons/translation-table-skeleton";
import {useTranslations} from "@/app/translations/hooks/use-translations";
import {useLocales} from "@/app/translations/hooks/use-locales";
import {HeaderContext} from "@tanstack/react-table";
import {DataTableColumnHeader} from "@/components/custom/data-table-column-header";
import * as React from "react";

export function TranslationTableContainer() {
    const { locales, loading: isLoadingLocales, error } = useLocales()
    const { translations, loading: isLoadingTranslations } = useTranslations(locales)

    const localesColumns = !error ? locales.map((locale: string) => ({
        accessorKey: locale,
        header: ({ column }: HeaderContext<Translation, unknown>) => (
            <DataTableColumnHeader column={column} title={locale} />
        )
    })) : []

    let tableColumns = [
        ...columns,
        ...localesColumns,
        {
            accessorKey: "actions",
            header: "Actions"
        }
    ]

    if (isLoadingTranslations || isLoadingLocales) return (
        <TranslationTableSkeleton />
    )

    return (
        <TranslationTable columns={tableColumns} data={translations || []} />
    )
}