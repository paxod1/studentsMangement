import React, { useState } from 'react';
import './UserSidebar.css'
import { Link } from 'react-router-dom';
import { FaList } from "react-icons/fa";
import { MdInsertChart } from "react-icons/md";
import { IoIosVideocam } from "react-icons/io";
import { FaCalendarCheck } from "react-icons/fa";
import { IoIosCard } from "react-icons/io";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { FaNoteSticky } from "react-icons/fa6";
import { FaChrome } from "react-icons/fa";
import { RiCustomerService2Fill } from "react-icons/ri";
import { BiTask } from "react-icons/bi";
import { FaLaptopCode } from "react-icons/fa";
import 'react-toastify/dist/ReactToastify.css';
import './Allcss.css'



function UserSidebar() {
    const [activeMenu, setActiveMenu] = useState("");
    const [batchname, setBatchname] = useState('')
    function fetchData(A) {
        setActiveMenu = 'batchDetails';
    }


    return (
        <div>
            <div className="topSectionMain_div_userHomepage">
                <div className="topsection_inner_div_userHompage">
                    <Link to={'/home'} className={`topsection_card_userhomepage ${activeMenu === 'batchDetails' ? 'active' : ''}`}>
                        <h3><FaList style={{ marginRight: '4%', height: '25px', width: '25px' }} /> <span className='menus_side_home'>Overview</span></h3>
                    </Link>
                    <Link to={'/Review'} className={`topsection_card_userhomepage ${activeMenu === 'reviews' ? 'active' : ''}`} >
                        <h3><MdInsertChart style={{ marginRight: '4%', height: '25px', width: '25px' }} /> <span className='menus_side_home'>Result</span></h3>
                    </Link>
                    <Link to={{ pathname: '/ClassVideo' }} style={{ textDecoration: 'none' }} state={{ batchname }} className={`topsection_card_userhomepage ${activeMenu === 'video' ? 'active' : ''}`}>
                        <h3><IoIosVideocam style={{ marginRight: '4%', height: '25px', width: '25px' }} /><span className='menus_side_home'>Video</span></h3>
                    </Link>
                    <Link to={'/Attendance'} className={`topsection_card_userhomepage ${activeMenu === 'attendance' ? 'active' : ''}`} >
                        <h3><FaCalendarCheck style={{ marginRight: '4%', height: '25px', width: '25px' }} /><span className='menus_side_home'>Attendance</span></h3>
                    </Link>
                    <Link to={'/Bill'} className={`topsection_card_userhomepage ${activeMenu === 'bill' ? 'active' : ''}`} onClick={() => fetchData('bill')}>
                        <h3><IoIosCard style={{ marginRight: '4%', height: '25px', width: '25px' }} /><span className='menus_side_home'>Payment</span></h3>
                    </Link>
                    <Link to={'/Anouncement'} className={`topsection_card_userhomepage ${activeMenu === 'announcement' ? 'active' : ''}`} >
                        <h3><HiOutlineSpeakerphone style={{ marginRight: '4%', height: '25px', width: '25px' }} /><span className='menus_side_home'>Announcements</span></h3>
                    </Link>
                    <Link to={'/Project'} className={`topsection_card_userhomepage ${activeMenu === 'Project' ? 'active' : ''}`}>
                        <h3><FaLaptopCode style={{ marginRight: '4%', height: '25px', width: '25px' }} /><span className='menus_side_home'>Project</span></h3>
                    </Link>
                    <Link to={'/Task'} className={`topsection_card_userhomepage ${activeMenu === 'task' ? 'active' : ''}`} onClick={() => fetchData('task')}>
                        <h3><BiTask style={{ marginRight: '4%', height: '25px', width: '25px' }} /><span className='menus_side_home'>Tasks</span></h3>
                    </Link>
                    <Link to={'/Studymaterial'} className={`topsection_card_userhomepage ${activeMenu === 'material' ? 'active' : ''}`}>
                        <h3><FaNoteSticky style={{ marginRight: '4%', height: '25px', width: '25px' }} /><span className='menus_side_home'>Study Material</span></h3>
                    </Link>

                    <a className={`topsection_card_userhomepage ${activeMenu === 'website' ? 'active' : ''}`} href='https://www.techwingsys.com/'>
                        <h3><FaChrome style={{ marginRight: '4%', height: '25px', width: '25px' }} /><span className='menus_side_home'>Our Website</span></h3>
                    </a>
                    <button className={`topsection_card_userhomepage_button ${activeMenu === 'helpSupport' ? 'active' : ''}`} onClick={() => fetchData('helpSupport')}>
                        <h5><RiCustomerService2Fill style={{ marginRight: '4%', height: '25px', width: '25px' }} /><span className='menus_side_home'>Help & Support</span></h5>
                    </button>
                    <h3 className='sidebar_bottom_text'>Kochi's Premier IT Training Institute</h3>
                </div>
            </div>
        </div>
    )
}

export default UserSidebar