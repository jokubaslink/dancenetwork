import PostPage from "@/components/PostPage/PostPage";
import Sidebar from "@/components/Sidebar";
import { UseAuth } from "@/context/AuthContext";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Postpage() {
  const { currentUser } = UseAuth();
  const router = useRouter();

  return (
    <div className="w-screen bg-[#e7ecef]">
      <Head>
        <title>Dance Network || Post</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen flex flex-col max-w-[1500px] mx-auto">
        <div className="flex space-x-2 p-2">
          <h3
            className="my-auto font-medium text-xl cursor-pointer text-[#274C77]"
            onClick={() => {
              router.push("/");
            }}
          >
            Dance Network
          </h3>

          {currentUser && (
            <div className="w-[300px] items-center my-auto space-x-3 h-10 flex">
              <h3>
                Signed in as
                {currentUser.uid && (
                  <Link
                    className="ml-2 font-medium"
                    href={`/user/${currentUser.uid}`}
                  >
                    {currentUser.displayName}
                  </Link>
                )}
              </h3>
            </div>
          )}
          {!currentUser && (
            <div className="w-[200px] flex items-center justify-center space-x-3 h-10">
              <button
                className="hover:border-b-2 border-gray-500"
                onClick={() => {
                  router.push("/signin");
                }}
              >
                Sign In
              </button>
              <button
                className="hover:border-b-2 border-gray-500"
                onClick={() => {
                  router.push("/signup");
                }}
              >
                Create an account
              </button>
            </div>
          )}
        </div>
        {/*Layoutas?*/}
        <div className="flex justify-center min-h-screen border-t-2 border-[#274C77] scrollbar-hide">
          <div className="flex items-center flex-col p-2 sticky top-0 w-1/6">
            <Sidebar />
          </div>
          <div className="relative lg:w-[725px] flex justify-center w-4/6">
            <PostPage />
          </div>
          <div className="w-1/6 hidden lg:flex items-center justify-center">
            
          </div>
        </div>
      </main>
    </div>
  );
}
