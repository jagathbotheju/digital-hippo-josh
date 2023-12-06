import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Icons } from "./Icons";
import NavItems from "./NavItems";
import { Separator } from "./ui/separator";
import Cart from "./Cart";
import AuthUser from "./AuthUser";

const Navbar = () => {
  return (
    <div className="bg-white sticky top-0 z-50 inset-x-0 h-16 px-10">
      <header className="relative bg-white">
        {/* <MaxWidthWrapper> */}
        <div className="border-b border-gray-200">
          <div className="flex h-16 items-center">
            {/* TODO:mobile nav */}

            <div className="ml-4 flex lg:ml-0">
              <Link href="/">
                <Icons.logo className="h-10 w-10" />
              </Link>
            </div>

            <div className="hidden z-50 lg:ml-8 lg:block lg:self-stretch">
              <NavItems />
            </div>

            <div className="ml-auto flex items-center">
              <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6 h-7">
                <AuthUser />
                <Separator orientation="vertical" />
                <div className="ml-4 flow-root lg:ml-6">
                  <Cart />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* </MaxWidthWrapper> */}
      </header>
    </div>
  );
};

export default Navbar;
