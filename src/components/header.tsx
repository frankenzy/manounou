"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Menu from "./Menu";
import Buttons from "./buttons";

export default function Header() {
  const router = useRouter();
  const handleLogin = () => {
    // router.push("/login");
  };
  const handleRegister = () => {
    // router.push("/register");
  };
  return (
    <div className="header flex items-center justify-center w-full border-solid border-b-1 border-0 border-[#ffffff]">
      <div className="container px-6 py-4 flex flex-col items-center justify-center w-full max-w-screen-2xl text-center">
        <div className="flex flex-row items-center justify-between w-full">
          <div className="col-span-1 flex flex-row items-center sm:gap-2">
            <Image src="/logo.svg" alt="logo" width={40} height={40} />
            <h2>Manounous</h2>
          </div>
          <div className="col-span-1 sm:col-span-2">
            <Menu />
          </div>
          <div className="col-span-1 flex flex-row items-end sm:gap-4 justify-end">
            <Buttons
              className="py-2 bg-inherit border border-solid border-[#232323]"
              onClick={handleLogin}
            >
              Login
            </Buttons>
            <Buttons
              className="py-2 bg-[#fff] text-[#232323] rounded-lg text-[10px] sm:text-sm"
              onClick={handleRegister}
            >
              Sign in
            </Buttons>
          </div>
        </div>
      </div>
    </div>
  );
}
