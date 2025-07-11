import {TranslationForm} from "@/app/translations/translation-form";
import {Translation} from "@/types/models";
import {useLocales} from "@/app/translations/hooks/use-locales";
import {useUpdateTranslations} from "@/app/translations/hooks/use-update-translations";

interface TranslationUpdateContainerProps {
    translation?: Translation
    setIsOpen?: (isOpen: boolean) => void
}

export function TranslationUpdateContainer({ translation, setIsOpen }: TranslationUpdateContainerProps) {
    const { locales } = useLocales()
    const { mutate: updateTranslation, isPending, error } = useUpdateTranslations()

    const handleSubmit = (data: Translation) => {
        const updateDtos = locales.map(locale => ({
            id: data[`content_id%${locale}`] as number,
            key: data.key,
            value: data[locale] as string,
            locale,
        }))
        updateTranslation(updateDtos, {
            onSuccess: () => {
                setIsOpen?.(false)
            }
        })
    }

    return (
        <TranslationForm
            onSubmit={handleSubmit}
            isLoading={isPending}
            translation={translation}
            locales={locales}
            errorMessage={error?.message}
        />
    )
}