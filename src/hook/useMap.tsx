import { useContext } from "react";
import MapContext from "../context/MapContext";

export const useMapContext = () => {
  return useContext(MapContext);
};
