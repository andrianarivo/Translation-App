import {Button} from "@/components/ui/button"
import {Dialog, DialogContent, DialogTrigger,} from "@/components/ui/dialog"
import {ImportFilesFormContainer} from "@/components/import-files-form-container";

export function ImportFilesDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="rounded-xl" size="lg" variant="outline">
                    Import files
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <ImportFilesFormContainer />
            </DialogContent>
        </Dialog>
    )
}
