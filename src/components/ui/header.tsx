"use client";

import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PlusIcon } from "@/components/icons/plus-icon";
import { FavoriteIcon } from "@/components/icons/favorite-icon";
import { MessageIcon } from "@/components/icons/message-icon";
import { MenuIcon } from "@/components/icons/menu-icon";
import { CloseIcon } from "@/components/icons/close-icon";
import { Button } from "@/components/ui/button";

const mobileLinks = [
  { href: "/", label: "Accueil" },
  { href: "/about", label: "À propos" },
  { href: "/messages", label: "Messagerie" },
  { href: "/favoris", label: "Favoris" },
] as const;

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Desktop / tablette assez large : dimensions Figma inchangées (782 × 56). */}
      <header className="hidden lg:flex items-center justify-between w-195.5 h-[56.05px] bg-white shadow-xs px-25 rounded-kasa-cta">
        <div className="flex items-center gap-[49.86px]">
          <div className="flex items-center gap-7">
            <Link href="/" className="text-kasa-black text-body font-normal">
              Accueil
            </Link>
            <Link
              href="/about"
              className="text-kasa-black text-body font-normal"
            >
              À propos
            </Link>
          </div>
          <Image
            src="/logos/kasa_logo_name.svg"
            alt="Logo Kasa"
            width={113.229}
            height={40.0}
          />
          <div className="flex items-center gap-7 text-kasa-red text-body font-normal">
            <Link href="/" className="inline-flex items-center gap-0">
              <PlusIcon className="w-3 h-3" />
              Ajouter un logement
            </Link>
            <div className="flex items-center gap-2">
              <FavoriteIcon
                className="w-4 h-4"
                pathClassName="fill-kasa-white stroke-kasa-red"
              />
              <span className="border-kasa-red border-l h-1.25"></span>
              <MessageIcon
                className="w-4 h-4"
                pathClassName="fill-kasa-white stroke-kasa-red"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile : barre en flux + panneau en overlay (ne pousse pas la page). */}
      <header className="relative z-50 flex w-full flex-col bg-white shadow-xs lg:hidden">
        <div className="flex h-[85.36px] items-center justify-between px-4">
          <Link href="/" onClick={() => setOpen(false)}>
            <Image
              src="/logos/kasa_logo_picto.svg"
              alt="Logo Kasa"
              width={46.04}
              height={53.36}
              priority
            />
          </Link>
          <button
            type="button"
            className="flex size-[45.88px] items-center justify-center text-kasa-gray-dark"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((current) => !current)}
          >
            {open ? (
              <CloseIcon className="size-[45.88px] text-kasa-black!" />
            ) : (
              <MenuIcon className="size-[45.88px]" />
            )}
          </button>
        </div>
        {open ? (
          <nav
            id="menu-mobile"
            className="absolute inset-x-0 top-full z-50 flex flex-col bg-white px-5 pb-6 pt-9 shadow-xs"
          >
            <div className="flex flex-col gap-7">
              {mobileLinks.map((item, index) => (
                <Fragment key={item.href}>
                  {index > 0 ? (
                    <div
                      className="h-px w-full bg-kasa-gray-light"
                      aria-hidden
                    />
                  ) : null}
                  <Link
                    href={item.href}
                    className="text-h2 font-normal text-kasa-black"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </Fragment>
              ))}
            </div>
            <div className="pt-10">
              <Link href="/" onClick={() => setOpen(false)}>
                <Button size="long" color="red" className="">
                  Ajouter un logement
                </Button>
              </Link>
            </div>
          </nav>
        ) : null}
      </header>
    </>
  );
}
