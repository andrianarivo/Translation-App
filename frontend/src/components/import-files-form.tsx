"use client"

import {DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {joiResolver} from "@hookform/resolvers/joi";
import {Joi} from "@/types/joi";
import {Loader2} from "lucide-react";

interface ImportFilesFormProps {
    onSubmit: (data: { files: FileList }) => void
    isLoading?: boolean
    loadingMessage?: string
}

const formSchema = Joi.object({
    files: Joi.filelist(),
})

export function ImportFilesForm({ onSubmit, isLoading = false, loadingMessage = "Importing files..." }: ImportFilesFormProps) {
    const form = useForm<{ files: FileList }>({
        resolver: joiResolver(formSchema),
        defaultValues: {
            files: undefined,
        },
    })

    const files = form.watch("files")

    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
                <DialogTitle>Import translation files</DialogTitle>
                <DialogDescription>
                    {files ? "Your files: " : "Select the files you want to import."}
                </DialogDescription>
                {files && (
                    <ul className="list-disc pl-4 pb-2 text-muted-foreground text-sm">
                    {
                        files && (Object.entries(files).map(([_, value]) =>
                            <li key={value.name}>{value.name}</li>
                        ))
                    }
                    </ul>
                )}
            </DialogHeader>
            <div className="grid gap-4">
                <div className="grid gap-3">
                    <FormField
                        control={form.control}
                        name="files"
                        render={({field: {value, onChange, ...fieldProps}}) => (
                            <FormItem>
                                <FormLabel>Files: </FormLabel>
                                <FormControl>
                                    <Input
                                        {...fieldProps}
                                        placeholder="Select files"
                                        type="file"
                                        accept="application/json"
                                        multiple
                                        onChange={(event) =>
                                            onChange(event.target.files && event.target.files)
                                        }
                                    />
                                </FormControl>
                                <FormDescription>
                                    I18n files are in JSON format.
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin" size={8}/>
                            <span>{loadingMessage}</span>
                        </>
                    ) : "Start import"}
                </Button>
            </DialogFooter>
        </form>
    </Form>
}