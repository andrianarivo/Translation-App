import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { TableRowSkeleton } from "@/components/skeletons/table-row-skeleton"
import {Checkbox} from "@/components/ui/checkbox";

export function TranslationTableSkeleton() {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            <Checkbox className="rounded-full" />
                        </TableHead>
                        <TableHead>Key</TableHead>
                        <TableHead>fr-FR</TableHead>
                        <TableHead>en-US</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="bg-white">
                    <TableRowSkeleton />
                    <TableRowSkeleton />
                    <TableRowSkeleton />
                    <TableRowSkeleton />
                    <TableRowSkeleton />
                </TableBody>
            </Table>
        </div>
    )
}