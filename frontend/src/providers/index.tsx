import QueryProvider from "@/providers/query-provider"

export function Providers({children}: {children: React.ReactNode}) {
    return <QueryProvider>{children}</QueryProvider>
}