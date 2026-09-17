import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";

export function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  if (images.length === 1) {
    return (
      <div className="aspect-5/4 overflow-hidden bg-image-placeholder">
        <img
          src={images[0]}
          alt={title}
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  return (
    <Carousel className="relative">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={image}>
            <div className="aspect-5/4 overflow-hidden bg-image-placeholder">
              <img
                src={image}
                alt={`${title} — image ${index + 1} of ${images.length}`}
                loading={index === 0 ? "eager" : "lazy"}
                className="h-full w-full object-contain"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4" />
      <CarouselNext className="right-4" />
    </Carousel>
  );
}
