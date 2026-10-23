import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faVanShuttle, faClock } from '@fortawesome/free-solid-svg-icons';

function Map({ tour }) {
  const locationName = tour?.location || 'Việt Nam';
  const mapQuery = encodeURIComponent(locationName);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-7">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#4CA771] flex items-center justify-center text-lg flex-shrink-0">
          <FontAwesomeIcon icon={faVanShuttle} />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Điểm đón & Tập trung</h3>
          <p className="text-xs text-slate-500">Thông tin địa điểm đón khách và hướng dẫn tập trung khởi hành.</p>
        </div>
      </div>

      <div className="space-y-3 mb-4 text-xs sm:text-sm text-slate-700">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faLocationDot} className="text-[#4CA771]" />
          <span>Điểm tập trung chính: <strong className="text-slate-900">{locationName}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faClock} className="text-[#4CA771]" />
          <span>Thời gian tập trung: <strong>Trước giờ khởi hành 30 phút</strong></span>
        </div>
      </div>

      <div className="w-full h-56 rounded-2xl overflow-hidden shadow-inner border border-slate-200">
        <iframe
          title="Pickup Location Map"
          src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}

export default Map;
