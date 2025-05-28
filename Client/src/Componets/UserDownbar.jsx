import React from 'react'
import { BiTask } from 'react-icons/bi'
import { FaCalendarCheck, FaLaptopCode, FaList } from 'react-icons/fa'
import { FaNoteSticky } from 'react-icons/fa6'
import { IoIosCard } from 'react-icons/io'
import { MdInsertChart } from 'react-icons/md'
import './Allcss.css'

function UserDownbar() {

    function fetchData(){
        
    }

    return (
        <div>
            {/* Sections Sidebar Down side*/}
            <div className="topSectionMain_div_userHomepage_down">
                <div className="topsection_inner_div_userHompage_down">
                    <div className="topsection_card_userhomepage_down" onClick={() => fetchData('batchDetails')}>
                        <span className='res_down_menus'>Overview</span>
                        <h3><FaList style={{ marginRight: '4%', height: '25px', width: '25px' }} />  </h3>
                    </div>
                    <div className="topsection_card_userhomepage_down" onClick={() => fetchData('reviews')}>
                        <span className='res_down_menus'>Result</span>
                        <h3><MdInsertChart style={{ marginRight: '4%', height: '25px', width: '25px' }} /></h3>
                    </div>

                    <div className="topsection_card_userhomepage_down" onClick={() => fetchData('attendance')}>
                        <span className='res_down_menus'>Attendance</span>
                        <h3><FaCalendarCheck style={{ marginRight: '4%', height: '25px', width: '25px' }} /></h3>
                    </div>
                    <div className="topsection_card_userhomepage_down" onClick={() => fetchData('bill')}>
                        <span className='res_down_menus'>Payment</span>
                        <h3><IoIosCard style={{ marginRight: '4%', height: '25px', width: '25px' }} /></h3>
                    </div>
                    <div className="topsection_card_userhomepage_down" onClick={() => fetchData('task')}>
                        <span className='res_down_menus'>Task</span>
                        <h3><BiTask style={{ marginRight: '4%', height: '25px', width: '25px' }} /></h3>
                    </div>
                    <div className="topsection_card_userhomepage_down" onClick={() => fetchData('Project')}>
                        <span className='res_down_menus'>Project</span>
                        <h3><FaLaptopCode style={{ marginRight: '4%', height: '25px', width: '25px' }} /></h3>
                    </div>
                    <div className="topsection_card_userhomepage_down" onClick={() => fetchData('material')}>
                        <span className='res_down_menus'>Study Material</span>
                        <h3><FaNoteSticky style={{ marginRight: '4%', height: '25px', width: '25px' }} /></h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserDownbar