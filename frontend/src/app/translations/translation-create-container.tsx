import {TranslationForm} from "@/app/translations/translation-form";
import {Translation} from "@/types/models";
import {useLocales} from "@/app/translations/hooks/use-locales";
import {useCreateTranslations} from "@/app/translations/hooks/use-create-translation";

export function TranslationCreateContainer({ setIsOpen }: { setIsOpen?: (isOpen: boolean) => void }) {
    const { locales } = useLocales()
    const { mutate: createTranslation, isPending, error } = useCreateTranslations()

    const handleSubmit = (data: Translation) => {
        const createDtos = locales.map(locale => ({
            id: data[`content_id%${locale}`],
            key: data.key,
            value: data[locale] as string,
            locale,
        }))
        createTranslation(createDtos, {
            onSuccess: () => {
                setIsOpen?.(false)
            }
        })
    }

    return (
        <TranslationForm
            onSubmit={handleSubmit}
            isLoading={isPending}
            locales={locales}
            errorMessage={error?.message}
        />
    )
}