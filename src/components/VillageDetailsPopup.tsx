import React from "react";
import { TVillage } from "../types";

interface VillageDetailsPopupProps {
    village: TVillage;
    position: { x: number; y: number };
}

const VillageDetailsPopup: React.FC<VillageDetailsPopupProps> = ({
    village,
    position,
}) => {
    return (
        <div
            className="fixed bg-white shadow-md p-3 rounded-md border z-50 text-black"
            style={{
                left: `${position.x + 10}px`,
                top: `${position.y - 10}px`,
                minWidth: "200px",
                transform: "translate(0, -100%)",
            }}
        >
            <h3 className="font-bold text-lg">{village.name}</h3>
            <p>
                Coordinates: ({village.coords.x},{village.coords.y})
            </p>
            <p>Type: {village.type}</p>
        </div>
    );
};

export default VillageDetailsPopup;
