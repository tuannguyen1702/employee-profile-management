import { HomeIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import UserInfo from "./UserInfo";

const Header = () => {
  return (
    <div className="bg-blue-500 flex fixed text-white w-full z-20">
      <div className="container w-full h-16 md:h-18 items-center justify-between text-sm flex gap-x-4">
        <div className="flex gap-x-4">
          <Link href={"/"}>
            <HomeIcon height={25} width={25} />
          </Link>
          <h1 className="flex-1 text-base md:text-lg">
            Trading Commission Tool
          </h1>
        </div>
        <UserInfo />
      </div>
    </div>
  );
};

export default Header;
