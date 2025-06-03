export interface Translation {
    key: string,
    [key: string]: string,
}

export interface TranslationFilesInput {
    files: File[],
}

export interface TranslationFile {
    id: number,
    filename: string,
    content: string,
}