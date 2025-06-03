import {useQuery} from "@tanstack/react-query";
import {fetchWrapper} from "@/lib/fetch-wrapper";

async function fetchLocales() {
    return fetchWrapper({
        path: `/translations/locales`,
        method: "GET"
    })
}

export function useLocales(): { locales: string[], loading: boolean, error: boolean } {
    const { data, isLoading } = useQuery({
        queryKey: ["translations/locales"],
        queryFn: fetchLocales
    })

    return {
        locales: data?.length > 0 ? data : ['en-US', 'fr-FR'],
        loading: isLoading,
        error: !(data && Array.isArray(data)),
    }
}