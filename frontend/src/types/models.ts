export interface Translation {
    key: string,
    [key: string]: string | number,
}

export interface TranslationFile {
    id: number,
    filename: string,
    content: string,
}

export interface TranslationInput {
    id: number,
    key: string,
    value: string,
}