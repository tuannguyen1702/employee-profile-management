import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  type CarouselApi,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Employee } from "@/interfaces/api";
import { useEffect, useState } from "react";

type EmployeeCardProps = {
  data: Employee;
  actions?: React.ReactNode
};

export function EmployeeCard(props: EmployeeCardProps) {
  const { data, actions } = props;
  const displayToolLanguage = data.positions?.[0].toolLanguages?.[0] ?? {};
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="group flex flex-col space-y-2">
      <Carousel setApi={setApi}>
        <div className="border overflow-hidden rounded-lg bg-slate-100">
          <CarouselContent>
            {displayToolLanguage.images?.map((item, idx) => {
              return item.data ? (
                <CarouselItem
                  key={idx}
                  className="aspect-video flex items-center overflow-hidden"
                >
                  <img src={item.data} />
                </CarouselItem>
              ) : (
                ""
              );
            })}
          </CarouselContent>
        </div>
        {displayToolLanguage.images &&
          displayToolLanguage.images.length > 1 && (
            <>
              <CarouselPrevious className="hidden group-hover:flex" />
              <CarouselNext className="hidden group-hover:flex" />
            </>
          )}
      </Carousel>
      <div className="flex flex-col flex-1 space-y-1">
        <div className="flex-1 space-y-1">
          <div className="flex gap-x-2 font-semibold">
            <span className="flex-1 line-clamp-1">{data.name}</span>
            <span>
              {displayToolLanguage.to - displayToolLanguage.from + 1} years
            </span>
          </div>
          <div className="line-clamp-1">{displayToolLanguage.description}</div>
          <div className="line-clamp-2">{displayToolLanguage.description}</div>
        </div>
        <div className="flex justify-end h-10">
          {actions}
        </div>
      </div>
    </div>
  );
}
