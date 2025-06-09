import React, { useState, useEffect } from 'react';
import './Add.css';
import { basicRequest } from '../AxiosCreate';

function Add({ stopAd }) {
    const [imgSrc, setImgSrc] = useState('');

    useEffect(() => {
        async function getAd() {
            try {
                const response = await basicRequest.get('/student/getad');
                const data = response.data;

                const updateImage = () => {
                    const isMobile = window.innerWidth <= 750;
                    const matchedAd = data.find(item =>
                        isMobile ? item.view_type === 'Mobile' : item.view_type === 'Desktop'
                    );

                    if (matchedAd) {
                        setImgSrc(`https://techwingsys.com/billtws/uploads/popup/${matchedAd.file}`);
                    } else {
                        setImgSrc('');
                    }
                };

                updateImage(); // Set initially
                window.addEventListener('resize', updateImage);

                // Clean up the event listener
                return () => window.removeEventListener('resize', updateImage);

            } catch (error) {
                console.log("Error from ad getting", error);
            }
        }

        getAd();
    }, []);

    const ad = {
        phonesrc: 'https://www.techwingsys.com/tech101.png',
        lapsrc: 'https://www.techwingsys.com/tech100.png'
    };

    // useEffect(() => {
    //     const updateImage = () => {
    //         if (window.innerWidth <= 750) {
    //             setImgSrc(ad.phonesrc);
    //         } else {
    //             setImgSrc(ad.lapsrc);
    //         }
    //     };

    //     updateImage();
    //     window.addEventListener('resize', updateImage);
    // }, []);

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
