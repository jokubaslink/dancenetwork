import Page from "@/components/Page";
import Sidebar from "@/components/Sidebar";
import { UseAuth } from "@/context/AuthContext";
import { db } from "@/firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Bookmarks() {
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const { currentUser } = UseAuth();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      loadCurrentUserBookmarks();
    }
  }, [currentUser]);

  async function loadCurrentUserBookmarks() {
    const querySnapshot = await getDocs(
      query(
        collection(db, "user", currentUser.uid, "bookmark"),
        orderBy("timestamp", "desc")
      )
    );
    const queryDocData = [];
    querySnapshot.forEach((doc) => {
      queryDocData.push({ ...doc.data(), postId: doc.id });
    });
    setBookmarkedPosts(queryDocData);
  }

  if (!currentUser) {
    router.push("/signin");
    return <></>;
  }

  return (
    <div className="w-screen">
      <Head>
        <title>Dance Network || Bookmarks</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen flex flex-col max-w-[1500px] mx-auto">
        <div className="flex space-x-2 p-2">
          <h3
            className="my-auto font-medium text-xl  cursor-pointer"
            onClick={() => {
              router.push("/");
            }}
          >
            Dance Network
          </h3>
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
        </div>
        {/*Layoutas?*/}
        <div className="flex justify-center min-h-screen border-t-2 border-gray-500 scrollbar-hide">
          <div className="flex items-center flex-col p-2 sticky top-0 w-1/6 border-l-2 border-gray-500">
            <Sidebar />
          </div>
          <div className="relative lg:w-[725px] flex justify-center border-gray-500 border-x-2 w-4/6">
              <Page type={"bookmarks"} data={bookmarkedPosts} />
          </div>
          <div className="w-1/6 hidden lg:flex items-center justify-center">

          </div>
        </div>
      </main>
    </div>
  );
}