import { HTMLAttributes, ReactNode, createElement } from "react";
import { theme } from "./theme";
import { cn } from "@/lib/utils";

type TitleProps = HTMLAttributes<HTMLHeadingElement> &{
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
  children?: ReactNode;
};

const Title = (props: TitleProps) => {
  const { children, className, as = "h4", ...otherProps } = props;
  const titleClasses = cn(theme.base, theme.type[as], className);

  return createElement(
    as,
    { className: titleClasses, ...otherProps },
    children
  );
};

export default Title;
