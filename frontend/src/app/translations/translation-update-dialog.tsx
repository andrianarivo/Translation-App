import {
    Dialog,
    DialogContent,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Edit2} from "lucide-react";
import * as React from "react";
import {Translation} from "@/types/models";
import {TranslationForm} from "@/app/translations/translation-form";

export function TranslationUpdateDialog({ translation }: { translation: Translation }) {

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="text-muted-foreground" variant="ghost" size="icon"><Edit2 /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <TranslationForm translation={translation} />
            </DialogContent>
        </Dialog>
    )
}