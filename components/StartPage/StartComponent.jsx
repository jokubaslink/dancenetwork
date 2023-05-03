
import { useState } from "react";
/*  */
import SearchInput from "../SearchPage/SearchInput";
import { useLoadScript } from "@react-google-maps/api";
/*  */

export default function StartComponent() {
  const [inputValue, setInputValue] = useState("");
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  return (
    <div className="m-auto space-y-5">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-500 text-center">
        Dance Network 
      </h1>
      <div className="space-y-6">
        <h3 className="lg:text-2xl text-lg text-center text-blue-400">
          Find Events Near You!
        </h3>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0">
          {isLoaded && <SearchInput />}
        </div>
      </div>
    </div>
  );
}
