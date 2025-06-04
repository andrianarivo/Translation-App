import {fetchWrapper} from "@/lib/fetch-wrapper";
import {useMutation, useQueryClient} from "@tanstack/react-query";

async function updateTranslations(data: {id: number, key: string, value: string, locale: string}[]) {
    return fetchWrapper({
        path: `/translations/contents`,
        headers: {
            'Content-Type': 'application/json'
        },
        method: "PUT",
        body: JSON.stringify(data)
    })
}

export function useUpdateTranslations() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["PUT/translations/contents"],
        mutationFn: updateTranslations,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['translations'] }),
    })
}