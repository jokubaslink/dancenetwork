import { UseAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { db } from "@/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import Post from "./Post";
import SearchInput from "./SearchPage/SearchInput";
import { useLoadScript } from "@react-google-maps/api";
import PostInput from "./FeedPage/PostInput";
import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxPopover,
} from "@reach/combobox";
import usePlacesAutocomplete from "use-places-autocomplete";

export default function Feed() {
  const [openModal, setOpenModal] = useState(false);
  const [postDetails, setPostDetails] = useState({
    timestamp: "",
    id: "",
    username: "",
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    locations: [],
    linkForMoreEventPostInfo: "",
  });
  const [posts, setPosts] = useState([]);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const { currentUser, submitPost } = UseAuth();

  function sendPost() {
    submitPost(postDetails);
    setOpenModal(false);
    setPostDetails({
      timestamp: "",
      id: "",
      username: "",
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      location: "",
      locations: [],
      linkForMoreEventPostInfo: "",
    });
  }

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "posts"), orderBy("timestamp", "desc")),
        (snapshot) => {
          setPosts(snapshot.docs);
        }
      ),
    [db]
  );

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  async function handleSelect(address) {
    setValue(address, false);
    clearSuggestions();
    setPostDetails({
      ...postDetails,
      location: address,
      locations: address.split(", "),
    });

    /*     const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
 */

    /*  setSelected({ lat, lng }); */
  }

  return (
    <div className="w-full min-h-screen">
      <div className="flex-col flex items-center justify-center border-gray-500 py-6 border-b-2">
        <div className="mx-4 space-y-2">
          <h2 className="text-2xl px-6 font-medium">
            Find events in your city!
          </h2>
          {/*          <input
            placeholder="Search"
            className="border-gray-500 border-2 rounded p-2 w-full max-w-[400px]"
          /> */}
          {isLoaded && <SearchInput />}

          <button
            onClick={() => {
              setOpenModal(true);
              setPostDetails({
                ...postDetails,
                id: currentUser.uid,
                username: currentUser.displayName,
                timestamp: serverTimestamp(),
              });
            }}
            className="w-full border-gray-500 border-2 rounded"
          >
            Post an event!
          </button>
        </div>
      </div>
      {/*  */}
      <div className="">
        {openModal && (
          <div className="flex flex-col border-gray-500 border-b-2 h-full p-2 space-y-5">
            <div className="flex lg:space-x-2">
              <button
                onClick={() => {
                  setPostDetails({
                    timestamp: "",
                    id: "",
                    username: "",
                    title: "",
                    description: "",
                    startDate: "",
                    endDate: "",
                    city: "",
                    street: "",
                  });
                  setOpenModal(false);
                }}
                className="border-gray-500 border-2 w-8 h-8"
              >
                X
              </button>
            </div>
            <div className="w-full flex-col lg:flex-row flex lg:space-x-5 space-y-4 lg:space-y-0">
              {/*  */}
              <div className="flex flex-col space-y-4 items-center justify-center">
                <input
                  placeholder="Event Title:"
                  className="border-2 p-2 border-gray-500 w-full"
                  type="text"
                  value={postDetails.title}
                  onChange={(e) =>
                    setPostDetails({ ...postDetails, title: e.target.value })
                  }
                />
                <textarea
                  className="w-full resize-none p-2 h-full border-2 border-gray-500"
                  name=""
                  id=""
                  placeholder="Event Description:"
                  value={postDetails.description}
                  onChange={(e) =>
                    setPostDetails({
                      ...postDetails,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              {/*  */}

              <div className="flex flex-col">
                <h2>Event start/end date:</h2>
                <div className="flex flex-col space-y-4 items-center justify-center">
                  <input
                    className="border-2 p-2 border-gray-500 w-full"
                    type="datetime-local"
                    value={postDetails.startDate}
                    onChange={(e) =>
                      setPostDetails({
                        ...postDetails,
                        startDate: e.target.value,
                      })
                    }
                  />
                  <input
                    className="border-2 p-2 border-gray-500 w-full"
                    type="datetime-local"
                    value={postDetails.endDate}
                    onChange={(e) =>
                      setPostDetails({
                        ...postDetails,
                        endDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="">
                <h2>Event Location:</h2>
                <div className="space-y-4 lg:space-y-0">
                  {/*                   <input
                    className="border-2 border-gray-500 w-full lg:w-[00px]"
                    type="text"
                    placeholder="City:"
                    value={postDetails.city}
                    onChange={(e) =>
                      setPostDetails({ ...postDetails, city: e.target.value })
                    }
                  />
                  <input
                    className="border-2 border-gray-500 w-full"
                    type="text"
                    placeholder="Street:"
                    value={postDetails.street}
                    onChange={(e) =>
                      setPostDetails({ ...postDetails, street: e.target.value })
                    }
                  /> */}

                  {/* <PostInput />  */}
                  {/* Kitoks inputas event locationui */}
                  {isLoaded && (
                    <Combobox onSelect={handleSelect} className="w-full">
                      <ComboboxInput
                        className=" w-full h-16 p-4 border-2 border-gray-500"
                        placeholder="Type an address to find events in.."
                        disabled={!ready}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                      />
                      <ComboboxPopover className="border-b-2 bg-blue-50 border-x-2 border-gray-500">
                        <ComboboxList className="flex flex-col justify-center space-y-5">
                          {status === "OK" &&
                            data.map(({ place_id, description }) => (
                              <ComboboxOption
                                className="font-medium text-lg"
                                key={place_id}
                                value={description}
                              />
                            ))}
                        </ComboboxList>
                      </ComboboxPopover>
                    </Combobox>
                  )}
                </div>
              </div>
            </div>
            <input
              className="border-2 p-2 border-gray-500 w-full"
              type="text"
              placeholder="Official event link."
              value={postDetails.linkForMoreEventPostInfo}
              onChange={(e) =>
                setPostDetails({
                  ...postDetails,
                  linkForMoreEventPostInfo: e.target.value,
                })
              }
            />
            <button
              onClick={sendPost}
              className="border-2 border-gray-500 rounded"
            >
              Post the event
            </button>
          </div>
        )}
        {posts.map((post) => (
          <Post key={post.id} id={post.id} post={post.data()} />
        ))}
        {/* Empty block start; */}

        <div className="flex flex-col p-4 h-64 space-y-2"></div>

        {/* Empty block end; */}
      </div>
    </div>
  );
}
