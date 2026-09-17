import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="flex items-center justify-between w-full h-[69.36px] px-10 bg-kasa-white border-t border-kasa-gray-light">
      <Link href="/login">
        <Image
          src="/logos/kasa_logo_picto.svg"
          alt="Logo Kasa"
          width={46}
          height={53}
        />
      </Link>
      <p className="text-kasa-gray-dark text-[12px] font-medium">
        © 2020 Kasa. All rights reserved.
      </p>
    </footer>
  );
}
