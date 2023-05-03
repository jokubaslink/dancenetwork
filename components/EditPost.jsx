import { UseAuth } from "@/context/AuthContext";
import { useLoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxPopover,
} from "@reach/combobox";
import usePlacesAutocomplete from "use-places-autocomplete";
import { useRouter } from "next/router";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default function EditPost({ postData }) {
  const router = useRouter();
  const { id } = router.query;
  const [postDetails, setPostDetails] = useState({
    timestamp: postData.timestamp,
    id: postData.id,
    username: postData.username,
    title: postData.title,
    description: postData.description,
    startDate: postData.startDate,
    endDate: postData.endDate,
    location: postData.location,
    locations: [],
    linkForMoreEventPostInfo: postData.linkForMoreEventPostInfo,
  });
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  useEffect(() => {
    setValue(postData.location);
  }, [postData]);

  const { currentUser, submitPost } = UseAuth();

  function updatePostData() {
    if (router.isReady) {
      const docRef = doc(db, "posts", id);

      const data = {
        ...postDetails,
      };

      updateDoc(docRef, data);
    }
  }

  function handleSelect(address) {
    setValue(address, false);
    clearSuggestions();
    setPostDetails({
      ...postDetails,
      location: address,
      locations: address.split(", "),
    });
  }

  return (
    <div className="mt-2 flex flex-col p-2 space-y-5">
      <div className="w-full flex-col lg:flex-row flex lg:space-x-5 space-y-4 lg:space-y-0">
        {/*  */}
        <div className="flex flex-col space-y-4 justify-center">
          <h2>Title / Description:</h2>
          <div className="flex flex-col space-y-4">
            <input
              placeholder="Event Title:"
              className="border-2 border-[#274C77] bg-[#e7ecef] placeholder:text-[#274C77] w-full"
              type="text"
              value={postDetails.title}
              onChange={(e) =>
                setPostDetails({ ...postDetails, title: e.target.value })
              }
            />
            <textarea
              className=" resize-none	 h-full border-2 border-[#274C77] w-full bg-[#e7ecef] placeholder:text-[#274C77]"
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
        </div>

        {/*  */}

        <div className="flex flex-col space-y-4">
          <h2>Event start/end date:</h2>
          <div className="flex flex-col space-y-4 items-center justify-center">
            <input
              className="border-2 border-[#274C77] bg-[#e7ecef] placeholder:text-[#274C77] w-full"
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
              className="border-2 border-[#274C77] bg-[#e7ecef] placeholder:text-[#274C77] w-full"
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

        <div className="space-y-4">
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
                  className="w-full h-full p-4 border-2 border-[#274C77] bg-[#e7ecef] placeholder:text-[#274C77]"
                  placeholder="Type an address to find events in.."
                  disabled={!ready}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
                <ComboboxPopover className="border-b-2 bg-[#e7ecef] border-x-2 border-[#274C77]">
                  <ComboboxList className="space-y-5">
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
        className="border-2 border-[#274C77] bg-[#e7ecef] placeholder:text-[#274C77] w-full"
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
        onClick={() => {
          updatePostData();
          router.reload();
        }}
        className="text-[#FBF9FF] bg-[#6096BA] border-[#274C77] shadow-lg rounded-md border-2"
      >
        Change event data.
      </button>
    </div>
  );
}
