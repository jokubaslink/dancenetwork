import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
} from "firebase/firestore";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import EditPost from "../EditPost";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import Timestamp from "../Timestamp";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import Image from "next/image";
import noUserImg from "@/assets/Avatar.png";

export default function PostPage() {
  const { currentUser } = useAuth();
  const [post, setPost] = useState([]);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState([]);
  const [bookmarked, setBookmarked] = useState(false);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });
  const [latlng, setLatLng] = useState({ lat: "", lng: "" });
  const router = useRouter();
  const [editPost, setEditPost] = useState(false);

  const { id } = router.query;

  useEffect(() => {
    if (id) {
      getPostData();
      onSnapshot(collection(db, "posts", id, "likes"), (snapshot) =>
        setLikes(snapshot.docs)
      );
      checkBookmarkedState();
    }
  }, [db, router.isReady]);

  async function getPostData() {
    const docRef = doc(db, "posts", id);
    const docSnap = await getDoc(docRef);
    setPost(docSnap.data());
    const address = docSnap.data().location;
    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    setLatLng({ lat: lat, lng: lng });
  }

  useEffect(() => {
    if (currentUser) {
      setLiked(likes.findIndex((like) => like.id === currentUser.uid) !== -1);
    }
  }, [likes]);

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
        bookmarkedBy: currentUser.uid,
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

  return (
    <div className="w-full">
      {!editPost && (
        <div className="w-full flex flex-col border-gray-500 border-b-2 p-4 h-content space-y-2">
          <div className="lg:flex-row flex flex-col lg:items-center mb-2">
            <div className="flex lg:space-x-4 mb-2 items-center lg:mr-4 lg:mb-0">
              {post.photoURL ? (
                <Image
                  className="rounded-full hidden lg:block border-black border-2 h-[40px]"
                  height={40}
                  width={40}
                  src={post.photoURL}
                  alt='Post Creator Profile Picture'
                />
              ) : (
                <Image
                  className="rounded-full hidden lg:block border-black border-2"
                  height={40}
                  width={40}
                  src={noUserImg}
                  alt='Post Creator Profile Picture'
                />
              )}
              <p className="text-xl mr-4 lg:mr-0">{post.username}</p>
              <h2 className="font-bold space-x-2 hidden sm:block text-xl cursor-pointer lg:mr-0 mr-4">
                {post.title}
              </h2>
              {post && post.timestamp > 0 && (
                <Timestamp timestamp={post.timestamp?.seconds} />
              )}
            </div>
            <div className="flex flex-col sm:flex-row">
              <div className="sm:mb-0 mb-2">
                <h2 className="font-bold space-x-2 sm:space-x-0 block sm:hidden text-xl cursor-pointer "> {/* lg:mr-0 mr-4 */}
                  {post.title}
                </h2>
              </div>
              {currentUser && currentUser.uid === post?.id && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      deleteDoc(doc(db, "posts", id));
                      router.push("/");
                    }}
                  >
                    <DeleteIcon />
                  </button>
                  <button
                    onClick={() => {
                      setEditPost(!editPost);
                    }}
                  >
                    Edit Post.
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="mb-2">
            <p className="mb-4">{post.description}</p>
            <p>Location: {post.location}</p>
            <p className="mb-2">
              Date: {post.startDate && post.startDate.split("T").join(" ")} to{" "}
              {post.endDate && post.endDate.split("T").join(" ")}
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
      )}
      {editPost && (
        <button
          className="z-2 ml-2 mt-2 px-2 border-2 border-gray-500"
          onClick={() => {
            setEditPost(false);
          }}
        >
          X
        </button>
      )}
      {editPost && <EditPost postData={post} />}
      <div>
        {isLoaded && !editPost && (
          <GoogleMap
            zoom={12}
            center={latlng}
            mapContainerClassName="w-full min-h-screen"
          >
            <MarkerF position={latlng} />
          </GoogleMap>
        )}
      </div>
    </div>
  );
}
