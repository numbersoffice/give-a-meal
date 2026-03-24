"use client";

import { Loader as GoogleMapsLoader } from "@googlemaps/js-api-loader";
import { RefObject, useContext, useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import { NearbyRestaurantsContext } from "../Context";
import getMapBounds from "@/utils/getMapBounds";
import Loader from "@/components/loader";
import Image from "next/image";
import PlusIcon from "@/public/assets/icons/plus.svg";
import MinusIcon from "@/public/assets/icons/minus.svg";

export default function Map({
  initialPosition,
  className,
}: {
  initialPosition: { lat: number; lon: number };
  className?: string;
}) {
  const {
    businesses,
    selectedBusiness,
    setSelectedBusiness,
    loading,
    clientLocation,
    addressFieldLocation,
    setBounds,
  } = useContext(NearbyRestaurantsContext);

  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  // ------------------
  // Map initialization
  // ------------------

  // Initialize map
  useEffect(() => {
    initMap(mapRef as any, initialPosition).then(setMap);
  }, [initialPosition]);

  // Initialize markers
  useEffect(() => {
    if (map && businesses) {
      initMarkers(
        map,
        businesses,
        markersRef.current,
        setSelectedBusiness,
        selectedBusiness,
      ).then((newMarkers) => {
        markersRef.current = newMarkers;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, businesses]);

  // ----------------------------------
  // Effects to update the map position
  // ----------------------------------

  // Client location
  // Center map when client location is updated
  useEffect(() => {
    if (clientLocation && map) {
      goToMarker(clientLocation.lat, clientLocation.lon, map);
    }
  }, [clientLocation, map]);

  // Address field
  // Center map when address field is updated
  useEffect(() => {
    if (addressFieldLocation && map) {
      goToMarker(addressFieldLocation.lat, addressFieldLocation.lon, map);
    }
  }, [addressFieldLocation, map]);

  // ---------
  // Listeners
  // ---------

  // Listen to the maps "idle" event
  // to check if map has loaded and
  // to check if bounds have changed
  useEffect(() => {
    if (map) {
      map.addListener("idle", () => {
        const bounds = getMapBounds(map);
        setBounds(bounds);
      });
    }
  }, [map, setBounds]);

  // Deselect business on map click (does not fire during pan/drag)
  useEffect(() => {
    if (!map) return;
    const listener = map.addListener("click", () => {
      setSelectedBusiness(null);
    });
    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [map, setSelectedBusiness]);

  // ---------
  // Utils
  // ---------

  // Update the markers when the selected business changes
  useEffect(() => {
    if (selectedBusiness && map && businesses) {
      initMarkers(
        map,
        businesses,
        markersRef.current,
        setSelectedBusiness,
        selectedBusiness,
      ).then((newMarkers) => {
        markersRef.current = newMarkers;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusiness]);

  // Update z-index of markers when selected business changes
  useEffect(() => {
    markersRef.current.forEach((marker, index) => {
      if (selectedBusiness && selectedBusiness.index === index) {
        marker.zIndex = 1000;
      } else {
        marker.zIndex = 0;
      }
    });
  }, [selectedBusiness]);

  // ---------
  // Render
  // ---------
  return (
    <div className={styles.wrapper}>
      <div className={styles.container} ref={mapRef} />
      {loading && (
        <div className={styles.loader}>
          <Loader />
        </div>
      )}
      {/* Custom Zoom Controls */}
      {
        <div className={styles.zoomControls}>
          <button
            className={styles.zoomIn}
            onClick={() => map && map.setZoom((map.getZoom() as any) + 1)}
          >
            <Image src={PlusIcon} alt="Plus icon" width={16} height={16} />
          </button>
          <div className={styles.zoomDivider} />
          <button
            className={styles.zoomOut}
            onClick={() => map && map.setZoom((map.getZoom() as any) - 1)}
          >
            <Image src={MinusIcon} alt="Minus icon" width={16} height={16} />
          </button>
        </div>
      }
    </div>
  );
}

/**
 * Initialize the map
 * @param mapRef The div tag to render the map into
 * @param initialPosition The location to center the map to
 */
async function initMap(
  mapRef: RefObject<HTMLDivElement>,
  initialPosition: { lat: number; lon: number },
) {
  const loader = new GoogleMapsLoader({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    version: "weekly",
  });

  const { Map } = await loader.importLibrary("maps");

  // Options
  const mapOptions: google.maps.MapOptions = {
    center: { lat: initialPosition.lat, lng: initialPosition.lon },
    zoom: 14,
    disableDefaultUI: true,
    mapId: "1c734fac6c1f1588",
    clickableIcons: false,
  };

  const map = new Map(mapRef.current as HTMLDivElement, mapOptions);

  return map;
}

/**
 * Add markers to the map
 */
async function initMarkers(
  map: google.maps.Map,
  businesses: any[],
  markers: google.maps.marker.AdvancedMarkerElement[],
  setSelectedBusiness: ({
    business,
    index,
  }: {
    business: any;
    index: number;
  }) => void,
  selectedBusiness?: { business: any; index: number } | null,
) {
  // Clear markers
  for (const marker of markers) {
    marker.map = null;
  }

  const loader = new GoogleMapsLoader({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    version: "weekly",
  });
  const { AdvancedMarkerElement } = await loader.importLibrary("marker");

  const newMarkers = businesses.map((business, i) => {
    const isSelected = selectedBusiness?.index === i;

    // Create marker
    const marker = new AdvancedMarkerElement({
      position: { lat: business.location[1], lng: business.location[0] },
      map,
      content: isSelected
        ? createBadgeElement(business.businessName)
        : createDotElement(),
      zIndex: isSelected ? 1000 : 0,
      gmpClickable: true,
    });

    // Click event for marker
    marker.addEventListener("gmp-click", () => {
      marker.content = createBadgeElement(business.businessName);
      marker.zIndex = 1000;
      setSelectedBusiness({ business, index: i });
    });

    return marker;
  });

  return newMarkers;
}

function createDotElement(): HTMLElement {
  const div = document.createElement("div");
  div.style.width = "18px";
  div.style.height = "18px";
  div.style.borderRadius = "50%";
  div.style.backgroundColor = "black";
  div.style.border = "1px solid white";
  return div;
}

function createBadgeElement(title: string): HTMLElement {
  const div = document.createElement("div");
  div.style.padding = "8px 18px";
  div.style.borderRadius = "8px";
  div.style.backgroundColor = "#E5FF75";
  div.style.color = "black";
  div.style.fontSize = "16px";
  div.style.fontFamily = "Arial, sans-serif";
  div.style.fontWeight = "bold";
  div.style.whiteSpace = "nowrap";
  div.textContent = title;
  return div;
}

/**
 * Center the map to a specific marker
 * @param lat
 * @param lon
 * @param map
 */
function goToMarker(lat: number, lon: number, map: google.maps.Map) {
  map.setCenter(new google.maps.LatLng(lat, lon));
  map.setZoom(15);
}
