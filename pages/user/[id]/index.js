import { UseAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Page from "@/components/Page";
import Head from "next/head";
import Link from "next/link";

export default function User() {
  const { currentUser, logOut } = UseAuth();
  const [userPosts, setUserPosts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    loadCurrentUserPosts();
  }, [db]);

  async function loadCurrentUserPosts() {
    const q = query(
      collection(db, "posts"),
      where("id", "==", currentUser.uid),
      orderBy("timestamp", "desc")
    );

    const querySnapshot = await getDocs(q);
    const queryDocData = [];
    querySnapshot.forEach((doc) => {
      queryDocData.push({ ...doc.data(), postId: doc.id });
    });
    setUserPosts(queryDocData);
  }

  if (!currentUser) {
    router.push("/signin");
    return <></>;
  }
  return (
    <div className="w-screen">
      <Head>
        <title>Dance Network || Profile</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen flex flex-col max-w-[1500px] mx-auto">
        <div className="flex space-x-2 p-2">
          <h3
            className="my-auto font-medium text-xl cursor-pointer"
            onClick={() => {
              router.push("/");
            }}
          >
            Dance Network
          </h3>
          <div className="w-[300px] my-auto items-center space-x-3 h-10 flex">
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
            <Page type={"profile"} data={userPosts} />
          </div>
          <div className="w-1/6 hidden lg:flex items-center justify-center">

          </div>
        </div>
      </main>
    </div>
  );
}
