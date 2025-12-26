import LogoImg from "@/public/assets/icons/logo.png";
import Image from "next/image";

interface LogoProps {
  width: string;
  height: string;
}

const Logo: React.FC<LogoProps> = ({ width, height }) => {
  return (
    <div className="z-50" style={{ width: width, height: height }}>
      <Image
        src={LogoImg}
        alt="deekrub"
        className="w-full h-full object-cover overflow-visible"
      />
    </div>
  );
};

export default Logo;
