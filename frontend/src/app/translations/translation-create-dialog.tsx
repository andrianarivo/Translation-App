import {
    Dialog,
    DialogContent,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Edit2, PlusIcon} from "lucide-react";
import * as React from "react";
import {TranslationCreateContainer} from "@/app/translations/translation-create-container";

export function TranslationCreateDialog() {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <PlusIcon /> Add
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <TranslationCreateContainer setIsOpen={setIsOpen} />
            </DialogContent>
        </Dialog>
    )
}