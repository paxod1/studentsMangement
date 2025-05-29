import React, { useEffect, useState } from 'react';
import './PaymentAlert.css';

function DueDateAlert({ dueDateProp }) {
    const [daysLeft, setDaysLeft] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [formattedDate, setFormattedDate] = useState(null);

    useEffect(() => {
        if (dueDateProp) {
            const today = new Date();
            const dueDateObj = new Date(dueDateProp);

            const diffTime = dueDateObj - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays >= 0 && diffDays <= 7) {
                setDaysLeft(diffDays);
                setShowAlert(true);

                // Format date as DD-MM-YYYY
                const day = String(dueDateObj.getDate()).padStart(2, '0');
                const month = String(dueDateObj.getMonth() + 1).padStart(2, '0');
                const year = dueDateObj.getFullYear();
                const formatted = `${day}-${month}-${year}`;

                setFormattedDate(formatted);
            }
        }
    }, [dueDateProp]);


    const handleClose = () => {
        setShowAlert(false);
    };

    return (
        <>
            {showAlert && (
                <div className='main-showAlert'>
                    <div className='payment-alert-box'>
                        <span className="close-btn" onClick={handleClose}>×</span>
                        ⚠️ <strong>Payment Alert:</strong> {daysLeft} day{daysLeft !== 1 ? 's' : ''} to pay — Due on: {formattedDate}
                    </div>
                </div>
            )}

        </>
    );
}

export default DueDateAlert;
