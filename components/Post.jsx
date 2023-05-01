import { UseAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
  getDocs,
  updateDoc,
  where,
} from "@firebase/firestore";
import { auth, db } from "@/firebase";
import { useRouter } from "next/router";
import Timestamp from "./Timestamp";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";
import noUserImg from "../assets/Avatar.png";

export default function Post({ post, id }) {
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarked, setBookmarked] = useState(false);
  const { currentUser } = UseAuth();
  const router = useRouter();

  useEffect(() => {
    onSnapshot(collection(db, "posts", id, "likes"), (snapshot) =>
      setLikes(snapshot.docs)
    );

    if (currentUser) {
      checkForNewUsername();
      checkForNewBookmarkedProfilePicture();
      checkBookmarkedState();
      checkForNewProfilePicture();
    }
  }, [ id,  currentUser]);

  useEffect(() => {
    if (currentUser) {
      setLiked(likes.findIndex((like) => like.id === currentUser.uid) !== -1);
    }
  }, [likes, currentUser]);

  async function checkBookmarkedState() {
    if (currentUser) {
      const querySnapshot = await getDocs(
        query(collection(db, "user", currentUser.uid, "bookmark"))
      );
      querySnapshot.forEach((doc) => {
        if (doc.id === id) {
          setBookmarked(true);
        }
      });
    }
  }

  /* liked State fetching! */

  async function likePost() {
    if (liked) {
      await deleteDoc(doc(db, "posts", id, "likes", currentUser.uid));
      setLiked(false);
    } else {
      await setDoc(doc(db, "posts", id, "likes", currentUser.uid), {
        likedBy: currentUser.uid,
      });
      setLiked(true);
    }
  }

  async function bookmarkPost() {
    if (bookmarked) {
      await deleteDoc(doc(db, "user", currentUser.uid, "bookmark", id));
      setBookmarked(false);
    } else {
      await setDoc(doc(db, "user", currentUser.uid, "bookmark", id), {
        userId: post.id,
        username: post.username,
        title: post.title,
        description: post.description,
        location: post.location,
        timestamp: post.timestamp,
        startDate: post.startDate,
        endDate: post.endDate,
      });
      setBookmarked(true);
    }
  }

  function checkForNewUsername() {
    const data = {
      username: currentUser.displayName,
    };

    const docRef = doc(db, "posts", id);
    if (post.id === currentUser.uid) {
      updateDoc(docRef, data)
        .then((docRef) => {})
        .catch((error) => {
          alert(error);
        });
    }
  }

  function checkForNewProfilePicture() {
    const data = {
      photoURL: currentUser.photoURL,
    };

    const docRef = doc(db, "posts", id);
    if (post.id === currentUser.uid) {
      updateDoc(docRef, data)
        .then((docRef) => {})
        .catch((error) => {
          alert(error);
        });
    }
  }

  function checkForNewBookmarkedProfilePicture() {
    const data = {
      photoURL: currentUser.photoURL,
    };

    const docRef = doc(db, "user", currentUser.uid, "bookmark", id);

    if (post.userId === currentUser.uid) {
      updateDoc(docRef, data)
        .then((docRef) => {})
        .catch((error) => {
          alert(error);
        });
    }
  }

  return (
    <div className="w-full flex flex-col border-gray-500 border-b-2 p-4 h-content space-y-2">
      <div className="lg:flex-row flex flex-col lg:items-center mb-2">
        <div className="flex lg:space-x-4 mb-2 lg:items-center lg:mr-4 lg:mb-0">
          {post.photoURL ? (
            <Image
              className="rounded-full hidden lg:block border-black border-2 h-[40px]"
              height={40}
              width={40}
              src={post.photoURL}
              alt="Post Creator Profile Picture"
            />
          ) : (
            <Image
              className="rounded-full hidden lg:block border-black border-2"
              height={40}
              width={40}
              alt="Post Creator Profile Picture"
              src={noUserImg}
            />
          )}{" "}
          {/* check currentuser */}
          <p className="text-xl mr-4 lg:mr-0">{post.username}</p>
          <h2
            className="font-bold text-xl cursor-pointer"
            onClick={() => {
              router.push(`/post/${id}`);
            }}
          >
            {post.title}
          </h2>
        </div>
        <div className="flex space-x-4">
          {post && post.timestamp > 0 && (
            <Timestamp timestamp={post.timestamp?.seconds} />
          )}
          {currentUser && currentUser.uid === post?.id && (
            <button
              onClick={() => {
                deleteDoc(doc(db, "posts", id));
              }}
            >
              <DeleteIcon />
            </button>
          )}
        </div>
      </div>
      <div className="mb-2">
        <p className="mb-4">{post.description}</p>
        <p>Location: {post.location}</p>
        <p className="mb-2">
          Date: {post.startDate.split("T").join(" ")} to{" "}
          {post.endDate.split("T").join(" ")}
        </p>
        {post.linkForMoreEventPostInfo && (
          <div className="flex flex-col lg:flex-row">
            <p className="lg:w-[210px]">More info on this website: </p>
            <Link
              href={post.linkForMoreEventPostInfo}
              className="text-[#0000EE] underline overflow-hidden"
            >
              {post.linkForMoreEventPostInfo}
            </Link>
          </div>
        )}
      </div>
      {currentUser && (
        <div className="space-x-4">
          {liked ? (
            <button onClick={likePost} className="text-red-700">
              <FavoriteIcon />
              {likes.length}
            </button>
          ) : (
            <button onClick={likePost} className="text-red-900">
              <FavoriteIcon />
              {likes.length > 0 && `${likes.length}`}
            </button>
          )}
          {bookmarked ? (
            <button onClick={bookmarkPost} className="text-yellow-700">
              <BookmarkBorderIcon />
            </button>
          ) : (
            <button onClick={bookmarkPost} className="text-yellow-500">
              <BookmarkIcon />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
