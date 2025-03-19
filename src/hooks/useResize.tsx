import { useEffect } from "react";
import { TMapConfig } from "../types";

const useResize = (
    wrapperRef: React.RefObject<HTMLDivElement | null>,
    setMapConfig: React.Dispatch<React.SetStateAction<TMapConfig>>
) => {
    useEffect(() => {
        const observer = new ResizeObserver((mutations) => {
            setMapConfig((prev) => ({
                ...prev,
                size: {
                    width: mutations[0].contentRect.width,
                    height: mutations[0].contentRect.height,
                },
            }));
        });

        // Only observe if the ref exists
        if (wrapperRef.current) {
            observer.observe(wrapperRef.current);
        }

        // Cleanup function to disconnect observer when component unmounts
        return () => {
            observer.disconnect();
        };
        /* eslint-disable-next-line */
    }, [wrapperRef]); // Re-run if wrapperRef changes
};

export default useResize;
