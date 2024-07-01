import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <div className="bg-blue-500/95 fixed text-white w-full z-20">
      <div className="container w-full h-16 md:h-18 items-center justify-between text-sm flex">
        <h1 className="flex-1 text-base md:text-lg"> Employee Profile Management</h1>
      </div>
    </div>
  );
};

export default Header;
