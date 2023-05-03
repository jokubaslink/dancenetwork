import Post from "@/components/Post";
import Sidebar from "@/components/Sidebar";
import { UseAuth } from "@/context/AuthContext";
import { db } from "@/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Adresas() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);

  const { address } = router.query;
  const { currentUser } = UseAuth();

  useEffect(() => {
    if (address) {
      loadPosts();
    }
  }, [ router.isReady, address]);

  async function loadPosts() {
    onSnapshot(
      query(collection(db, "posts"), where("location", "==", address)),
      (querySnapshot) => {
        const postsArray = [];
        querySnapshot.forEach((doc) => {
          postsArray.push(doc);
        });
        setPosts(postsArray);
      }
    );
  }

  return (
    <div className="w-screen bg-[#e7ecef]">
      <Head>
        <title>Dance Network || Search</title>
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
          {!currentUser && (
            <div className="flex items-center justify-center w-[200px] space-x-3 h-10">
              <button
                onClick={() => {
                  router.push("/signin");
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  router.push("/signup");
                }}
              >
                Create an account
              </button>
            </div>
          )}
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
        </div>
        {/*Layoutas?*/}
        <div className="flex justify-center min-h-screen border-t-2 border-[#274C77] scrollbar-hide">
          <div className="flex items-center flex-col p-2 sticky top-0 w-1/6 ">
            <Sidebar />
          </div>

          <div className="relative space-y-6 lg:w-[725px] flex flex-col items-center w-4/6">
            <div className="mt-4 w-full flex items-center justify-around ">
              <h1 className="font-medium text-xl md:text-2xl">All events in {address}</h1>
            </div>
            <div className="w-full">
              {posts.length === 0 && (<div className="pt-64">
                <h1 className="text-2xl text-center ">There is no events in {address}</h1>
              </div>)}
              {posts.map((post) => (
                <Post key={post.id} id={post.id} post={post.data()} />
              ))}
            </div>
          </div>
          <div className="w-1/6 hidden lg:flex items-center justify-center">
            
          </div>
        </div>
      </main>
    </div>
  );
}
