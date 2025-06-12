import React, { useState, useEffect } from 'react';
import './earn.css';
import { BsCoin, BsArrowRight, BsCheckCircle } from 'react-icons/bs';
import { RiUserSharedFill } from 'react-icons/ri';
import { FaGift, FaMoneyBillWave, FaRunning } from 'react-icons/fa';
import { GiMoneyStack, GiCash } from 'react-icons/gi';
import { use } from 'react';
import { TokenRequest } from '../AxiosCreate';

function Earn() {
    const [referralData, setReferralData] = useState({
        name: '',
        email: '',
        contact: '',
        userid: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [coinsEarned, setCoinsEarned] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [countdown, setCountdown] = useState(9);
    var [next, setNext] = useState()
    const [showCoins, setShowCoins] = useState(false);




    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReferralData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Calculate next amount based on current earnings
    const getNextAmount = () => {
        if (coinsEarned < 500) return 500;
        if (coinsEarned === 500) return 1000;
        if (coinsEarned ===1500) return 1500; // Changed from 1500 to match your requirement
        if (coinsEarned >= 3000) return 500;
        return 0;
    };

    useEffect(() => {
        setNext(getNextAmount())
    }, [])

    useEffect(() => {
        let countdownTimer;

        if (submitted && countdown > 0) {
            countdownTimer = setTimeout(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        }

        if (submitted && countdown === 0) {
            setShowCoins(true);

            // Stop the animation after showing coin
            setTimeout(() => {
                setSubmitted(false);
                setIsAnimating(false);
            }, 2000); // animation time
        }

        return () => clearTimeout(countdownTimer);
    }, [submitted, countdown]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        setIsAnimating(true);
        setCountdown(9); // Reset countdown
        setShowCoins(false); // Reset coin animation

        try {
            
             await TokenRequest.post('/', referralData);

            // You can optionally clear the form immediately or after animation
            setReferralData({
                name: '',
                email: '',
                contact: '',
                userid: ''
            });

        } catch (error) {
            console.error("Error submitting referral:", error);
            setIsAnimating(false);
            setSubmitted(false);
        }
    };

    // Animation effect on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 1000);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // Check if user has completed initial offers
    const hasCompletedInitialOffers = coinsEarned >= 3000;

    return (
        <div className="earn-container">
            <div className="earn-card">
                {/* Header with money stack animation */}
                <div className="earn-header">
                    <div className="money-animation">
                        <GiCash className="money-icon" />
                        <div className={`coins-falling ${isAnimating ? 'animate' : ''}`}>
                            <BsCoin className="falling-coin coin-1" />
                            <BsCoin className="falling-coin coin-2" />
                            <BsCoin className="falling-coin coin-3" />
                        </div>
                    </div>

                    <h2 className="section-title">Start Earning Now!</h2>
                    <p className="section-subtitle">Refer friends and collect rewards instantly</p>

                    <div className="potential-earnings">
                        <div className="potential-badge">
                            <FaRunning className="potential-icon" />
                            <span>Your Potential</span>
                        </div>
                        <div className="potential-amount">
                            {hasCompletedInitialOffers ? 'Unlimited!' : '₹3,000'}
                        </div>
                    </div>
                </div>

                <div className="earn-content">
                    {/* Left side - Referral Form */}
                    <div className="referral-form-container">
                        {hasCompletedInitialOffers ? (
                            <div className="completed-offers">
                                <div className="form-header">
                                    <RiUserSharedFill className="referral-icon" />
                                    <h3>Referral Program</h3>
                                    <div className="referral-bonus-badge">+ ₹{next}</div>
                                </div>
                                <div className="completed-message">
                                    <BsCheckCircle className="success-icon" />
                                    <h4>You've completed initial offers!</h4>
                                    <p>Now earn ₹{next} for every new referral</p>
                                </div>

                                {!submitted ? (
                                    <form className="refer-form" onSubmit={handleSubmit}>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Friend's Name"
                                                value={referralData.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="input-group">
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Friend's Email"
                                                value={referralData.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="input-group">
                                            <input
                                                type="tel"
                                                name="contact"
                                                placeholder="Friend's Contact"
                                                value={referralData.contact}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="submit-btn">
                                            Get ₹{next} Now <BsArrowRight className="arrow-icon" />
                                        </button>
                                    </form>
                                ) : (
                                    <div className="referral-success">
                                        <BsCheckCircle className="success-icon" />
                                        <h4>Invitation Sent!</h4>
                                        <p>You'll earn ₹{next} when your friend joins and pays for the course</p>

                                        {!showCoins ? (
                                            <div className="countdown-timer">⏳ {countdown}</div>
                                        ) : (
                                            <div className={`coins-earned animate`}>
                                                ₹{next}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="form-header">
                                    <RiUserSharedFill className="referral-icon" />
                                    <h3>Your Referral</h3>
                                    <div className="referral-bonus-badge">+ {next}</div>
                                </div>

                                {!submitted ? (
                                    <form className="refer-form" onSubmit={handleSubmit}>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Friend's Name"
                                                value={referralData.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="input-group">
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Friend's Email"
                                                value={referralData.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="input-group">
                                            <input
                                                type="tel"
                                                name="contact"
                                                placeholder="Friend's Contact"
                                                value={referralData.contact}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="submit-btn">
                                            Get ₹{next} Now <BsArrowRight className="arrow-icon" />
                                        </button>
                                    </form>
                                ) : (
                                    <div className="referral-success">
                                        <BsCheckCircle className="success-icon" />
                                        <h4>Invitation Sent!</h4>
                                        <p>You'll earn ₹{next} when your friend joins and pays for the course</p>

                                        {!showCoins ? (
                                            <div className="countdown-timer">⏳ {countdown}</div>
                                        ) : (
                                            <div className={`coins-earned animate`}>
                                                ₹{next}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="referral-steps">
                                    <div className="step">
                                        <div className="step-number">1</div>
                                        <p>Invite your friend</p>
                                    </div>
                                    <div className="step">
                                        <div className="step-number">2</div>
                                        <p>They Join and pay for our course</p>
                                    </div>
                                    <div className="step">
                                        <div className="step-number">3</div>
                                        <p>Get your reward instantly!</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right side - Reward Progress */}
                    {!hasCompletedInitialOffers && (
                        <div className="reward-progress">
                            <h3 className="progress-title">Your Referral Journey</h3>

                            <div className="progress-track">
                                <div className={`progress-milestone milestone-1 ${coinsEarned >= 500 ? 'completed' : 'active'}`}>
                                    <div className="milestone-icon">
                                        <FaGift />
                                    </div>
                                    <div className="milestone-info">
                                        <h4>First Friend</h4>
                                        <p className="milestone-amount">₹500</p>
                                    </div>
                                    {coinsEarned >= 500 && (
                                        <div className="milestone-check">
                                            <BsCheckCircle />
                                        </div>
                                    )}
                                </div>

                                <div className={`progress-milestone milestone-2 ${coinsEarned >= 1000 ? 'completed' : coinsEarned >= 500 ? 'active' : ''}`}>
                                    <div className="milestone-icon">
                                        <FaGift style={{ color: '#ff9f43' }} />
                                    </div>
                                    <div className="milestone-info">
                                        <h4>Second Friend</h4>
                                        <p className="milestone-amount">₹1000</p>
                                    </div>
                                    {coinsEarned >= 1000 && (
                                        <div className="milestone-check">
                                            <BsCheckCircle />
                                        </div>
                                    )}
                                </div>

                                <div className={`progress-milestone milestone-3 ${coinsEarned >= 3000 ? 'completed' : coinsEarned >= 1000 ? 'active' : ''}`}>
                                    <div className="milestone-icon">
                                        <FaMoneyBillWave style={{ color: '#ff6b6b' }} />
                                    </div>
                                    <div className="milestone-info">
                                        <h4>Third Friend</h4>
                                        <p className="milestone-amount">₹1500</p>
                                    </div>
                                    {coinsEarned >= 3000 && (
                                        <div className="milestone-check">
                                            <BsCheckCircle />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="total-potential">
                                <div className="total-label">Total Potential:</div>
                                <div className="total-amount">₹3,000</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Current Earnings */}
                <div className={`current-earnings ${coinsEarned > 0 ? 'has-earnings' : ''}`}>
                    <div className="earnings-badge">
                        <BsCoin className="earning-coin" />
                        <span>Your Earnings</span>
                    </div>
                    <div className="earnings-amount">₹{coinsEarned}</div>

                </div>
            </div>
        </div>
    );
}

export default Earn;