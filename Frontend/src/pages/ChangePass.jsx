import React, { useState } from 'react';
import './login.css';
import './ClassVideo.css'

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { TokenRequest } from '../AxiosCreate';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';

function ChangePass() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const logininfom = useSelector((state) => state.userlogin?.LoginInfo[0]);
    const student_id = logininfom.student_id

    console.log(student_id);

    async function handleChangePassword() {
        if (newPassword !== confirmPassword) {
            toast.error("New password and confirm password do not match.");
            return;
        }

        setLoading(true);
        try {
            const response = await TokenRequest.post('/student/change-password', {
                student_id,
                currentPassword,
                newPassword
            });

            toast.success(response.data.message); 
            navigate('/')
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message || "Something went wrong.");
            } else {
                toast.error("Network error. Please try again.");
            }
        }
        setLoading(false); 
    }

    return (
        <div>

            <section className="navbar_main_video">
                <div className="inner_div_nav_video">
                    <div className="leftnav_video">
                        <img src="https://techwingsys.com/tws-logo.png" className="logo_nav_video" alt="" />
                    </div>
                    <div className="rightnav_video">
                        <Link style={{ textDecoration: "none" }} to={"/"}>
                            <button className="menus_right_video">
                                <AiFillHome /> <span className="menus_right_video_text">Home page</span>
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            <div className="login-container">
                <div className="login-box">


                    <input
                        className="login-input"
                        type="password"
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <input
                        className="login-input"
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <input
                        className="login-input"
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button className="login-button" onClick={handleChangePassword} disabled={loading}>
                        {loading ? (
                            <div className="loading-spinner_login">
                                <div className="spinner_login"></div>
                            </div>
                        ) : (
                            'Change Password'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChangePass;
