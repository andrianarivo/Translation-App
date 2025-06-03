import {DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {FormProvider, useForm} from "react-hook-form";
import * as React from "react";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Translation} from "@/types/models";
import {Loader2} from "lucide-react";

interface TranslationFormProps {
    translation?: Translation
    locales: string[]
    onSubmit: (data: Translation) => void
    isLoading?: boolean
}

export function TranslationForm({ translation, locales, onSubmit, isLoading }: TranslationFormProps) {

    const form = useForm({
        defaultValues: translation,
    })

    const inputs = translation ?
        Object.entries(translation)
            .map(([key]) => (key === "key" || locales.includes(key)) && (
                <FormField
                    control={form.control}
                    name={key}
                    key={key}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>{key}</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )) :
        locales
            .map((locale) => (
                <FormField
                    control={form.control}
                    name={locale}
                    key={locale}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>{locale}</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
        ))

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <DialogHeader>
                    <DialogTitle>{translation ? "Edit" : "Create" } translation</DialogTitle>
                    <DialogDescription>
                        Don't forget to save your changes.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    { !translation && (
                        <FormField
                            control={form.control}
                            name="key"
                            key="key"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>key</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    {inputs}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={isLoading || !form.formState.isDirty}>
                        {isLoading ?
                            <><Loader2 className="animate-spin" /> Saving...</> :
                            <>Save changes</>}
                    </Button>
                </DialogFooter>
            </form>
        </FormProvider>
    )
}