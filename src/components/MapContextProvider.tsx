import MapContext, { IMapContext } from "../context/MapContext";

const MapContextProvider = ({ children }: { children: React.ReactNode }) => {
  //
  const values: IMapContext = {
    mainMapRef: undefined,
    miniMapRef: undefined,
  };

  return <MapContext.Provider value={values}>{children}</MapContext.Provider>;
};

export default MapContextProvider;
