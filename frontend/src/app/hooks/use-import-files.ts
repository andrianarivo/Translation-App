import {useMutation} from "@tanstack/react-query";
import {fetchWrapper} from "@/lib/fetch-wrapper";

async function importFiles(data: { files: FileList}) {
    const formData = new FormData()
    Object.entries(data.files).forEach(([_, file]) => {
        formData.append("files", file)
    })

    return fetchWrapper({
        path: "/translations/import",
        method: "POST",
        body: formData
    })
}

export function useImportFiles() {
    return useMutation({
        mutationKey: ["translations/import"],
        mutationFn: importFiles,
    })
}