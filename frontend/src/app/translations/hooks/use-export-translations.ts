import {useQuery} from "@tanstack/react-query";
import {fetchWrapper} from "@/lib/fetch-wrapper";

async function fetchExports(locales: string[]) {
    return fetchWrapper({
        path: `/translations/export?locales=${locales.join(",")}`,
        method: "GET"
    })
}

export function useExportTranslations(locales: string[]) {
    const { data, isLoading } = useQuery({
        queryKey: ["translations/export"],
        queryFn: () => fetchExports(locales),
        enabled: locales.length > 0,
    })

    return {
        exports: data,
        loading: isLoading,
        error: !(data && Array.isArray(data)),
    }
}