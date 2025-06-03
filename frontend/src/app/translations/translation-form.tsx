import {DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {FormProvider, useForm} from "react-hook-form";
import * as React from "react";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Translation} from "@/types/models";
import {useLocales} from "@/app/translations/hooks/use-locales";

export function TranslationForm({ translation }: { translation?: Translation }) {

    const { locales } = useLocales()

    const form = useForm({
        defaultValues: translation,
    })

    const inputs = translation ?
        Object.entries(translation)
            .map(([key]) => (
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

    const submit = () => {
        console.log('caca')
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(submit)}>
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
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </form>
        </FormProvider>
    )
}