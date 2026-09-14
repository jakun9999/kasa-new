import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center py-10">
      <div className="flex flex-col items-center justify-center gap-10">
        <div className="flex flex-col items-center">
          <h1 className="flex h-35.75 w-85.5 items-center justify-center text-[100px] font-black text-kasa-red">
            404
          </h1>
          <p className="w-85.5 text-center text-body font-normal text-kasa-black">
            Il semble que la page que vous cherchez ait pris des vacances… ou
            n’ait jamais existé.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3.5">
          <Link href="/">
            <Button
              size="long"
              color="red"
              width="w-[200px]"
              height="h-[36px]"
              className="shrink-0 text-body font-medium"
            >
              Accueil
            </Button>
          </Link>
          <Link href="/">
            <Button
              size="long"
              color="red"
              width="w-[200px]"
              height="h-[36px]"
              className="shrink-0 text-body font-medium"
            >
              Logements
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
