import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";

interface Props {
  src?: string | null | undefined;
}

const Avatar = ({ src }: Props) => {
  if (src) {
    return (
      <Image
        alt="Avatar"
        src={src}
        className="rounded-full"
        width="30"
        height="30"
      />
    );
  }

  return <FaUserCircle size={24} />;
};

export default Avatar;
