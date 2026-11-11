"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, Info, ExternalLink } from "lucide-react";

export interface BranchMapLocation {
  id: string;
  name: string;
  city: string;
  area: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  activeMembers: number;
  revenuePKR: number;
  status: string;
  isComingSoon?: boolean;
}

interface BranchMapProps {
  branches: BranchMapLocation[];
  selectedBranchId: string | null;
  onSelectBranch?: (id: string | null) => void;
  className?: string;
}

export const BranchMap: React.FC<BranchMapProps> = ({
  branches,
  selectedBranchId,
  onSelectBranch,
  className = "",
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [id: string]: any }>({});
  const [mapReady, setMapReady] = useState(false);

  // Filter to active branches that have confirmed coordinates
  const activeBranches = branches.filter(
    (b) => !b.isComingSoon && b.latitude !== null && b.longitude !== null
  );

  const comingSoonBranches = branches.filter((b) => b.isComingSoon);

  useEffect(() => {
    let isMounted = true;

    // Load Leaflet dynamically to avoid SSR window issues
    async function initMap() {
      if (!mapContainerRef.current) return;

      // Inject Leaflet CSS if not already present
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      const L = await import("leaflet");

      if (!isMounted || !mapContainerRef.current) return;

      // Prevent re-initialization
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // Initialize map centered roughly between Karachi and Islamabad
      const map = L.map(mapContainerRef.current, {
        center: [28.5, 70.0],
        zoom: 5.5,
        zoomControl: false,
        attributionControl: false,
      });

      // Add Zoom control on bottom-right
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // OpenStreetMap tile layer with dark CSS filter (reliable, no API key required)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        className: "osm-dark-tiles",
      }).addTo(map);

      // Sizing pins: scale radius proportionally by member volume (14px to 26px)
      const maxMembers = Math.max(...activeBranches.map((b) => b.activeMembers), 1);
      const minMembers = Math.min(...activeBranches.map((b) => b.activeMembers), 1);

      activeBranches.forEach((b) => {
        if (b.latitude === null || b.longitude === null) return;

        // Relative radius calculation
        const normalized = (b.activeMembers - minMembers) / (maxMembers - minMembers || 1);
        const pinSize = Math.round(18 + normalized * 14); // 18px to 32px
        const pulseSize = pinSize + 14;

        const isCurrentScope = selectedBranchId === b.id;

        // Custom HTML DivIcon with glowing gold rings and member count badge
        const customIcon = L.divIcon({
          className: "apollo-custom-marker",
          html: `
            <div style="position: relative; width: ${pulseSize}px; height: ${pulseSize}px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
              <div style="position: absolute; width: ${pulseSize}px; height: ${pulseSize}px; border-radius: 9999px; background: rgba(255, 217, 28, 0.25); border: 1.5px solid rgba(255, 217, 28, 0.6); animation: ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <div style="position: relative; width: ${pinSize}px; height: ${pinSize}px; border-radius: 9999px; background: #FFD91C; color: #050505; font-weight: 800; font-size: ${pinSize > 24 ? "10px" : "9px"}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 16px rgba(255, 217, 28, 0.7); border: 2px solid #050505;">
                ${b.name.includes("Seaview") ? "SV" : b.name.includes("Clifton") ? "CF" : b.name.includes("LuckyOne") ? "L1" : "AJ"}
              </div>
            </div>
          `,
          iconSize: [pulseSize, pulseSize],
          iconAnchor: [pulseSize / 2, pulseSize / 2],
        });

        const marker = L.marker([b.latitude, b.longitude], { icon: customIcon }).addTo(map);

        // Rich TRI FIT dark popup
        const popupContent = `
          <div style="font-family: Inter, sans-serif; min-width: 200px; padding: 4px; color: #ffffff;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
              <span style="font-weight: 800; font-size: 13px; color: #ffffff;">${b.name}</span>
              <span style="font-size: 9px; font-weight: 700; background: rgba(255, 217, 28, 0.2); color: #FFD91C; padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(255, 217, 28, 0.4);">${b.city}</span>
            </div>
            <div style="font-size: 11px; font-weight: 600; color: #FFD91C; margin-bottom: 4px;">
              ${b.area}
            </div>
            <div style="font-size: 10px; color: #9ca3af; margin-bottom: 8px;">
              ${b.address}
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; padding-top: 6px; border-top: 1px solid rgba(255, 255, 255, 0.1); font-size: 11px;">
              <div>
                <span style="color: #9ca3af; font-size: 9.5px; display: block;">MEMBERS</span>
                <span style="font-weight: 800; color: #ffffff;">${b.activeMembers.toLocaleString()}</span>
              </div>
              <div>
                <span style="color: #9ca3af; font-size: 9.5px; display: block;">MONTHLY REV</span>
                <span style="font-weight: 800; color: #FFD91C;">PKR ${(b.revenuePKR / 1000000).toFixed(2)}M</span>
              </div>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          className: "apollo-leaflet-popup",
          closeButton: false,
        });

        marker.on("click", () => {
          if (onSelectBranch) onSelectBranch(b.id);
        });

        markersRef.current[b.id] = marker;
      });

      // Fit bounds to all active pins initially
      if (activeBranches.length > 0) {
        const bounds = L.latLngBounds(
          activeBranches.map((b) => [b.latitude!, b.longitude!])
        );
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 11 });
      }

      mapInstanceRef.current = map;
      setMapReady(true);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle selected branch zoom & flyTo
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    if (selectedBranchId) {
      const target = activeBranches.find((b) => b.id === selectedBranchId);
      if (target && target.latitude !== null && target.longitude !== null) {
        map.flyTo([target.latitude, target.longitude], 13.5, {
          duration: 1.4,
          easeLinearity: 0.25,
        });

        const marker = markersRef.current[target.id];
        if (marker) {
          setTimeout(() => marker.openPopup(), 1200);
        }
      }
    } else {
      // "All Branches" selected: fit bounds across Pakistan
      if (activeBranches.length > 0) {
        import("leaflet").then((L) => {
          const bounds = L.latLngBounds(
            activeBranches.map((b) => [b.latitude!, b.longitude!])
          );
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 11 });
        });
      }
    }
  }, [selectedBranchId, mapReady]);

  const handleCityFocus = (city: "karachi" | "islamabad" | "all") => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (city === "karachi") {
      map.flyTo([24.86, 67.05], 11.5, { duration: 1.2 });
    } else if (city === "islamabad") {
      map.flyTo([33.60, 73.12], 12.5, { duration: 1.2 });
    } else {
      import("leaflet").then((L) => {
        const bounds = L.latLngBounds(
          activeBranches.map((b) => [b.latitude!, b.longitude!])
        );
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 11 });
      });
    }
  };

  return (
    <div className={`relative w-full h-full min-h-[380px] rounded-[18px] overflow-hidden border border-border select-none ${className}`}>
      {/* Map container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[380px] bg-[#0d0d0d]" />

      {/* Top Left: Cluster Controls */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-1.5 p-1 rounded-[12px] bg-black/85 backdrop-blur-md border border-border shadow-lg">
        <button
          onClick={() => handleCityFocus("all")}
          className="px-2.5 py-1 rounded-[8px] text-[11px] font-[700] text-gray-200 hover:text-accent hover:bg-white/10 transition-colors"
        >
          All Pakistan (4)
        </button>
        <span className="text-gray-600 text-xs">•</span>
        <button
          onClick={() => handleCityFocus("karachi")}
          className="px-2.5 py-1 rounded-[8px] text-[11px] font-[700] text-gray-200 hover:text-accent hover:bg-white/10 transition-colors"
        >
          Karachi (3)
        </button>
        <span className="text-gray-600 text-xs">•</span>
        <button
          onClick={() => handleCityFocus("islamabad")}
          className="px-2.5 py-1 rounded-[8px] text-[11px] font-[700] text-gray-200 hover:text-accent hover:bg-white/10 transition-colors"
        >
          Islamabad (1)
        </button>
      </div>

      {/* Top Right: Pin Legend & Soha Mall Notice */}
      <div className="absolute top-3 right-3 z-[400] flex flex-col gap-2 items-end">
        {/* Active Pins Info */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-[12px] bg-black/85 backdrop-blur-md border border-border text-[11px] font-[600] text-gray-200 shadow-lg">
          <div className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_8px_#FFD91C]" />
          <span>Pins sized by member volume</span>
        </div>

        {/* Soha Mall Coming Soon (No Pin) badge per user requirement */}
        {comingSoonBranches.map((cs) => (
          <div
            key={cs.id}
            className="flex items-center gap-2 px-3 py-1.5 rounded-[12px] bg-black/90 backdrop-blur-md border border-amber-500/40 text-[11px] shadow-lg animate-in fade-in"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <div className="text-left">
              <span className="font-bold text-gray-200 block leading-tight">{cs.name}</span>
              <span className="text-amber-400 font-medium text-[10px] block leading-tight">
                Coming soon (City TBC • No map pin)
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Left: OpenStreetMap Dark Tiles Attribution */}
      <div className="absolute bottom-2 left-3 z-[400] text-[9.5px] text-gray-500 bg-black/70 px-2 py-0.5 rounded-[6px] backdrop-blur-sm pointer-events-none">
        OpenStreetMap • CartoDB Dark Matter
      </div>
    </div>
  );
};
