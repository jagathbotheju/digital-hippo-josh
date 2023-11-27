import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  children: React.ReactNode;
}

const MaxWidthWrapper = ({ className, children }: Props) => {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-screen-lg px-2.5 md:px-20",
        className
      )}
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
