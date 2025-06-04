interface FetchWrapperProps {
    path: string;
    body?: FormData | string;
    method?: string;
    headers?: HeadersInit;
}

export function fetchWrapper({ path, body, method, headers }: FetchWrapperProps) {
    return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`, {
        method,
        body,
        headers,
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => data)
        .catch(error => {
            throw new Error(`Request failed: ${error.message}`);
        })
}