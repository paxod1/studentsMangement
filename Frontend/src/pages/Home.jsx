import React, { useEffect, useState } from 'react';
import { TokenRequest } from '../AxiosCreate';
import { useSelector } from 'react-redux';
import './Home.css';
import { IoIosLogOut } from "react-icons/io";
import { useDispatch } from 'react-redux'
import { LogoutData } from '../Redux/UserSlice';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FaCalendar, FaCalendarMinus, FaIdCard, FaList, FaRegKeyboard, FaSchool } from "react-icons/fa";
import { MdInsertChart } from "react-icons/md";
import { IoIosVideocam } from "react-icons/io";
import { FaCalendarCheck } from "react-icons/fa";
import { IoIosCard } from "react-icons/io";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { FaPen } from "react-icons/fa";
import { FaNoteSticky } from "react-icons/fa6";
import { FaChrome } from "react-icons/fa";
import { RiCustomerService2Fill } from "react-icons/ri";
import { FaClock } from "react-icons/fa6";
import { BiLoaderCircle } from "react-icons/bi";

function Home() {
  const [student_id, setStudent_id] = useState('');
  const [reviews, setReviews] = useState([]);
  const [batch, setBatch] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [bill, setBill] = useState([]);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const logininfom = useSelector((state) => state.userlogin?.LoginInfo[0]);
  const [paymentData, setPaymentData] = useState([])
  const [batchname, setBatchname] = useState('')
  const navigate = useNavigate()
  const [initialLoading, setInitialLoading] = useState(true);



  const dispatch = useDispatch()

  async function logout() {
    dispatch(LogoutData())
    await setTimeout(() => {
      window.location.reload();
    }, 0);
  }

  useEffect(() => {
    if (logininfom) {
      setLoading(true);
      setStudent_id(logininfom.student_id);
      setInitialLoading(false);
    }
  }, [logininfom]);

  useEffect(() => {
    if (student_id && activeSection === 'dashboard') {
      fetchData('batchDetails');
      async function billhome() {
        let response = await TokenRequest.get(`/student/getdatabill?student_id=${student_id}`);
        console.log("home bill", response.data);

        const lastPayment = response.data[response.data.length - 1];
        setPaymentData(lastPayment);
      }
      billhome();
    }
  }, [student_id, activeSection]);


  const fetchData = async (section) => {
    if (!student_id) return;
    setLoading(true);
    try {
      let response;
      switch (section) {
        case 'batchDetails':
          response = await TokenRequest.get(`/student/getdatatraining?student_id=${student_id}`);
          setBatch(response.data);
          const batchName = response.data[0].batch;
          setBatchname(batchName);
          console.log('Batch Name:', batchName);
          console.log('Batch details>>:', response.data);


          break;
        case 'reviews':
          response = await TokenRequest.get(`/student/getdatareview?student_id=${student_id}`);
          setReviews(response.data);
          console.log(response.data);
          break;
        case 'attendance':
          response = await TokenRequest.get(`/student/getdataattendance?student_id=${student_id}&year=${selectedYear}&month=${selectedMonth}`);
          setAttendance(response.data);
          setFilteredAttendance(response.data);
          console.log(response.data);
          break;
        case 'bill':
          response = await TokenRequest.get(`/student/getdatabill?student_id=${student_id}`);
          setBill(response.data);
          console.log(response.data);
          break;
        default:
          break;
      }
      setActiveSection(section);
    } catch (err) {
      console.error(`Error fetching ${section} data:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceFilter = (status) => {
    if (status === 'all') {
      setFilteredAttendance(attendance);
    } else {
      const filteredData = attendance.filter(record => record.attendance === status);
      setFilteredAttendance(filteredData);
    }
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const getPassFailStatus = (marks) => {
    const aptitude = parseInt(marks.aptitude) || 0;
    const technical = parseInt(marks.technical) || 0;
    const viva = parseInt(marks.viva) || 0;
    const theory = parseInt(marks.theory) || 0;

    const totalMarks = aptitude + technical + viva + theory;
    const passThreshold = 75;
    return totalMarks >= passThreshold ? 'pass' : 'fail';
  };

  // Calculate Attendance Percentage
  const calculateAttendancePercentage = () => {
    if (attendance.length === 0) return 0;

    const presentCount = attendance.filter(record => record.attendance === 'Present').length;
    const totalDays = attendance.length;
    return (presentCount / totalDays) * 100;
  };

  if (initialLoading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }



  return (
    <div>
      <div className='main_home'>


        <section className='navbar_main'>
          <div className='inner_div_nav'>
            <div className='leftnav'>
              <img src="https://techwingsys.com/tws-logo.png" className='logo_nav' alt="" />

            </div>

            <div className='rightnav'>
              <h3 onClick={logout} className='menus_right'><IoIosLogOut />  </h3>


            </div>

          </div>
        </section>



        <div className="topSectionMain_div_userHomepage">
          <div className="topsection_inner_div_userHompage">
            <div className="topsection_card_userhomepage" onClick={() => fetchData('batchDetails')}>
              <h3><FaList style={{ marginRight: '4%', height: '25px', width: '25px' }} />Overview</h3>
            </div>
            <div className="topsection_card_userhomepage" onClick={() => fetchData('reviews')}>
              <h3><MdInsertChart style={{ marginRight: '4%', height: '25px', width: '25px' }} />Result</h3>
            </div>
            <Link to={{
              pathname: '/ClassVideo',
            }} style={{ textDecoration: 'none' }}
              state={{ batchname }} className="topsection_card_userhomepage" >
              <h3><IoIosVideocam style={{ marginRight: '4%', height: '25px', width: '25px' }} />Video</h3>
            </Link>
            <div className="topsection_card_userhomepage" onClick={() => fetchData('attendance')}>
              <h3><FaCalendarCheck style={{ marginRight: '4%', height: '25px', width: '25px' }} />Attendance</h3>
            </div>
            <div className="topsection_card_userhomepage" onClick={() => fetchData('bill')}>
              <h3><IoIosCard style={{ marginRight: '4%', height: '25px', width: '25px' }} />Payment</h3>
            </div>
            <div className="topsection_card_userhomepage" onClick={() => fetchData('bill')}>
              <h3><HiOutlineSpeakerphone style={{ marginRight: '4%', height: '25px', width: '25px' }} />Announcements</h3>
            </div>
            <div className="topsection_card_userhomepage" onClick={() => fetchData('bill')}>
              <h3><FaPen style={{ marginRight: '4%', height: '25px', width: '25px' }} />Tests</h3>
            </div>
            <div className="topsection_card_userhomepage" onClick={() => fetchData('bill')}>
              <h3><FaNoteSticky style={{ marginRight: '4%', height: '25px', width: '25px' }} />Study Material</h3>
            </div>
            <div className="topsection_card_userhomepage" onClick={() => fetchData('bill')}>
              <h3><FaChrome style={{ marginRight: '4%', height: '25px', width: '25px' }} />Our Website</h3>
            </div>
          

            <button className="topsection_card_userhomepage_button" onClick={() => fetchData('bill')}>
              <h5><RiCustomerService2Fill style={{ marginRight: '4%', height: '25px', width: '25px' }} />Help&support</h5>
            </button>
            <h3 className='sidebar_bottom_text'>Kochi's Premier IT Training Institute</h3>


          </div>
        </div>










        <div className='second_section_main'>
          {/* Attendance Section */}
          {activeSection === 'attendance' && (
            <div className="attendance-container">
              <h1 className="attendance-title">Attendance Records</h1>
              <div className="attendance-filters">
                <div className="filter-group">
                  <label htmlFor="year">Year</label>
                  <select id="year" onChange={handleYearChange}>
                    <option value="">Select Year</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="month">Month</label>
                  <select id="month" onChange={handleMonthChange}>
                    <option value="">Select Month</option>
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                </div>

                <button onClick={() => fetchData('attendance')} className="filter-btn">Apply Filter</button>
              </div>

              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                </div>
              ) : (
                <div className="attendance-content">
                  <div className="attendance-filter-buttons">
                    <button onClick={() => handleAttendanceFilter('all')} className="filter-btn">All</button>
                    <button onClick={() => handleAttendanceFilter('Present')} className="filter-btn present-btn">Present</button>
                    <button onClick={() => handleAttendanceFilter('Absent')} className="filter-btn absent-btn">Absent</button>
                  </div>

                  {filteredAttendance.length === 0 ? (
                    <p
                      className={`attendance-percentage ${calculateAttendancePercentage() < 90 ? 'danger-zone' : 'safe-zone'}`}
                    >
                      Attendance: {calculateAttendancePercentage().toFixed(2)}%
                    </p>
                  ) : (
                    <div>
                      <p
                        className={`attendance-percentage ${calculateAttendancePercentage() < 90 ? 'danger-zone' : 'safe-zone'}`}
                      >
                        Attendance: {calculateAttendancePercentage().toFixed(2)}%
                      </p>
                      <table className="attendance-table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAttendance.map((record, index) => {
                            const statusClass = record.attendance === 'Present' ? 'present' : 'absent';
                            return (
                              <tr key={index} className={statusClass}>
                                <td>{record.date_taken}</td>
                                <td>{record.attendance}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}




          {activeSection === 'reviews' && (
            <div className="home-container">
              <h1 className="home-title">Student Reviews</h1>
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                </div>
              ) : (
                <div className="review-card-container">
                  {reviews.length === 0 ? (
                    <p className="no-reviews">No reviews or marks available</p>
                  ) : (
                    reviews.map((review, index) => {
                      const status = getPassFailStatus(review);
                      const totalMarks =
                        parseInt(review.aptitude) +
                        parseInt(review.technical) +
                        parseInt(review.viva) +
                        (parseInt(review.theory) || 0);
                      return (
                        <div key={index} className={`review-card ${status === 'pass' ? 'pass-card' : 'fail-card'}`}>
                          <div className="review-header">
                            <h2 className="card-title">{review.month}</h2>
                            <p className="status-text">{status.toUpperCase()}</p>
                          </div>
                          <div className="review-body">
                            <p><strong>Aptitude:</strong> {review.aptitude}</p>
                            <p><strong>Technical:</strong> {review.technical}</p>
                            <p><strong>Viva:</strong> {review.viva}</p>
                            <p><strong>Total Marks:</strong> {totalMarks}/150</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          )}
















          {/*  Sections Batch Details  and biil home*/}
          {activeSection === 'batchDetails' && (
            <div>
              <div className='batch-details-container'>
                {loading ? (
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                  </div>
                ) : (
                  batch.length === 0 ? (
                    <p className="no-batch-data">No batch data available</p>
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
                                <p className='due-date'>{paymentData.due_date ? <div> Due Date: {new Date(paymentData.due_date).toLocaleDateString()} </div> : ' '}</p>
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
                          <div className="batch-header">
                            <h3>{batchItem.batch || "Batch Name Not Available"} {batchItem.course_name}</h3>
                            <p className="status">{batchItem.status || "Status Not Available"}</p>
                          </div>
                          <div className="batch-body">
                            <p><strong><FaIdCard style={{ marginRight: '8px' }} />Student ID:</strong> {student_id}</p>
                            <p><strong> <FaClock style={{ marginRight: '8px' }} />Start Time:</strong> {batchItem.start_time || "Not Available"}</p>
                            <p><strong><FaClock style={{ marginRight: '8px' }} />End Time:</strong> {batchItem.end_time || "Not Available"}</p>
                            <p><strong><FaSchool style={{ marginRight: '8px' }} />Course Name:</strong> {batchItem.course_name || "Not Available"}</p>
                            <p><strong><FaCalendarMinus style={{ marginRight: '8px' }} />Batch Code:</strong> {batchItem.batch|| "Not Available"}</p>
                            <p><strong><BiLoaderCircle style={{ marginRight: '8px' }} />Course Duration:</strong> {batchItem.duration} months</p>
                            <p><strong><FaRegKeyboard style={{ marginRight: '8px' }} />Training Method:</strong> {batchItem.training_method}</p>
                            <p><strong><IoIosCard style={{ marginRight: '8px' }} />Course Fee:</strong> {batchItem.fee}/-</p>
                          </div>
                          <div className="batch-footer">
                            <p><strong>Training ID:</strong> {batchItem.training_id}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )
                )}
              </div>
            </div>

          )}





          {/* Sections Bill*/}

          {activeSection === 'bill' && (
            <div className="bill-container">
              <h1>Bill Details</h1>
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                </div>
              ) : (
                bill.length === 0 ? (
                  <p>No bill data available</p>
                ) : (
                  bill.map((record, index) => (
                    <div key={index} className="bill-card">
                      <div className="bill-header">
                        <h3>Bill ID: {record.bill_id}</h3>
                        <p><strong>Pay Status:</strong> {record.pay_status}</p>
                      </div>
                      <div className="bill-body">
                        <p><strong>Amount:</strong> ₹{record.amount}</p>
                        <p><strong>Balance Amount:</strong> ₹{record.balance_amount}</p>
                        <p><strong>Payment Method:</strong> {record.pay_method}</p>
                        <p><strong>Pay Date:</strong> {new Date(record.pay_date).toLocaleDateString()}</p>
                        <p><strong>Due Date:</strong> {new Date(record.due_date).toLocaleDateString()}</p>
                        <p><strong>Number of EMIs:</strong> {record.no_of_emi}</p>
                        <p><strong>Training ID:</strong> {record.training_id}</p>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          )}
        </div>

        <div className="third_section_main">
          <div className="announcement_card">
            <h3 className="announcement_title">Recent Annoncements</h3>
            <div className="announcement_icon">
              📢
            </div>
            <div className="announcement_content">
              <h3 className="announcement_title">Important Announcement!</h3>
              <p className="announcement_text">Our new course schedule is now live. Check the updates and stay tuned for more details!</p>
            </div>
          </div>
        </div>

      </div>



      <Footer />
    </div>
  );
}

export default Home;
