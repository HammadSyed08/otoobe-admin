import { Trefoil } from "ldrs/react";
import "ldrs/react/Trefoil.css";

export default function Loader() {
  return (
    <div className="flex items-center justify-center h-full w-full lg:p-5 md:p-28 p-20">
      <Trefoil
        size="96"
        stroke="4"
        strokeLength="0.15"
        bgOpacity="0.1"
        speed="1.4"
        color="white"
      />
    </div>
  );
}
