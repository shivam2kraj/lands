import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

const LandsPage = () => {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://prod-be.1acre.in/lands/?ordering=-updated_at&page=${page}&page_size=10`);
        const newLands = response.data.results;
        setLands(prevLands => [...prevLands, ...newLands]);
        setHasMore(response.data.next !== null);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [page]);

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const renderLands = () => {
    return lands.map(land => (
      <div key={land.id} className="land-card">
        <LandCard land={land} />
      </div>
    ));
  };

  return (
    <div className="container">
      <div className="lands-list">
        {loading && <Loader />}
        {!loading && renderLands()}
        {hasMore && !loading && <Loader />}
      </div>
    </div>
  );
};

const LandCard = ({ land }) => {
  const { title, land_media } = land;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const navigateImage = (direction) => {
    if (direction === 'prev') {
      setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? land_media.length - 1 : prevIndex - 1));
    } else if (direction === 'next') {
      setCurrentImageIndex((prevIndex) => (prevIndex === land_media.length - 1 ? 0 : prevIndex + 1));
    }
  };

  const mainImage = land_media.length > 0 ? land_media[currentImageIndex].image : '';

  return (
    <div className="image-container">
      <BsChevronLeft className="arrow-icon left-arrow" onClick={() => navigateImage('prev')} />
      <img src={mainImage} alt={title} className="land-image" />
      <BsChevronRight className="arrow-icon right-arrow" onClick={() => navigateImage('next')} />
      <p>Kundaram, Lingala Ghanpur Jangoan(dt)</p>
    </div>
  );
};

const Loader = () => {
  return <div className="loader"></div>;
};

export default LandsPage;



