import React, { useState, useEffect } from 'react';
import './add.css';

function Add({ stopAd }) {
    const [imgSrc, setImgSrc] = useState('');

    const ad = {
        phonesrc: 'https://webneel.com/daily/sites/default/files/images/daily/06-2016/18-lg-washing-machine-print-ads-by-david-pinilla.jpg',
        lapsrc: 'https://hawkeditorial.co.uk/wp-content/uploads/2012/01/bigstock-132512864.jpg'
    };

    useEffect(() => {
        const updateImage = () => {
            if (window.innerWidth <= 700) {
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
