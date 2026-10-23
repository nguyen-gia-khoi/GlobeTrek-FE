import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../fontawesome'; // Ensure this file configures FontAwesome correctly

function Location() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust time if needed
  }, []);

  return (
    <div className="container mx-auto my-4 justify-center sm:w-[70%] max-w-[1280px]">
      <div className="sm:w-[68%] ml-4 sm:ml-0 flex sm:flex-row items-center p-4">
        <div className="flex items-center sm:mb-0">
          {loading ? (
            <Skeleton
              circle={true}
              height={24}
              width={24}
              className="mr-2"
              color="#cccccc"
              highlightColor="#cccccc"
            />
          ) : (
            <FontAwesomeIcon icon="fa-solid fa-location-dot" className="mr-2" />
          )}
          <div className="p-2 text-black text-sm font-bold sm:text-base">
            {loading ? (
              <Skeleton width={150} height={20} color="#202020" highlightColor="#cccccc" />
            ) : (
              'Vị trí hiện tại của bạn'
            )}
          </div>
        </div>

        <div className="flex items-center sm:w-auto">
          <div className="bg-white rounded-full border border-[#4CA771] p-2 flex items-center w-full sm:w-auto">
            {loading ? (
              <>
                <Skeleton width={80} height={20} color="#e0e0e0" highlightColor="#cccccc" className="mr-2" />
                <Skeleton width={1} height={28} color="#4CA771" highlightColor="#cccccc" />
                <Skeleton width={80} height={20} color="#e0e0e0" highlightColor="#cccccc" className="ml-2" />
              </>
            ) : (
              <>
                <div className="text-black font-bold sm:text-base text-sm mr-2 whitespace-nowrap">
                  Việt Nam
                </div>
                <div className="w-[0.5px] h-7 bg-[#4CA771]"></div>
                <div className="text-[#4CA771] ml-1 font-bold sm:text-base text-sm cursor-pointer whitespace-nowrap">
                  Thay đổi
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Link
        to="/product-body"
        className="bg-[#4CA771] hover:bg-[#3d8b5d] sm:rounded-full rounded-lg w-[80%] ml-4 sm:w-auto sm:px-6 mt-4 p-2.5 font-bold justify-center text-white text-sm flex items-center shadow hover:shadow-md transition-all duration-200 cursor-pointer"
      >
        {loading ? (
          <Skeleton width={200} height={20} color="#202020" highlightColor="#cccccc" className="mr-2" />
        ) : (
          <>
            <div className="px-2">Xem các hoạt động ở vị trí của bạn</div>
            <FontAwesomeIcon icon="fa-solid fa-arrow-right" className="text-xs" />
          </>
        )}
      </Link>
    </div>
  );
}

export default Location;
