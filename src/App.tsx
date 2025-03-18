import MainMap from "./components/MainMap";
import MiniMap from "./components/MiniMap";
import useMap from "./hooks/useMap";

function App() {
    //

    const { coords } = useMap();

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
                            X: <span className="font-bold">{coords.x}</span>
                        </p>
                        <p>
                            Y: <span className="font-bold">{coords.y}</span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
