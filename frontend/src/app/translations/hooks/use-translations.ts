import {useQuery} from "@tanstack/react-query";

async function fetchTranslations(locales: string[]) {
    const data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/translations?locales=${locales.join(",")}`)
    return data.json()
}

export function useTranslations(locales: string[]) {
    const { data, isLoading } = useQuery({
        queryKey: ["translations"],
        queryFn: () => fetchTranslations(locales),
    })

    return {
        translations: data,
        loading: isLoading,
        error:  !(data && Array.isArray(data)),
    }
}