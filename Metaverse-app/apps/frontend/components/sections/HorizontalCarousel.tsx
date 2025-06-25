import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import Banner1 from "@/public/banner/banner-1.png";
import Banner2 from "@/public/banner/banner-2.jpg";
import Banner3 from "@/public/banner/banner-3.jpg";
import Banner4 from "@/public/banner/banner-4.png";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const CarouselImages = [Banner1, Banner2, Banner3, Banner4];

const HorizontalCarousel = () => {
  return (
    <Carousel
      className="w-full max-w-full"
      plugins={[
        Autoplay({
          delay: 4000,
        }),
      ]}
    >
      <CarouselContent>
        {CarouselImages.map((src, index) => (
          <CarouselItem key={index} className="basis-full">
            <div className="p-1 w-full h-[300px] overflow-clip">
              <Card className="bg-custom-bg-dark-1 border-none">
                <CardContent className="flex items-center justify-center">
                  <Image
                    src={src}
                    alt="Banner Image"
                    width={1600}
                    height={200}
                    className="object-cover w-full h-full rounded-xl"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-4 z-10 bg-custom-bg-dark-1 hover:bg-custom-bg-dark-2 border-none text-custom-text-primary hover:text-custom-text-primary cursor-pointer" />
      <CarouselNext className="-right-4 z-10 bg-custom-bg-dark-1 hover:bg-custom-bg-dark-2 border-none text-custom-text-primary hover:text-custom-text-primary cursor-pointer" />
    </Carousel>
  );
};

export default HorizontalCarousel;
