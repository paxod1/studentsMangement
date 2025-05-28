import React, { useEffect, useState } from 'react'
import { TokenRequest } from '../../../Frontend/src/AxiosCreate';
import { useSelector } from 'react-redux';
import { FaCalendarMinus, FaClock, FaIdCard, FaRegKeyboard, FaSchool } from 'react-icons/fa';
import { BiLoaderCircle } from 'react-icons/bi';
import { IoIosCard } from 'react-icons/io';
import '../UserStyleSheet/UserHome.css'


function UserHome() {
  const [student_id, setStudent_id] = useState('');
  const [batch, setBatch] = useState([]);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState([])
  const [batchname, setBatchname] = useState('')
  const [student, setSutdent] = useState([])
  const [homeAnnouncement, setHomeAnnouncement] = useState()
  const logininfom = useSelector((state) => state.userlogin?.LoginInfo[0]);

  useEffect(() => {
    setLoading(true);
    if (logininfom) {

      setStudent_id(logininfom.student_id);

    }
  }, [logininfom]);

  useEffect(() => {
    if (student_id && activeSection === 'dashboard') {

      async function billhome() {
        await fetchData('batchDetails');
        let response = await TokenRequest.get(`/student/getdatabill?student_id=${student_id}`);
        let response2 = await TokenRequest.get(`/student/getstudent?student_id=${student_id}`);
        console.log("home bill", response.data);
        const lastPayment = response.data[response.data.length - 1];
        setPaymentData(lastPayment);
        setSutdent(response2.data[0].name)
        console.log("student", response2.data[0]);

      }
      billhome();
    }
  }, [student_id, activeSection]);


  const fetchData = async (section) => {
    if (!student_id) return;
    setLoading(true);
    console.log("hi");

    try {
      let response;
      switch (section) {
        case 'batchDetails':
          setActiveSection('batchDetails');
          response = await TokenRequest.get(`/student/getdatatraining?student_id=${student_id}`);
          setBatch(response.data);

          const batchName = response.data[0]?.batch || 'No Batch Assigned';
          setBatchname(batchName);
          var statuscheck = response.data[0].status
          console.log("status>>>>>>>>>>>>>", statuscheck);

          // if status is droped the user will logout automaticaly
          if (statuscheck == 'DROPED') {
            toast.error("Student Droped course!");
            dispatch(LogoutData())
            setTimeout(() => {
              window.location.reload();
            }, 4000);
          }

          console.log('Batch Name:', batchName);
          console.log('Batch details:', response.data);

          if (batchName) {
            try {
              const announcementResponse = await TokenRequest.get(`/student/getdataAnnouncements?batchname=${batchName}`);
              if (announcementResponse.data.length > 0) {
                setHomeAnnouncement(announcementResponse.data[announcementResponse.data.length - 1]);
              } else {
                setHomeAnnouncement({ message: "No announcements available." });
              }
            } catch (error) {
              console.warn("Error fetching announcements:", error);
              setHomeAnnouncement({ message: "Unable to fetch announcements." });
            }
          } else {
            setHomeAnnouncement({ message: "No batch name found." });
          }
          break;


        default:
          break;
      }


    } catch (err) {
      console.error(`Error fetching ${section} data:`, err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className='main_home'>
    
      <div className='second_section_main'>

        {activeSection === 'batchDetails' && (
          <div>
            <div className='batch-details-container'>
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                </div>
              ) : (
                batch.length === 0 ? (
                  <div className="box_notdata">
                    <p className="no-batch-data">No batch data available</p>
                  </div>
                ) : (
                  // Batch Details Section
                  batch.map((batchItem, index) => (
                    <div className='inner_box' >
                      <div className='payment-details'>
                        {paymentData ? (
                          <div key={paymentData.bill_id} className='payment-bill'>
                            <div className='bill-info'>
                              <p className='balance-amount'>
                                Balance Amount: ₹{paymentData.balance_amount}
                              </p>
                              <p className='due-date'>{paymentData.due_date ? <div> Due Date: {new Date(paymentData.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} </div> : ' '}</p>
                            </div>

                            <div className="emi-progress">
                              <div
                                className="emi-line"
                                style={{
                                  '--paid-percent': paymentData.balance_amount === 0
                                    ? '100%'
                                    : ((paymentData.no_of_emi / batchItem.emi) * 100).toFixed(2) + '%',
                                }}
                              >
                                <p
                                  className="emi-status-text"
                                  style={{
                                    '--paid-percent': paymentData.balance_amount === 0
                                      ? '100%'
                                      : ((paymentData.no_of_emi / batchItem.emi) * 100).toFixed(2) + '%',
                                  }}
                                >
                                  {paymentData.balance_amount === 0
                                    ? 'Paid Off'
                                    : `${((paymentData.no_of_emi / batchItem.emi) * 100).toFixed(2)}% Paid`}
                                </p>
                              </div>
                            </div>

                          </div>
                        ) : (
                          <p>No payment details available</p>
                        )}
                      </div>

                      <div key={index} className="batch-card">
                        <h1 className="batch-title">Batch Details</h1>
                        <h3>{student}</h3>
                        <div className="batch-header">

                          <h3>{batchItem.batch || "Batch Name Not Available"} {batchItem.course_name}</h3>
                          <p className="status">{batchItem.status || "Status Not Available"}</p>
                        </div>
                        <div className="batch-body">
                          <p><strong><FaIdCard style={{ marginRight: '8px' }} />Student ID:</strong> {student_id}</p>
                          <p><strong> <FaClock style={{ marginRight: '8px' }} />Start Time:</strong> {batchItem.start_time || "Not Available"}</p>
                          <p><strong><FaClock style={{ marginRight: '8px' }} />End Time:</strong> {batchItem.end_time || "Not Available"}</p>
                          <p><strong><FaSchool style={{ marginRight: '8px' }} />Course Name:</strong> {batchItem.course_name || "Not Available"}</p>
                          <p><strong><FaCalendarMinus style={{ marginRight: '8px' }} />Batch Code:</strong> {batchItem.batch || "Not Available"}</p>
                          <p><strong><BiLoaderCircle style={{ marginRight: '8px' }} />Course Duration:</strong> {batchItem.duration} months</p>
                          <p><strong><FaRegKeyboard style={{ marginRight: '8px' }} />Training Method:</strong> {batchItem.training_method}</p>
                          <p><strong><IoIosCard style={{ marginRight: '8px' }} />Course Fee:</strong> {batchItem.fee}/-</p>
                        </div>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>

        )}

      </div>

      <div className="third_section_main">
        {homeAnnouncement && homeAnnouncement.title ? (
          <div className="announcement_card">
            <h3 className="announcement_title">Recent Announcements</h3>
            <div className="announcement_icon">📢</div>
            <div className="announcement_content">
              <h3 className="announcement_title">{homeAnnouncement.title}</h3>
              <p className="announcement_text">{homeAnnouncement.description}</p>
              {homeAnnouncement.image && (
                <div className="announcement_image">
                  <img
                    src={`https://techwingsys/uploads/${homeAnnouncement.image}`}
                    alt="Announcement"
                  />
                </div>
              )}
              <p className="announcement_date">
                Posted on: {new Date(homeAnnouncement.created_at).toLocaleDateString()}
              </p>
              <p className="announcement_batch">Batch: {homeAnnouncement.batch}</p>
            </div>
          </div>
        ) : (
          <div className="no_announcement_message">
            <div className="announcement_card">
              <h3 className="announcement_title">Recent Announcements</h3>
              <div className="announcement_icon">📢</div>
              <div className="announcement_content">
                <h3 className="announcement_title">No recent announcements available.</h3>

              </div>
            </div>

          </div>
        )}
      </div>


    </div>
  )
}

export default UserHome