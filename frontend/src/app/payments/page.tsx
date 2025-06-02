import { columns, Payment } from "./columns"
import { PaymentTable } from "./data-table"

export const payments: Payment[] = [
    {
        id: "728ed52f",
        amount: 100,
        status: "pending",
        email: "m@example.com",
    },
    {
        id: "489e1d42",
        amount: 125,
        status: "processing",
        email: "example@gmail.com",
    },
    // ...
]

async function getData(): Promise<Payment[]> {
    // Fetch data from your API here.
    return payments
}

export default async function Payments() {
    const data = await getData()

    return (
        <div className="container mx-auto py-10">
            <PaymentTable columns={columns} data={data} />
        </div>
    )
}