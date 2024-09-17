import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  type CarouselApi,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Employee, PositionResource } from "@/interfaces/api";
import { useEffect, useMemo, useState } from "react";

type EmployeeCardProps = {
  data: Employee;
  positionResources: Record<number, PositionResource>,
  actions?: React.ReactNode;
};

export function EmployeeCard(props: EmployeeCardProps) {
  const { data, actions, positionResources } = props;
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

  const images = useMemo(() => {
    return displayToolLanguage.images?.filter((item) => !!item.data);
  }, [displayToolLanguage]);

  return (
    <div className="group flex flex-col space-y-2">
      <Carousel setApi={setApi}>
        <div className="border aspect-video overflow-hidden rounded-lg bg-slate-100">
          <CarouselContent>
            {images?.map((item, idx) => {
              return item.data ? (
                <CarouselItem
                  key={idx}
                  className="flex max-h-[100%] items-start overflow-hidden"
                >
                  <img src={item.data} />
                </CarouselItem>
              ) : (
                ""
              );
            })}
          </CarouselContent>
        </div>
        {images && images.length > 1 && (
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
          <div className="line-clamp-1 font-medium text-neutral-500">{positionResources?.[data.positions[0].positionResourceId].name}</div>
          <div className="line-clamp-2 text-sm">{displayToolLanguage.description}</div>
        </div>
        <div className="flex justify-end h-10">{actions}</div>
      </div>
    </div>
  );
}
