import {
    Dialog,
    DialogContent,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Edit2} from "lucide-react";
import * as React from "react";
import {Translation} from "@/types/models";
import {TranslationUpdateContainer} from "@/app/translations/translation-update-container";

export function TranslationUpdateDialog({ translation }: { translation: Translation }) {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="text-muted-foreground" variant="ghost" size="icon"><Edit2 /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <TranslationUpdateContainer translation={translation} setIsOpen={setIsOpen} />
            </DialogContent>
        </Dialog>
    )
}