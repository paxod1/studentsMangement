import React, { useState, useEffect } from 'react';
import './Add.css';

function Add({ stopAd }) {
    const [imgSrc, setImgSrc] = useState('');

    const ad = {
        phonesrc: 'https://www.techwingsys.com/tech101.png',
        lapsrc: 'https://www.techwingsys.com/tech100.png'
    };

    useEffect(() => {
        const updateImage = () => {
            if (window.innerWidth <= 750) {
                setImgSrc(ad.phonesrc);
            } else {
                setImgSrc(ad.lapsrc);
            }
        };

        updateImage();
        window.addEventListener('resize', updateImage); 
    }, []);

    function clearAddPage() {
        stopAd(false);
    }

    return (
        <div className="ad-container">
            <div className="ad-card">
                <img
                    src={imgSrc}
                    alt="Ad"
                    className="ad-image"
                />
                <button className="close-btn" onClick={clearAddPage}>✖</button>
            </div>
        </div>
    );
}

export default Add;
