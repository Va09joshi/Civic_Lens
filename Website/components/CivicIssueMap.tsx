"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaExclamationTriangle, FaTools, FaWater, FaRoad, FaTrash, FaBolt } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with Next.js/Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Civic issue data with Indian city locations
const civicIssues = [
  {
    id: 1,
    lat: 28.6139,
    lng: 77.209,
    city: "New Delhi",
    title: "Broken Road Surface",
    category: "Roads & Infrastructure",
    severity: "High",
    description: "Major pothole cluster on NH-48 near Dhaula Kuan causing accidents. Multiple complaints filed.",
    image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400&h=250&fit=crop",
    icon: FaRoad,
    color: "#ef4444",
    reports: 47
  },
  {
    id: 2,
    lat: 19.076,
    lng: 72.8777,
    city: "Mumbai",
    title: "Waterlogging Crisis",
    category: "Drainage & Water",
    severity: "Critical",
    description: "Severe waterlogging in Andheri East during monsoon. Drainage system overwhelmed, residents stranded.",
    image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=400&h=250&fit=crop",
    icon: FaWater,
    color: "#3b82f6",
    reports: 128
  },
  {
    id: 3,
    lat: 12.9716,
    lng: 77.5946,
    city: "Bengaluru",
    title: "Garbage Overflow",
    category: "Waste Management",
    severity: "Medium",
    description: "Uncollected garbage piling up at Koramangala junction. Health hazard increasing daily.",
    image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&h=250&fit=crop",
    icon: FaTrash,
    color: "#f59e0b",
    reports: 63
  },
  {
    id: 4,
    lat: 22.5726,
    lng: 88.3639,
    city: "Kolkata",
    title: "Power Outage Zone",
    category: "Electricity",
    severity: "High",
    description: "Frequent power cuts in Salt Lake Sector V affecting IT companies and residents for 4+ hours daily.",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=250&fit=crop",
    icon: FaBolt,
    color: "#8b5cf6",
    reports: 89
  },
  {
    id: 5,
    lat: 17.385,
    lng: 78.4867,
    city: "Hyderabad",
    title: "Construction Hazard",
    category: "Public Safety",
    severity: "Critical",
    description: "Unfinished metro construction debris blocking roads near Ameerpet. No safety barricades installed.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=250&fit=crop",
    icon: FaTools,
    color: "#ec4899",
    reports: 34
  },
  {
    id: 6,
    lat: 13.0827,
    lng: 80.2707,
    city: "Chennai",
    title: "Flooding Risk",
    category: "Drainage & Water",
    severity: "High",
    description: "Storm drains blocked by construction debris in T. Nagar. Previous flooding incidents reported.",
    image: "https://images.unsplash.com/photo-1446034295857-c899f4c4e093?w=400&h=250&fit=crop",
    icon: FaWater,
    color: "#06b6d4",
    reports: 72
  }
];

const severityColors: Record<string, string> = {
  Critical: "bg-red-500",
  High: "bg-orange-500",
  Medium: "bg-yellow-500",
  Low: "bg-green-500"
};

const createCustomIcon = (color: string, isActive: boolean) => {
  return L.divIcon({
    className: 'custom-marker-icon',
    html: `
      <div class="relative flex items-center justify-center w-full h-full">
        ${isActive ? `
          <div class="absolute w-8 h-8 rounded-full opacity-30 animate-ping" style="background-color: ${color}"></div>
          <div class="absolute w-5 h-5 rounded-full opacity-50 animate-pulse" style="background-color: ${color}"></div>
        ` : ''}
        <div class="w-3.5 h-3.5 rounded-full border-[2.5px] border-white z-10 shadow-sm transition-transform duration-300 ${isActive ? 'scale-125' : ''}" style="background-color: ${color}; box-shadow: 0 0 6px ${color}80"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

function MapController({ activeIssue }: { activeIssue: number | null }) {
  const map = useMap();
  useEffect(() => {
    if (activeIssue !== null) {
      const issue = civicIssues.find(i => i.id === activeIssue);
      if (issue) {
        map.flyTo([issue.lat, issue.lng], 10, { duration: 1.5 });
      }
    }
  }, [activeIssue, map]);
  return null;
}

export default function CivicIssueMap() {
  const [activeIssue, setActiveIssue] = useState<number | null>(null);
  const [hoveredIssue, setHoveredIssue] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="rounded-3xl border border-slate-200 bg-white p-6 md:p-10 shadow-float overflow-hidden"
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8 text-center"
      >
        <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">Live Civic Radar</p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Issue Hotspot Map
        </h2>
        <p className="mt-3 text-slate-500 max-w-2xl mx-auto">
          Real-time civic issues reported across India. Click on markers to view details, images, and community reports.
        </p>
      </motion.div>

      {/* Map + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2 relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 min-h-[420px] md:min-h-[500px]"
        >
          {isMounted ? (
            <MapContainer 
              center={[22.5937, 78.9629]} 
              zoom={5} 
              scrollWheelZoom={false}
              style={{ height: '100%', width: '100%', minHeight: '500px', zIndex: 10 }}
            >
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              <MapController activeIssue={activeIssue} />
              
              {civicIssues.map((issue) => {
                const isActive = activeIssue === issue.id || hoveredIssue === issue.id;
                return (
                  <Marker
                    key={issue.id}
                    position={[issue.lat, issue.lng]}
                    icon={createCustomIcon(issue.color, isActive)}
                    eventHandlers={{
                      click: () => setActiveIssue(isActive ? null : issue.id),
                      mouseover: () => setHoveredIssue(issue.id),
                      mouseout: () => setHoveredIssue(null)
                    }}
                  >
                    <Popup className="custom-leaflet-popup" closeButton={false} autoPan={true}>
                      <div className="w-[240px] -m-0 overflow-hidden">
                        <div className="relative h-32 overflow-hidden">
                          <img src={issue.image} alt={issue.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                          <div className="absolute bottom-2 left-3 right-3">
                            <p className="text-white font-bold text-[14px] leading-tight drop-shadow-lg m-0">{issue.title}</p>
                            <p className="text-white/90 text-[11px] mt-0.5 m-0">{issue.city}</p>
                          </div>
                          <span className={`absolute top-2 right-2 ${severityColors[issue.severity]} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                            {issue.severity}
                          </span>
                        </div>
                        <div className="p-3 bg-white">
                          <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-2 m-0">{issue.description}</p>
                          <div className="flex items-center justify-between mt-2.5">
                            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full m-0">{issue.category}</span>
                            <span className="text-[10px] font-bold text-slate-500 m-0">{issue.reports} reports</span>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center opacity-50">
              <FaMapMarkerAlt size={24} className="text-slate-400 mb-2 animate-bounce" />
              <p className="text-sm font-semibold text-slate-500">Loading interactive map...</p>
            </div>
          )}

          {/* Legend overlay on top of map */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 px-4 py-3 shadow-lg z-[1000] pointer-events-none">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 m-0">Severity</p>
            <div className="flex gap-3">
              {["Critical", "High", "Medium"].map(sev => (
                <div key={sev} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${severityColors[sev]}`} />
                  <span className="text-[10px] font-medium text-slate-600 m-0">{sev}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Sidebar — Issue Cards */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin"
        >
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 sticky top-0 bg-white py-2 z-10">
            Reported Issues ({civicIssues.length})
          </p>
          {civicIssues.map((issue, idx) => {
            const Icon = issue.icon;
            const isActive = activeIssue === issue.id;
            return (
              <motion.button
                key={issue.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 + 0.3, duration: 0.4 }}
                onClick={() => setActiveIssue(isActive ? null : issue.id)}
                onMouseEnter={() => setHoveredIssue(issue.id)}
                onMouseLeave={() => setHoveredIssue(null)}
                className={`w-full text-left rounded-xl border p-3 transition-all duration-300 group ${
                  isActive
                    ? "border-blue-400 bg-blue-50 shadow-md ring-2 ring-blue-200"
                    : "border-slate-100 bg-slate-50 hover:border-blue-200 hover:bg-white hover:shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: issue.color + "18", color: issue.color }}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-700 transition-colors">
                        {issue.title}
                      </h4>
                      <span className={`${severityColors[issue.severity]} text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0`}>
                        {issue.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{issue.city} • {issue.category}</p>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                        className="mt-2 overflow-hidden"
                      >
                        <div className="rounded-lg overflow-hidden border border-slate-200 mb-2">
                          <img src={issue.image} alt={issue.title} className="w-full h-28 object-cover" />
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{issue.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                            {issue.reports} reports
                          </span>
                          <span className="text-[10px] text-slate-400">
                            <FaExclamationTriangle className="inline mr-0.5" size={9} />
                            Verified issue
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}
