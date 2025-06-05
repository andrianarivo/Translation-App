import {useMutation, useQueryClient} from "@tanstack/react-query";
import {fetchWrapper} from "@/lib/fetch-wrapper";

async function generateTranslations() {
    return fetchWrapper({
        path: `/translations/generate`,
        method: "POST"
    })
}

export function useGenerateTranslations() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["POST/translations/generate"],
        mutationFn: generateTranslations,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['translations'] })
        }
    })
}