import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapLocationDot,
  faLocationDot,
  faPhoneVolume,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

function GoogleMap({ tour }) {
  const locationName = tour?.location || tour?.destination?.name || "Việt Nam";
  const mapQuery = encodeURIComponent(locationName);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 mb-8">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2.5">
        <FontAwesomeIcon icon={faMapLocationDot} className="text-[#4CA771]" />
        <span>Điểm đến & Vị trí</span>
      </h2>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faLocationDot} className="text-[#4CA771]" />
          <span>Điểm tập trung & Khởi hành: <strong className="text-slate-800">{locationName}</strong></span>
        </div>

        {tour?.contact && (
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-700">
              <FontAwesomeIcon icon={faPhoneVolume} className="text-[#4CA771]" />
              <span>{tour.contact}</span>
            </span>
          </div>
        )}
      </div>

      {/* Map iframe */}
      <div className="w-full h-72 sm:h-80 rounded-2xl overflow-hidden shadow-inner border border-slate-200">
        <iframe
          title="Tour Location Map"
          src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}

export default GoogleMap;
