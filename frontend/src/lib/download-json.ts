export function downloadJson(data: Record<string, object | string | number | boolean | null>, filename: string = 'data.json'){
    try {
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
            JSON.stringify(data, null, 2)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = filename;

        link.click();
    } catch (error) {
        console.error('Error downloading JSON file:', error);
    }
}
