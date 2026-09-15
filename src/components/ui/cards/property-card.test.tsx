import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PropertyCard } from "./property-card";
import { Providers } from "@/context/providers";
import { FAVORITES_STORAGE_KEY } from "@/schemas/favorites-schema";
import type { Property } from "@/schemas/property";

vi.mock("next/image", () => ({
  default: function MockImage({
    alt,
    src,
    className,
  }: {
    alt: string;
    src: string;
    className?: string;
  }) {
    return <img alt={alt} src={src} className={className} />;
  },
}));

vi.mock("next/link", () => ({
  default: function MockLink({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  },
}));

const property: Property = {
  id: "prop-1",
  slug: "appart-cosy",
  title: "Appart cosy",
  location: "Paris",
  price_per_night: 120,
  cover: "/covers/cosy.jpg",
};

async function renderReadyCard() {
  render(
    <Providers>
      <PropertyCard property={property} />
    </Providers>,
  );

  const addButton = await screen.findByRole("button", {
    name: "Ajouter Appart cosy aux favoris",
  });
  await waitFor(() => expect(addButton).toBeEnabled());
  return addButton;
}

describe("PropertyCard — favoris (client)", () => {
  beforeEach(() => {
    localStorage.clear();
    // Session absente → mode visiteur (localStorage), Context prêt.
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ success: false }),
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("ajoute le logement aux favoris au clic (cœur + localStorage)", async () => {
    const user = userEvent.setup();
    const button = await renderReadyCard();

    expect(button).toHaveAttribute("aria-pressed", "false");

    await user.click(button);

    expect(
      screen.getByRole("button", {
        name: "Retirer Appart cosy des favoris",
      }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(localStorage.getItem(FAVORITES_STORAGE_KEY)).toBe(
      JSON.stringify(["prop-1"]),
    );
  });

  it("retire le logement des favoris au second clic", async () => {
    const user = userEvent.setup();
    const button = await renderReadyCard();

    await user.click(button);
    await user.click(
      screen.getByRole("button", {
        name: "Retirer Appart cosy des favoris",
      }),
    );

    expect(
      screen.getByRole("button", {
        name: "Ajouter Appart cosy aux favoris",
      }),
    ).toHaveAttribute("aria-pressed", "false");
    expect(localStorage.getItem(FAVORITES_STORAGE_KEY)).toBeNull();
  });

  it("persiste après un nouveau montage (rechargement simulé)", async () => {
    const user = userEvent.setup();
    const { unmount } = render(
      <Providers>
        <PropertyCard property={property} />
      </Providers>,
    );

    const firstButton = await screen.findByRole("button", {
      name: "Ajouter Appart cosy aux favoris",
    });
    await waitFor(() => expect(firstButton).toBeEnabled());
    await user.click(firstButton);
    unmount();

    render(
      <Providers>
        <PropertyCard property={property} />
      </Providers>,
    );

    const restored = await screen.findByRole("button", {
      name: "Retirer Appart cosy des favoris",
    });
    await waitFor(() => expect(restored).toBeEnabled());
    expect(restored).toHaveAttribute("aria-pressed", "true");
  });

  it("le clic sur le cœur ne navigue pas vers la fiche", async () => {
    const user = userEvent.setup();
    await renderReadyCard();

    const link = screen.getByRole("link");
    const preventDefault = vi.fn();
    link.addEventListener("click", (event) => {
      // Si le bouton laisse buller le clic, ce handler voit un navigation intent.
      if ((event.target as HTMLElement).closest("button")) {
        return;
      }
      preventDefault();
    });

    await user.click(
      screen.getByRole("button", {
        name: "Ajouter Appart cosy aux favoris",
      }),
    );

    expect(preventDefault).not.toHaveBeenCalled();
    expect(localStorage.getItem(FAVORITES_STORAGE_KEY)).toBe(
      JSON.stringify(["prop-1"]),
    );
  });
});
