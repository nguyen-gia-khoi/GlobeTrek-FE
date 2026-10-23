import React from 'react';
import Topbody from './Topbody.jsx';
import Location from './Location.jsx';
import FeaturedTours from './FeaturedTours.jsx';
import SiderInfo from './SiderInfo.jsx';
import Header from '../header1/Header.jsx';
import Footer from '../footer/Footer.jsx';

function Body() {
  return (
    <div className="bg-[rgba(174,249,231,0.2)]">
      <Header />
      <Topbody />
      <Location />
      <FeaturedTours />
      <SiderInfo />
      <div className="max-sm:hidden">
        <Footer />
      </div>
    </div>
  );
}

export default Body;