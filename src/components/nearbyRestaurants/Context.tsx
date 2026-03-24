"use client";

import getBusinessesByLocation from "@/functions/getBusinessesByLocation";
import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { Bounds } from "@/utils/getMapBounds";

export const NearbyRestaurantsContext = createContext<{
  businesses: any[] | null;
  selectedBusiness: { business: any; index: number } | null;
  setSelectedBusiness: React.Dispatch<
    React.SetStateAction<{ business: any; index: number } | null>
  >;
  addressFieldLocation: { lat: number; lon: number } | null;
  clientLocation: { lat: number; lon: number } | null;
  setClientLocation: React.Dispatch<
    React.SetStateAction<{ lat: number; lon: number } | null>
  >;
  setAddressFieldLocation: React.Dispatch<
    React.SetStateAction<{ lat: number; lon: number } | null>
  >;
  bounds: Bounds | null;
  setBounds: React.Dispatch<React.SetStateAction<Bounds | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  businesses: [],
  selectedBusiness: null,
  setSelectedBusiness: () => {},
  clientLocation: null,
  setClientLocation: () => {},
  addressFieldLocation: null,
  setAddressFieldLocation: () => {},
  bounds: null,
  setBounds: () => {},
  loading: true,
  setLoading: () => {},
});

export function NearbyRestaurantsProvider({ children }: { children: any }) {
  const [selectedBusiness, setSelectedBusiness] = useState<{
    business: any;
    index: number;
  } | null>(null);
  const [clientLocation, setClientLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [addressFieldLocation, setAddressFieldLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [businesses, setBusinesses] = useState<any[] | null>(null);
  const [bounds, setBounds] = useState<Bounds | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Debounced fetch — waits 300ms after the last bounds change before fetching
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevBusinessIdsRef = useRef<string>("");

  useEffect(() => {
    if (!bounds) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const centerLat = (bounds.lat.min + bounds.lat.max) / 2;
      const centerLon = (bounds.lon.min + bounds.lon.max) / 2;
      setLoading(true);
      getBusinessesByLocation(
        centerLat,
        centerLon,
        bounds.lat.min,
        bounds.lon.min,
        bounds.lat.max,
        bounds.lon.max,
      ).then((data) => {
        if (data) {
          // Only update if the business list actually changed
          const newIds = data.map((b: any) => b.id).sort().join(",");
          if (newIds !== prevBusinessIdsRef.current) {
            prevBusinessIdsRef.current = newIds;
            setBusinesses(data);
          }
        }
        setLoading(false);
      });
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [bounds]);

  const value = {
    businesses,
    selectedBusiness,
    setSelectedBusiness,
    clientLocation,
    setClientLocation,
    addressFieldLocation,
    setAddressFieldLocation,
    bounds,
    setBounds,
    loading,
    setLoading,
  };

  return (
    <NearbyRestaurantsContext.Provider value={value}>
      {children}
    </NearbyRestaurantsContext.Provider>
  );
}
