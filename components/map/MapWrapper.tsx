"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

const MapWrapper = (props: any) => {
    const Map = useMemo(
        () =>
            dynamic(() => import("./Map"), {
                loading: () => <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">Chargement de la carte...</div>,
                ssr: false,
            }),
        []
    );

    return <Map {...props} />;
};

export default MapWrapper;
