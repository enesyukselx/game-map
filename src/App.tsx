import { useState } from "react";
import MainMap from "./components/MainMap";
import MiniMap from "./components/MiniMap";
import PopupMap from "./components/PopupMap";
import useMap from "./hooks/useMap";

function App() {
    //
    const { coords, setCoords } = useMap();
    const [isPopupMapVisible, setIsPopupMapVisible] = useState(false);

    return (
        <>
            <div className="flex flex-wrap justify-center py-4 gap-4">
                <div>
                    <MainMap />
                </div>
                <div>
                    <MiniMap />
                    <div className="mt-8">
                        <p className="text-2xl font-bold">Coordinates</p>
                        <p>
                            X:
                            <input
                                type="number"
                                value={coords.x}
                                onChange={(e) =>
                                    setCoords({
                                        x: parseInt(e.target.value),
                                        y: coords.y,
                                    })
                                }
                            />
                        </p>
                        <p>
                            Y:
                            <input
                                type="number"
                                value={coords.y}
                                onChange={(e) =>
                                    setCoords({
                                        x: coords.x,
                                        y: parseInt(e.target.value),
                                    })
                                }
                            />
                        </p>
                    </div>
                </div>
            </div>
            <div
                className="fixed bottom-4 right-4"
                onClick={() => setIsPopupMapVisible(!isPopupMapVisible)}
            >
                <button className="p-2 bg-blue-500 text-white rounded-md cursor-pointer">
                    {isPopupMapVisible ? "Close" : "Open"} Popup Map
                </button>
            </div>
            <div
                className={`fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.7)] flex items-center justify-center ${
                    isPopupMapVisible ? "" : "hidden"
                }`}
                onClick={() => setIsPopupMapVisible(false)}
            >
                <PopupMap />
            </div>
        </>
    );
}

export default App;
