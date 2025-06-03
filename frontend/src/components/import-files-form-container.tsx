"use client"

import * as React from 'react'
import {ImportFilesForm} from "@/components/import-files-form";
import {useImportFiles} from "@/app/hooks/use-import-files";
import {useParseFiles} from "@/app/hooks/use-parse-files";
import {TranslationFile} from "@/types/models";
import { useRouter } from 'next/navigation'

export function ImportFilesFormContainer() {
    const {mutate: importFiles, isPending: isImporting} = useImportFiles()
    const {mutate: parseFiles, isPending: isParsing} = useParseFiles()
    const [loadingMessage, setLoadingMessage] = React.useState("Loading...");
    const router = useRouter();

    const handleSubmit = (data: {files: FileList}) => {
        setLoadingMessage("Importing files...");
        importFiles(data, {
            onSuccess: ({ data }: { data: TranslationFile[] }) => {
                if (data) {
                    setLoadingMessage("Parsing files...");
                    parseFiles(data.map(item => item.id), {
                        onSettled: () => {
                            router.push("/translations")
                        }
                    })
                }
            }
        })
    }

    return (
        <ImportFilesForm
            onSubmit={handleSubmit}
            isLoading={isImporting || isParsing}
            loadingMessage={loadingMessage}
        />
    )
}