import { Trefoil } from "ldrs/react";
import "ldrs/react/Trefoil.css";

export default function Loader() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <Trefoil
        size="40"
        stroke="4"
        strokeLength="0.15"
        bgOpacity="0.1"
        speed="1.4"
        color="black"
      />
    </div>
  );
}
