import {useQuery} from "@tanstack/react-query";
import {fetchWrapper} from "@/lib/fetch-wrapper";
import {Translation} from "@/types/models";

async function fetchTranslations(locales: string[]) {
    return fetchWrapper({
        path: `/translations?locales=${locales.join(",")}`,
        method: "GET"
    })
}

export function useTranslations(locales: string[]) {
    const { data, isLoading } = useQuery({
        queryKey: ["translations"],
        queryFn: () => fetchTranslations(locales),
        enabled: locales.length > 0,
    })

    return {
        translations: data,
        loading: isLoading,
        error:  !(data && Array.isArray(data)),
    }
}