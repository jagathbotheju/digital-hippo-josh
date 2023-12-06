"use client";

interface Props {
  onClick: () => void;
}

const BackDrop = ({ onClick }: Props) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    console.log("KeyboardEvent");
    console.log(e.key);
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={onClick}
      className="z-20 bg-slate-200 opacity-20 w-screen h-screen fixed top-0 left-0"
    ></div>
  );
};

export default BackDrop;
