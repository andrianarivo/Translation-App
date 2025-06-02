import { TableCell, TableRow } from "@/components/ui/table"

export function TableRowSkeleton() {
  return (
    <TableRow className="border-b border-gray-100 last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
      {/* Select circle */}
      <TableCell>
          <div className="h-4 w-4 rounded-full bg-gray-100"></div>
      </TableCell>
      {/* Key */}
      <TableCell className="whitespace-nowrap px-3 ">
        <div className="h-6 w-16 rounded bg-gray-100"></div>
      </TableCell>
      {/* fr-FR */}
      <TableCell className="whitespace-nowrap px-3 ">
        <div className="h-6 w-32 rounded bg-gray-100"></div>
      </TableCell>
      {/* en-US */}
      <TableCell className="whitespace-nowrap px-3 ">
        <div className="h-6 w-32 rounded bg-gray-100"></div>
      </TableCell>
      {/* Actions */}
      <TableCell className="whitespace-nowrap  pl-6 pr-3">
        <div className="flex flex-col justify-center gap-1">
            <div className="w-1 h-1 rounded-full bg-gray-300"></div>
            <div className="w-1 h-1 rounded-full bg-gray-300"></div>
            <div className="w-1 h-1 rounded-full bg-gray-300"></div>
        </div>
      </TableCell>
    </TableRow>
  )
}