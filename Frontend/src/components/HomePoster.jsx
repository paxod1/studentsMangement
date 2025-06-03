import React, { useState } from 'react';
import { Carousel } from 'react-bootstrap';
import './HomePoster.css';

function HomePoster() {
  const [posterData] = useState([
    'https://techwingsys.com/banner_2.png',
    'https://techwingsys.com/banner_1.png',
    'https://techwingsys.com/banner_3.png',
    'https://techwingsys.com/banner_4.png',
    'https://techwingsys.com/banner_5.png',
    'https://techwingsys.com/banner_6.png',
    'https://techwingsys.com/banner_7.png'
  ]);

  return (
    <div className="home-poster-container">
      <Carousel fade interval={3000}>
        {posterData.map((src, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block poster-img"
              src={src}
              alt={`Slide ${index + 1}`}
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}

export default HomePoster;