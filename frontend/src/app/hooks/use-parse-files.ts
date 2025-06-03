import {useMutation} from "@tanstack/react-query";
import {fetchWrapper} from "@/lib/fetch-wrapper";

async function parseFiles(data: number[]) {
    return fetchWrapper({
        path: `/translations/parse?ids=${data.join(",")}`,
        method: "GET"
    });
}

export function useParseFiles() {
    return useMutation({
        mutationKey: ["translations/parse"],
        mutationFn: parseFiles,
    })
}