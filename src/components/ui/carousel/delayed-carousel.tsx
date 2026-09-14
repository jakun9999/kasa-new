import { Carousel } from "./carousel";

type DelayedCarouselProps = {
  images: string[];
  alt: string;
};

/**
 * Wrapper serveur : délai de 2 s en `next dev` pour démontrer le skeleton en soutenance.
 */
export async function DelayedCarousel({ images, alt }: DelayedCarouselProps) {
  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return <Carousel images={images} alt={alt} />;
}
