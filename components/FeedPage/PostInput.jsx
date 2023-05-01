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
  
  export default function PostInput() {
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
      
    }
  
    return (
      <Combobox onSelect={handleSelect} className="w-full">
        <ComboboxInput
          className="w-full h-full p-4 border-2 border-gray-500"
          placeholder="Type an address to find events in.."
          disabled={!ready}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <ComboboxPopover className="border-b-2 border-gray-500">
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
    );
  }
  