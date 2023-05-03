import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import { useRouter } from "next/router";

export default function SearchInput() {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();
  const router = useRouter();

  async function handleSelect(address) {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    /*  setSelected({ lat, lng }); */
    router.push(`/search/${address}`);
  }

  return (
    <Combobox onSelect={handleSelect} className="w-[300px] sm:w-[350px] md:w-[450px] lg:w-[500px]">
      <ComboboxInput
        className=" w-full h-16 p-4 bg-[#e7ecef] border-b-[#274C77] border-2 shadow-lg rounded-md"
        placeholder="Type an address to find events in.."
        disabled={!ready}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <ComboboxPopover className="border-b-2 bg-[#e7ecef] border-x-2 border-gray-500">
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
  );
}
