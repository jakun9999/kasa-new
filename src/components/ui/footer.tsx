import Image from "next/image";

export function Footer() {
  return (
    <footer className="flex items-center justify-between w-full h-[69.36px] px-10 bg-kasa-white border-t border-kasa-gray-light">
      <Image
        src="/logos/kasa_logo_picto.svg"
        alt="Logo Kasa"
        width={46.04}
        height={53.36}
      />
      <p className="text-kasa-gray-dark text-[12px] font-medium">
        © 2020 Kasa. All rights reserved.
      </p>
    </footer>
  );
}
