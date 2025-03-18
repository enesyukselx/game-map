import MainMap from "./components/MainMap";
import MiniMap from "./components/MiniMap";
import useMap from "./hooks/useMap";

function App() {
    //
    const { coords, setCoords } = useMap();

    return (
        <>
            <div className="flex gap-4">
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
        </>
    );
}

export default App;
