"use client";

import { Fragment, Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { PlusIcon } from "@/components/icons/plus-icon";
import { FavoriteIcon } from "@/components/icons/favorite-icon";
import { MessageIcon } from "@/components/icons/message-icon";
import { MenuIcon } from "@/components/icons/menu-icon";
import { CloseIcon } from "@/components/icons/close-icon";
import { Button } from "@/components/ui/button";

const FAVORITES_HREF = "/?favoris=1";

const mobileLinks = [
  { href: "/", label: "Accueil", kind: "home" },
  { href: "/about", label: "À propos", kind: "path" },
  { href: "/messages", label: "Messagerie", kind: "path" },
  { href: FAVORITES_HREF, label: "Favoris", kind: "favorites" },
] as const;

function pathIsActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function menuLinkClass(active: boolean, extra: string) {
  return `${extra} ${
    active
      ? "font-bold text-kasa-red"
      : "font-normal text-kasa-black hover:font-bold hover:text-kasa-red"
  }`;
}

function iconPathClass(active: boolean) {
  return active
    ? "fill-kasa-red stroke-kasa-red"
    : "fill-kasa-white stroke-kasa-red group-hover:fill-kasa-red";
}

function HeaderNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const showFavorites = searchParams.get("favoris") === "1";
  const homeActive = pathname === "/" && !showFavorites;
  const favorisActive = pathname === "/" && showFavorites;
  const messagesActive = pathIsActive(pathname, "/messages");

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

  function mobileLinkActive(kind: (typeof mobileLinks)[number]["kind"], href: string) {
    if (kind === "home") {
      return homeActive;
    }
    if (kind === "favorites") {
      return favorisActive;
    }
    return pathIsActive(pathname, href);
  }

  return (
    <>
      {/* Desktop / tablette assez large : dimensions Figma inchangées (782 × 56). */}
      <header className="hidden h-[56.05px] w-195.5 items-center justify-between rounded-kasa-cta bg-white px-25 shadow-xs lg:flex">
        <div className="flex items-center gap-[49.86px]">
          <div className="flex items-center gap-7">
            <Link
              href="/"
              className={menuLinkClass(homeActive, "text-body")}
              aria-current={homeActive ? "page" : undefined}
            >
              Accueil
            </Link>
            <Link
              href="/about"
              className={menuLinkClass(
                pathIsActive(pathname, "/about"),
                "text-body",
              )}
              aria-current={
                pathIsActive(pathname, "/about") ? "page" : undefined
              }
            >
              À propos
            </Link>
          </div>
          <Link href="/login">
            <Image
              src="/logos/kasa_logo_name.svg"
              alt="Logo Kasa"
              width={113.229}
              height={40.0}
              className="h-10 w-auto"
              priority
              loading="eager"
            />
          </Link>

          <div className="flex items-center gap-7 text-body text-kasa-red">
            <Link
              href="/"
              className="inline-flex items-center gap-0 font-normal hover:font-bold"
            >
              <PlusIcon className="h-3 w-3" />
              Ajouter un logement
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href={FAVORITES_HREF}
                aria-label="Favoris"
                aria-current={favorisActive ? "page" : undefined}
                className="group"
              >
                <FavoriteIcon
                  className="h-4 w-4"
                  pathClassName={iconPathClass(favorisActive)}
                />
              </Link>
              <span className="h-1.25 border-l border-kasa-red"></span>
              <Link
                href="/messages"
                aria-label="Messagerie"
                aria-current={messagesActive ? "page" : undefined}
                className="group"
              >
                <MessageIcon
                  className="h-4 w-4"
                  pathClassName={iconPathClass(messagesActive)}
                />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile : barre en flux + panneau en overlay (ne pousse pas la page). */}
      <header className="relative z-50 flex w-full flex-col bg-white shadow-xs lg:hidden">
        <div className="flex h-[85.36px] items-center justify-between px-4">
          <Link href="/login" onClick={() => setOpen(false)}>
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
            className="absolute inset-x-0 top-full z-50 flex flex-col bg-white px-5 pt-9 pb-6 shadow-xs"
          >
            <div className="flex flex-col gap-7">
              {mobileLinks.map((item, index) => {
                const active = mobileLinkActive(item.kind, item.href);
                return (
                  <Fragment key={item.href}>
                    {index > 0 ? (
                      <div
                        className="h-px w-full bg-kasa-gray-light"
                        aria-hidden
                      />
                    ) : null}
                    <Link
                      href={item.href}
                      className={menuLinkClass(active, "text-h2")}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </Fragment>
                );
              })}
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

/** Header wrappé : `useSearchParams` exige une boundary Suspense. */
export default function Header() {
  return (
    <Suspense
      fallback={
        <header className="h-[85.36px] w-full bg-white shadow-xs lg:h-[56.05px] lg:w-195.5 lg:rounded-kasa-cta" />
      }
    >
      <HeaderNav />
    </Suspense>
  );
}
