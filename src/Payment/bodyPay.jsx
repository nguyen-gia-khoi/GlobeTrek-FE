import React from 'react';
import Header from '../header1/Header.jsx';
import TourBooking from './TourBooking.jsx';
import Footer from '../footer/Footer.jsx';

function BodyPay() {
  return (
    <div className="bg-[#f8fafc] min-h-screen flex flex-col justify-between">
      <Header />
      <main className="pt-28 pb-16">
        <TourBooking />
      </main>
      <Footer />
    </div>
  );
}

export default BodyPay;