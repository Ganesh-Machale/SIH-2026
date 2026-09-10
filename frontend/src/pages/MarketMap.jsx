import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Map as MapIcon, MapPin, Truck, Sparkles, Building2, ShoppingBag } from 'lucide-react';
import axios from 'axios';

// Fix default leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom green marker icon for recommended mandi
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom red marker icon for farmer origin
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom orange marker icon for buyers
const orangeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const MarketMap = () => {
  const { activeProduce } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const farmerCoords = [20.0059, 73.7898]; // Nashik coordinates

  const mapLocations = [
    { name: 'Lasalgaon Mandi (RECOMMENDED)', lat: 20.1472, lon: 74.2274, price: 4600, dist: 145, net: 218500, isBest: true },
    { name: 'Pune APMC Market', lat: 18.5204, lon: 73.8567, price: 4750, dist: 210, net: 211800, isBest: false },
    { name: 'Pimpalgaon Baswant', lat: 20.1667, lon: 73.9833, price: 4550, dist: 35, net: 214000, isBest: false },
    { name: 'Solapur APMC', lat: 17.6599, lon: 75.9064, price: 4400, dist: 310, net: 198000, isBest: false },
    { name: 'Nagpur APMC', lat: 21.1458, lon: 79.0882, price: 4900, dist: 700, net: 203000, isBest: false },
  ];

  const buyerLocations = [
    { name: 'ABC Agro Processing Pvt Ltd', lat: 20.1400, lon: 74.2100, offered: 4700, terms: '7-day bank transfer', match: '92%' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-1">
            <MapIcon size={14} />
            <span>OpenStreetMap Logistics Visualization</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Interactive Agricultural Market Map</h1>
          <p className="text-xs text-slate-500">
            Geospatial route mapping connecting Nashik farm origin to Maharashtra mandis and buyer facilities
          </p>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 overflow-hidden">
        <div className="h-[500px] w-full rounded-2xl overflow-hidden z-10 relative">
          <MapContainer center={farmerCoords} zoom={8} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Farmer Marker */}
            <Marker position={farmerCoords} icon={redIcon}>
              <Popup>
                <div className="text-xs p-1 space-y-1">
                  <p className="font-extrabold text-slate-900">🌾 Your Farm Origin</p>
                  <p className="text-slate-600">Location: Nashik, MH</p>
                  <p className="font-bold text-emerald-700">Produce: 5,000 kg Grade A Onion</p>
                </div>
              </Popup>
            </Marker>

            {/* Mandi Markers and Routes */}
            {mapLocations.map((m, idx) => {
              const mandiCoords = [m.lat, m.lon];
              return (
                <React.Fragment key={idx}>
                  <Marker position={mandiCoords} icon={m.isBest ? greenIcon : new L.Icon.Default()}>
                    <Popup>
                      <div className="text-xs p-1 space-y-1">
                        <p className="font-extrabold text-slate-900">{m.name}</p>
                        <p className="text-slate-600">Distance: {m.dist} km</p>
                        <p className="font-bold text-slate-800">Listed Price: ₹{m.price}/q</p>
                        <div className="bg-emerald-100 p-1.5 rounded-lg border border-emerald-300 text-emerald-950 font-extrabold mt-1">
                          Expected Net: ₹{m.net.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Route Polyline from farmer to mandi */}
                  <Polyline
                    positions={[farmerCoords, mandiCoords]}
                    color={m.isBest ? '#16a34a' : '#94a3b8'}
                    weight={m.isBest ? 4 : 2}
                    dashArray={m.isBest ? null : '5, 5'}
                  />
                </React.Fragment>
              );
            })}

            {/* Buyer Marker */}
            {buyerLocations.map((b, idx) => (
              <Marker key={idx} position={[b.lat, b.lon]} icon={orangeIcon}>
                <Popup>
                  <div className="text-xs p-1 space-y-1">
                    <p className="font-extrabold text-slate-900">🏢 Direct Buyer: {b.name}</p>
                    <p className="font-bold text-emerald-700">Offered Price: ₹{b.offered}/q</p>
                    <p className="text-slate-600">Match Score: {b.match}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};
