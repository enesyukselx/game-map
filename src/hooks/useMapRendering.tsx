import { useEffect } from "react";
import { MAP_BACKGROUND_COLOR } from "../constants";
import { TCoords, TMapConfig, TMapType, TTerrain, TVillage } from "../types";
import clearMap from "../utils/clearMap";
import drawCoordsOnMap from "../utils/drawCoordsOnMap";
import drawVillagesOnMap from "../utils/drawVillagesOnMap";
import attachVillageImageLoadListeners from "../utils/attachVillageImageLoadListeners";
import drawVillagesOnMapWithImage from "../utils/drawVillagesOnMapWithImage";
import attachTerrainImageLoadListeners from "../utils/attachTerrainImageLoadListeners";
import drawTerrainsOnMap from "../utils/drawTerrainsOnMap";

const useMapRendering = (
    ctx: CanvasRenderingContext2D | null,
    mapConfig: TMapConfig,
    mapType: TMapType,
    villages: TVillage[],
    terrains: TTerrain[],
    coords: TCoords,
    visibleAreas?: {
        width: number;
        height: number;
    }
) => {
    //
    useEffect(() => {
        if (!ctx) return;

        // Clear map
        clearMap({
            ctx: ctx,
            width: mapConfig.size.width,
            height: mapConfig.size.height,
            backgroundColor: MAP_BACKGROUND_COLOR,
        });

        if (mapType === "MAIN") {
            // Draw villages on main map
            attachVillageImageLoadListeners(ctx, villages, coords, mapConfig);
            drawVillagesOnMapWithImage({
                ctx: ctx,
                villages,
                coords,
                mapType: "MAIN",
                mapConfig,
            });

            // Draw terrains on main map
            attachTerrainImageLoadListeners(ctx, terrains, coords, mapConfig);
            drawTerrainsOnMap({
                ctx: ctx,
                terrains,
                coords,
                mapConfig,
            });

            drawCoordsOnMap({
                ctx: ctx,
                coords,
                mapConfig,
            });
        }

        if (mapType === "MINI" && visibleAreas) {
            // Draw villages on mini map
            const miniMapCenterX =
                mapConfig.size.width / 2 - visibleAreas?.width / 2;
            const miniMapCenterY =
                mapConfig.size.height / 2 - visibleAreas?.height / 2;

            drawVillagesOnMap({
                ctx: ctx,
                villages,
                coords,
                mapType: "MINI",
                miniMapCenterCoords: { x: miniMapCenterX, y: miniMapCenterY },
                mapConfig,
            });

            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;

            // Draw viewport rectangle on mini map
            ctx.strokeRect(
                miniMapCenterX,
                miniMapCenterY,
                visibleAreas?.width,
                visibleAreas?.height
            );
        }

        if (mapType === "POPUP") {
            drawVillagesOnMap({
                ctx: ctx,
                villages,
                coords,
                mapType: "POPUP",
                mapConfig,
            });
        }
    }, [coords, ctx, mapConfig, mapType, villages, terrains, visibleAreas]);
};

export default useMapRendering;
