import React, { useState } from 'react'
import './UserNavbar.css'
import { Link } from 'react-router-dom'
import { IoIosVideocam } from 'react-icons/io'
import { HiOutlineSpeakerphone } from 'react-icons/hi'
import { AiOutlineLogout } from "react-icons/ai";
import { useDispatch } from 'react-redux'
import { LogoutData } from '../Redux1/UserSlice'
import './Allcss.css'

function UserNavbar() {
    const [batchname, setBatchname] = useState('')
    var dispatch = useDispatch()

    async function logout() {
        dispatch(LogoutData())
    }
    return (
        <div>
            <section className='navbar_main'>
                <div className='inner_div_nav'>
                    <div className='leftnav'>
                        <img src="https://techwingsys.com/tws-logo.png" className='logo_nav' alt="" />

                    </div>

                    <div className='rightnav'>

                        <Link to={{
                            pathname: '/ClassVideo',
                        }} style={{ textDecoration: 'none' }}
                            state={{ batchname }} className="topsection_card_userhomepage_down_video" >
                            <h3><IoIosVideocam style={{ height: '25px', width: '25px' }} /></h3>
                        </Link>
                        <div className="topsection_card_userhomepage_down_Announcements" onClick={() => fetchData('announcement')}>
                            <span className='res_down_menus'>Announcements</span>
                            <h3><HiOutlineSpeakerphone style={{ height: '22px', width: '22px' }} /></h3>
                        </div>
                        <Link to={'/ChangePassword'} className='change_password_button' >Change Password</Link>

                        <h3 onClick={logout} className='menus_right'><AiOutlineLogout />  </h3>

                    </div>

                </div>
            </section>
        </div>
    )
}

export default UserNavbar