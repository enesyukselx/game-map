import useMap from "../hooks/useMap";

const PopupMap = () => {
    //
    const { popupMapRef } = useMap();

    return <canvas ref={popupMapRef}></canvas>;
};

export default PopupMap;
