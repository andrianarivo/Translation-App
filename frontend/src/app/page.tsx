import {ArrowRightIcon} from "lucide-react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ImportFilesDialog} from "@/components/import-files-dialog";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-6xl font-light font-sans tracking-wide">Translation App</h1>
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Import your translation files.
          </li>
          <li className="tracking-[-.01em]">
            Update your translations easily.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
              href="/translations"
              rel="noopener noreferrer"
          >
            <Button className="rounded-xl" size="lg">
              Go to translations
              <ArrowRightIcon className="size-4"/>
            </Button>
          </Link>
          <ImportFilesDialog />
        </div>
      </main>
    </div>
  );
}
