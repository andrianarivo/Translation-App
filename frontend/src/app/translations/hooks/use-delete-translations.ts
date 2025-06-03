import {useMutation, useQueryClient} from "@tanstack/react-query";
import {fetchWrapper} from "@/lib/fetch-wrapper";

async function deleteTranslations(data: string[]) {
    return fetchWrapper({
        path: `/translations/contents?keys=${data.join(",")}`,
        method: "DELETE"
    })
}

export function useDeleteTranslations() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["translations/contents"],
        mutationFn: deleteTranslations,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['translations'] }),
    })
}