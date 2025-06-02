import {useQuery} from "@tanstack/react-query";

async function fetchColumnDefs() {
    const data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/translations/locales`)
    return data.json()
}

export function useLocales() {
    const { data, isLoading } = useQuery({
        queryKey: ["columnDefs"],
        queryFn: fetchColumnDefs
    })

    return {
        locales: data,
        loading: isLoading,
        error: !(data && Array.isArray(data)),
    }
}