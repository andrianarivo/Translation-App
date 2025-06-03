import {TranslationForm} from "@/app/translations/translation-form";
import {Translation} from "@/types/models";
import {useLocales} from "@/app/translations/hooks/use-locales";
import {useUpdateTranslations} from "@/app/translations/hooks/use-update-translations";
import {useRouter} from "next/navigation";

interface TranslationUpdateContainerProps {
    translation?: Translation
    setIsOpen?: (isOpen: boolean) => void
}

export function TranslationUpdateContainer({ translation, setIsOpen }: TranslationUpdateContainerProps) {
    const { locales } = useLocales()
    const { mutate: updateTranslation, isPending } = useUpdateTranslations()

    const handleSubmit = (data: Translation) => {
        const updateDtos = locales.map(locale => ({
            id: parseInt(data[`content_id%${locale}`]),
            key: data.key,
            value: data[locale],
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
        />
    )
}