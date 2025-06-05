import {Brain, Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";
import * as React from "react";
import {useGenerateTranslations} from "@/app/translations/hooks/use-generate-translations";

export function TranslationGenerate() {
    const { mutate: generateTranslation, isPending } = useGenerateTranslations();
    const handleClick = () => {
        generateTranslation()
    }
    return (
    <Button variant="secondary" size="sm" onClick={handleClick}>
        {isPending ?
            <><Loader2 className="animate-spin" /> Generating...</> :
            <><Brain /> Auto fill</>
        }
    </Button>
    )
}