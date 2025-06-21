import { useEffect, useRef } from "react";
import { Dispatch, SetStateAction } from "react";
import MapEditorHelpBox from "./map-editor-helpbox";

interface IEditMapValuesProps {
  mapName: string;
  setMapName: Dispatch<SetStateAction<string>>;
}

const EditMapMetaData = ({ mapName, setMapName }: IEditMapValuesProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Set cursor to end when client on the field
  const handleFocus = () => {
    const input = inputRef.current;
    if (input) {
      const length = input.value.length;
      input.setSelectionRange(length, length);
    }
  };

  useEffect(() => {
    const handleClickOutsideInput = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        inputRef.current.blur();
      }
    };
    document.addEventListener("mousedown", handleClickOutsideInput);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideInput);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-50 pointer-events-none">
      <div className="absolute left-1/2 right-1/2 top-4">
        <input
          ref={inputRef}
          type="text"
          value={mapName}
          onChange={(e) => setMapName(e.target.value)}
          placeholder="Map Name"
          onFocus={handleFocus}
          className="pointer-events-auto bg-transparent border-b-2 border-custom-border-highlight text-custom-text-primary text-xl font-semibold outline-none text-center"
        />
      </div>
      <MapEditorHelpBox />
    </div>
  );
};

export default EditMapMetaData;
