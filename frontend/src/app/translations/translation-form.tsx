import {DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {FormProvider, useForm} from "react-hook-form";
import * as React from "react";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Translation} from "@/types/models";
import {Loader2} from "lucide-react";
import {Joi} from "@/types/joi";
import {joiResolver} from "@hookform/resolvers/joi";

interface TranslationFormProps {
    translation?: Translation
    locales: string[]
    onSubmit: (data: Translation) => void
    isLoading?: boolean
    errorMessage?: string
}

export function TranslationForm({
                                    translation,
                                    locales,
                                    onSubmit,
                                    isLoading,
                                    errorMessage }: TranslationFormProps) {

    const defaultValues = React.useMemo(() => {
        const values = translation || {key: ''}
        if (!translation) {
            for (const locale of locales) {
                values[locale] = ''
            }
        }
        return values
    }, [translation, locales])

    const formSchema = React.useMemo(() => {
        const schemaFields: Record<string, any> = {
            key: Joi.string().required(),
        };
        locales.forEach(locale => {
            schemaFields[`translation_id%${locale}`] = Joi.number();
            schemaFields[`content_id%${locale}`] = Joi.number();
            schemaFields[locale] = Joi.string().allow('');
        });
        return Joi.object(schemaFields);
    }, [locales]);

    const form = useForm({
        resolver: joiResolver(formSchema),
        defaultValues,
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
                        <br />
                        {errorMessage && <span className="text-destructive">{errorMessage}</span>}
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