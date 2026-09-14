import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Carousel } from "./carousel";
import { getThumbnailIndices } from "./carousel-utils";

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

const threeImages = [
  "/photos/one.jpg",
  "/photos/two.jpg",
  "/photos/three.jpg",
] as const;

const tenImages = Array.from(
  { length: 10 },
  (_, index) => `/photos/${index + 1}.jpg`,
);

describe("getThumbnailIndices", () => {
  it("renvoie les 4 photos suivantes pour 10 photos à l’index 0", () => {
    expect(getThumbnailIndices(0, 10)).toEqual([1, 2, 3, 4]);
  });

  it("décale les miniatures avec l’index courant", () => {
    expect(getThumbnailIndices(1, 10)).toEqual([2, 3, 4, 5]);
  });

  it("boucle en fin de liste", () => {
    expect(getThumbnailIndices(9, 10)).toEqual([0, 1, 2, 3]);
  });
});

describe("Carousel", () => {
  it("affiche la grande photo 1 et les miniatures 2 à 5 pour 10 photos", () => {
    render(<Carousel images={tenImages} alt="Loft Paris" />);

    const main = within(screen.getByLabelText("Photo principale"));
    const thumbs = within(screen.getByLabelText("Miniatures"));

    expect(main.getByAltText("Loft Paris — photo 1")).toBeVisible();
    expect(thumbs.getByAltText("Loft Paris — photo 2")).toBeVisible();
    expect(thumbs.getByAltText("Loft Paris — photo 3")).toBeVisible();
    expect(thumbs.getByAltText("Loft Paris — photo 4")).toBeVisible();
    expect(thumbs.getByAltText("Loft Paris — photo 5")).toBeVisible();
    expect(
      thumbs.queryByAltText("Loft Paris — photo 6"),
    ).not.toBeInTheDocument();
    expect(screen.getByText("1/10")).toBeInTheDocument();
  });

  it("décale grande image et miniatures au clic sur suivant", async () => {
    const user = userEvent.setup();
    render(<Carousel images={tenImages} alt="Loft Paris" />);

    await user.click(screen.getByRole("button", { name: "Image suivante" }));

    const main = within(screen.getByLabelText("Photo principale"));
    const thumbs = within(screen.getByLabelText("Miniatures"));

    expect(main.getByAltText("Loft Paris — photo 2")).toBeVisible();
    expect(thumbs.getByAltText("Loft Paris — photo 3")).toBeVisible();
    expect(thumbs.getByAltText("Loft Paris — photo 4")).toBeVisible();
    expect(thumbs.getByAltText("Loft Paris — photo 5")).toBeVisible();
    expect(thumbs.getByAltText("Loft Paris — photo 6")).toBeVisible();
    expect(screen.getByText("2/10")).toBeInTheDocument();
  });

  it("passe à la photo suivante au clic", async () => {
    const user = userEvent.setup();
    render(<Carousel images={[...threeImages]} alt="Loft Paris" />);

    await user.click(screen.getByRole("button", { name: "Image suivante" }));

    expect(screen.getByText("2/3")).toBeInTheDocument();
  });

  it("boucle de la dernière photo vers la première", async () => {
    const user = userEvent.setup();
    render(<Carousel images={[...threeImages]} alt="Loft Paris" />);

    const next = screen.getByRole("button", { name: "Image suivante" });
    await user.click(next);
    await user.click(next);
    await user.click(next);

    expect(screen.getByText("1/3")).toBeInTheDocument();
  });

  it("boucle de la première photo vers la dernière", async () => {
    const user = userEvent.setup();
    render(<Carousel images={[...threeImages]} alt="Loft Paris" />);

    await user.click(screen.getByRole("button", { name: "Image précédente" }));

    expect(screen.getByText("3/3")).toBeInTheDocument();
  });

  it("navigue au clavier avec les flèches", async () => {
    const user = userEvent.setup();
    render(<Carousel images={[...threeImages]} alt="Loft Paris" />);

    const region = screen.getByRole("region", { name: "Photos — Loft Paris" });
    region.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByText("2/3")).toBeInTheDocument();

    await user.keyboard("{ArrowLeft}");
    expect(screen.getByText("1/3")).toBeInTheDocument();
  });

  it("place les flèches en overlay sur la galerie", () => {
    render(<Carousel images={[...threeImages]} alt="Loft Paris" />);

    const region = screen.getByRole("region", { name: "Photos — Loft Paris" });
    const prev = within(region).getByRole("button", {
      name: "Image précédente",
    });
    const next = within(region).getByRole("button", { name: "Image suivante" });

    expect(prev).toHaveClass("justify-self-start", "lg:left-4");
    expect(next).toHaveClass("justify-self-end", "lg:right-4");
  });

  it("n’affiche ni flèches ni compteur s’il n’y a qu’une image", () => {
    render(<Carousel images={["/photos/one.jpg"]} alt="Studio" />);

    expect(screen.getByAltText("Studio — photo 1")).toBeVisible();
    expect(
      screen.queryByRole("button", { name: "Image suivante" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Image précédente" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("1/1")).not.toBeInTheDocument();
    expect(screen.queryByAltText("Studio — photo 2")).not.toBeInTheDocument();
  });

  it("ne rend rien sans image", () => {
    const { container } = render(<Carousel images={[]} alt="Vide" />);

    expect(container).toBeEmptyDOMElement();
  });
});
