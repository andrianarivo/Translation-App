import {fetchWrapper} from "@/lib/fetch-wrapper";
import {useMutation, useQueryClient} from "@tanstack/react-query";

async function createTranslations(data: {key: string, value: string, locale: string}[]) {
    return fetchWrapper({
        path: `/translations/contents`,
        headers: {
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(data)
    })
}

export function useCreateTranslations() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["POST/translations/contents"],
        mutationFn: createTranslations,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['translations'] }),
    })
}