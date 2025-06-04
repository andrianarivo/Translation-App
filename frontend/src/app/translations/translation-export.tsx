import {Button} from "@/components/ui/button";
import {DownloadIcon, Loader2} from "lucide-react";
import * as React from "react";
import {useExportTranslations} from "@/app/translations/hooks/use-export-translations";
import {useLocales} from "@/app/translations/hooks/use-locales";
import {downloadJson} from "@/lib/download-json";

export function TranslationExport() {
    const {locales} =  useLocales();
    const { exports, loading} =  useExportTranslations(locales)

    const handleClick = () => {
        if (exports) {
            exports.forEach((data: Record<string, Record<string, object | string | number | boolean | null>>) => {
                const locale = Object.keys(data)[0]
                console.log(locale)
                const keyValuePairs = data[locale]
                downloadJson(keyValuePairs, `${locale}.json`)
            })
        }
    }

    return (
        <Button size="sm" variant="outline" disabled={loading} onClick={handleClick}>
            {
                loading ?
                    (<><Loader2 className="animate-spin" /> Exporting...</>) :
                    (<><DownloadIcon /> Export</>)
            }
        </Button>
    )
}