import Link from "next/link";
import { useRouter } from "next/router";

export default function SidebarLink({ text, click, href, icon }) {
  const router = useRouter();

  return (
    <>
      {href && (
        <Link href={`${href}`}>
          <button className=" text-md lg:text-lg xl:text-xl rounded-full flex items-center text-center justify-center lg:w-full w-10 h-[40px] sm:w-14 sm:h-[52px] font-bold border-gray-500 border-2 p-3">
            <span>{text} {icon && (icon) }</span>
          </button>
        </Link>
      )}
      {!href && (
        <button
          className=" text-md lg:text-lg xl:text-xl rounded-full flex items-center justify-center lg:w-full w-10 h-[40px] sm:w-14 sm:h-[52px] font-bold border-gray-500 border-2 p-3"
          onClick={click}
        >
          <span>{text} {icon && (icon) }</span>
        </button>
      )}
    </>
  );
}
