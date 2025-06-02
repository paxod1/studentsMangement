import React, { useEffect, useState } from 'react';
import { TokenRequest } from '../AxiosCreate';
import { useSelector } from 'react-redux';
import './Home.css';
import { useDispatch } from 'react-redux'
import { LogoutData } from '../Redux/UserSlice';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AiOutlineLogout } from "react-icons/ai";
import {
  FaCalendarMinus, FaCheckCircle, FaExclamationCircle, FaExclamationTriangle, FaFolderOpen, FaHourglassHalf,
  FaIdCard, FaList, FaRegKeyboard, FaSchool, FaSpinner, FaTasks
} from "react-icons/fa";
import { MdInsertChart } from "react-icons/md";
import { IoIosVideocam } from "react-icons/io";
import { FaCalendarCheck } from "react-icons/fa";
import { IoIosCard } from "react-icons/io";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { FaPen } from "react-icons/fa";
import { FaNoteSticky } from "react-icons/fa6";
import { FaChrome } from "react-icons/fa";
import { RiCustomerService2Fill, RiMoneyRupeeCircleFill } from "react-icons/ri";
import { FaClock } from "react-icons/fa6";
import { BiLoaderCircle } from "react-icons/bi";
import { BiTask } from "react-icons/bi";
import { FaLaptopCode } from "react-icons/fa";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Add from '../components/Add';
import DueDateAlert from '../components/PaymentAlert';
import { PiExamFill } from "react-icons/pi";



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
  const [paymentData, setPaymentData] = useState([])
  const [batchname, setBatchname] = useState('')
  const navigate = useNavigate()
  const [material, setMaterial] = useState([])
  const [homeAnnouncement, setHomeAnnouncement] = useState([])
  const [announcement, setAnnouncement] = useState([])
  const [activeMenu, setActiveMenu] = useState("");
  const [nodata, setNodata] = useState(false)
  const [personalAnn, setPersonalAnn] = useState([])
  const [student, setSutdent] = useState([])
  const [task, setTask] = useState([])
  const [project, setProject] = useState([])
  var [dueDate, setDueDate] = useState(null)
  const logininfom = useSelector((state) => state.userlogin?.LoginInfo[0]);
  var [addTime, setAddTime] = useState(false)
  const [showMore, setShowMore] = useState(false);

  const toggleMore = () => {
    setShowMore(prev => !prev);
  };


  function showAd() {
    setTimeout(() => {
      setAddTime(true)
    }, 10000);
  }

  const dispatch = useDispatch()

  async function logout() {
    dispatch(LogoutData())
    await setTimeout(() => {
      window.location.reload();
    }, 0);
  }

  useEffect(() => {
    setLoading(true);
    showAd()
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
        setDueDate(response.data[response.data.length - 1].due_date ? response.data[response.data.length - 1].due_date : null)
        const lastPayment = response.data[response.data.length - 1];
        setPaymentData(lastPayment);
        setSutdent(response2.data[0].name)
      }

      billhome();
    }
  }, [student_id, activeSection]);

  const date = new Date();
  const formattedDate = date.toISOString().split('T')[0];


  const fetchData = async (section) => {
    setActiveMenu(section);
    if (!student_id) return;
    setLoading(true);

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
          // if status is droped the user will logout automaticaly
          if (statuscheck == 'DROPED') {
            toast.error("Student Droped course!");
            dispatch(LogoutData())
            setTimeout(() => {
              window.location.reload();
            }, 4000);
          }

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

        case 'reviews':
          setActiveSection('reviews');
          response = await TokenRequest.get(`/student/getdatareview?student_id=${student_id}`);
          if (response.data.length === 0) {
            setReviews([]);
            setActiveSection(' ');
            setNodata(true)

          } else {
            setReviews(response.data);
          }
          break;

        case 'attendance':
          setActiveSection('attendance');
          response = await TokenRequest.get(`/student/getdataattendance?student_id=${student_id}&year=${selectedYear}&month=${selectedMonth}`);
          if (response.data.length === 0) {
            setAttendance([]);
            setFilteredAttendance([]);
            setActiveSection(' ');
            setNodata(true)

          } else {
            setAttendance(response.data);
            setFilteredAttendance(response.data);
          }
          break;

        case 'bill':
          setActiveSection('bill');
          response = await TokenRequest.get(`/student/getdatabill?student_id=${student_id}`);
          if (response.data.length === 0) {
            setBill([]);
            setActiveSection(' ');
            setNodata(true)

          } else {
            setBill(response.data);
          }
          break;

        case 'material':
          setActiveSection('material');
          response = await TokenRequest.get(`/student/getdatamaterial?batchname=${batchname}`);
          if (response.data.length === 0) {
            setMaterial([]);
            setActiveSection(' ');
            setNodata(true)

          } else {
            setMaterial(response.data);
          }
          break;

        case 'announcement':
          setActiveSection('announcement');
          response = await TokenRequest.get(`/student/getdataAnnouncements?batchname=${batchname}`);

          if (response.data.length === 0) {
            setAnnouncement([]);
            setActiveSection(' ');
            setNodata(true)

          } else {
            setAnnouncement(response.data);
          }

          break;

        case 'Project':
          setActiveSection('Project');

          response = await TokenRequest.get(`/student/getProjects?student_id=${student_id}`);

          if (response.data.length === 0) {
            setActiveSection(' ');
            setNodata(true)
          } else {
            setProject(response.data)

          }
          break;
        case 'personalannouncement':
          setActiveSection('personalannouncement');
          response = await TokenRequest.get(`/student/getdataAnnouncementsid?student_id=${student_id}`);

          if (response.data.length === 0) {
            setPersonalAnn([]);
            setActiveSection(' ');
            setNodata(true)

          } else {
            setPersonalAnn(response.data);

          }
          break;
        case 'task':
          setActiveSection('task');
          response = await TokenRequest.get(`/student/getTasks?student_id=${student_id}`);

          if (response.data.length === 0) {
            setTask([]);
            setActiveSection(' ');
            setNodata(true)

          } else {
            setTask(response.data);
          }
          break;
        case 'tests':
          setActiveSection('tests');

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


  const getTaskCounts = (status) => task.filter((task) => task.task_status === status).length;

  if (dueDate < formattedDate) {

    return (
      <div className="payment-container">
        <DueDateAlert dueDateProp={dueDate} />
        <div className="payment-card">
          <h1 className="payment-title">🚫 Account Not Accessible</h1>
          <p className="payment-message">
            Your payment is pending. Please scan the QR code below to complete your payment and regain access.
          </p>

          <div className="qr-code-box">
            <img src='https://techwingsys.com/idfc-QR-Code-TECHWINGSYS.jpg' alt="Scan to Pay" className="qr-code" />
          </div>

          <p className="payment-note">
            Once the payment is confirmed, your account will be reactivated automatically.
          </p>
        </div>
      </div>
    )
  } else {

    return (
      <div>
        <div className='main_home'>

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
                <Link to={'/ChangePass'} className='change_password_button' >Change Password</Link>

                <h3 onClick={logout} className='menus_right'><AiOutlineLogout />  </h3>

              </div>

            </div>
          </section>


          <div className="topSectionMain_div_userHomepage">
            <div className="topsection_inner_div_userHompage">
              <div className={`topsection_card_userhomepage ${activeMenu === 'batchDetails' ? 'active' : ''}`} onClick={() => fetchData('batchDetails')}>
                <h3><FaList style={{ marginRight: '4%', height: '25px', width: '25px' }} /> <span className='menus_side_home'>Overview</span></h3>
              </div>
              <div className={`topsection_card_userhomepage ${activeMenu === 'reviews' ? 'active' : ''}`} onClick={() => fetchData('reviews')}>
                <h3><MdInsertChart style={{ marginRight: '4%', height: '25px', width: '25px' }} /> <span className='menus_side_home'>Result</span></h3>
              </div>
              <Link to={{ pathname: '/ClassVideo' }} style={{ textDecoration: 'none' }} state={{ batchname }} className={`topsection_card_userhomepage ${activeMenu === 'video' ? 'active' : ''}`}>
                <h3><IoIosVideocam style={{ marginRight: '4%', height: '25px', width: '25px' }} /><span className='menus_side_home'>Video</span></h3>
              </Link>
              <div className={`topsection_card_userhomepage ${activeMenu === 'attendance' ? 'active' : ''}`} onClick={() => fetchData('attendance')}>
                <h3><FaCalendarCheck style={{ marginRight: '4%', height: '25px', width: '25px' }} /><span className='menus_side_home'>Attendance</span></h3>
              </div>
              <div className={`topsection_card_userhomepage ${activeMenu === 'bill' ? 'active' : ''}`} onClick={() => fetchData('bill')}>
                <h3><IoIosCard style={{ marginRight: '4%', height: '25px', width: '25px' }} /><span className='menus_side_home'>Payment</span></h3>
              </div>
              <div className={`topsection_card_userhomepage ${activeMenu === 'announcement' ? 'active' : ''}`} onClick={() => fetchData('announcement')}>
                <h3><HiOutlineSpeakerphone style={{ marginRight: '4%', height: '25px', width: '25px' }} /><span className='menus_side_home'>Announcements</span></h3>
              </div>
              <div className={`topsection_card_userhomepage ${activeMenu === 'Project' ? 'active' : ''}`} onClick={() => fetchData('Project')}>
                <h3><FaLaptopCode style={{ marginRight: '4%', height: '25px', width: '25px' }} /><span className='menus_side_home'>Project</span></h3>
              </div>
              <div className={`topsection_card_userhomepage ${activeMenu === 'task' ? 'active' : ''}`} onClick={() => fetchData('task')}>
                <h3><BiTask style={{ marginRight: '4%', height: '25px', width: '25px' }} /><span className='menus_side_home'>Tasks</span></h3>
              </div>
              <div className={`topsection_card_userhomepage ${activeMenu === 'material' ? 'active' : ''}`} onClick={() => fetchData('material')}>
                <h3><FaNoteSticky style={{ marginRight: '4%', height: '25px', width: '25px' }} /><span className='menus_side_home'>Study Material</span></h3>
              </div>

              <Link className={`topsection_card_userhomepage ${activeMenu === 'website' ? 'active' : ''}`} to={'/Aptitude'} >
                <h3><PiExamFill style={{ marginRight: '4%', height: '25px', width: '25px' }} /><span className='menus_side_home'>Test</span></h3>
              </Link>
              <button className={`topsection_card_userhomepage_button ${activeMenu === 'helpSupport' ? 'active' : ''}`} onClick={() => fetchData('helpSupport')}>
                <h5><RiCustomerService2Fill style={{ marginRight: '4%', height: '25px', width: '25px' }} /><span className='menus_side_home'>Help & Support</span></h5>
              </button>
              <h3 className='sidebar_bottom_text'>Kochi's Premier IT Training Institute</h3>
            </div>
          </div>


          {/**calling ad */}
          {
            addTime && <Add stopAd={setAddTime} />
          }

          {/**calling due */}
          <DueDateAlert dueDateProp={dueDate} />



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

                {nodata ? (
                  <div className='box_notdata'>
                    <h1>No data found</h1>
                  </div>
                ) : (
                  loading ? (
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
                              {filteredAttendance
                                .sort((a, b) => new Date(b.date_taken) - new Date(a.date_taken)) // Sorting by date (most recent first)
                                .map((record, index) => {
                                  const statusClass = record.attendance === 'Present' ? 'present' : 'absent';
                                  return (
                                    <tr key={index} className={statusClass}>
                                      <td>
                                        {new Date(record.date_taken).toLocaleDateString('en-GB', {
                                          day: '2-digit',
                                          month: 'short',
                                          year: 'numeric',
                                        })}
                                      </td>
                                      <td>{record.attendance}</td>
                                    </tr>
                                  );
                                })}

                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            )}


            {/*  Sections tasks*/}


            {activeSection === 'task' && (
              <div className="task-container">
                <h1 className="task-title">Task Records</h1>

                {/* Task Summary with Icons */}
                <div className="task-summary">
                  <div className="summary-box total">
                    <FaTasks className="summary-icon totalicon " />
                    <p className='text_total_inner'>Total Tasks: {task.length}</p>
                  </div>

                  <div className="summary-box pending">
                    <FaHourglassHalf className="summary-icon" />
                    <p className='text_total_inner'>Pending:{getTaskCounts('Pending')}</p>
                  </div>
                  <div className="summary-box late">
                    <FaExclamationCircle className="summary-icon" />
                    <p className='text_total_inner'>Late : {getTaskCounts('Delay Completion')}</p>
                  </div>
                  <div className="summary-box completed">
                    <FaCheckCircle className="summary-icon" />
                    <p className='text_total_inner'> Completed: {getTaskCounts('Completed')}</p>
                  </div>
                </div>

                {/* Task Table */}
                {nodata ? (
                  <div className="box-notdata">
                    <h1>No Tasks Found</h1>
                  </div>
                ) : loading ? (
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                  </div>
                ) : (
                  <div className="task-content">
                    <table className="task-table">
                      <thead>
                        <tr>
                          <th>Description</th>
                          <th>Date Assigned</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {task
                          .sort((a, b) => new Date(b.date_assigned) - new Date(a.date_assigned))
                          .map((task, index) => (
                            <tr key={index} className={`task-status-${task.task_status.toLowerCase()}`}>
                              <td>{task.task_description}</td>
                              <td>
                                {new Date(task.date_assigned).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'long',
                                  year: 'numeric',
                                })}
                              </td>
                              <td>{task.task_status}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/*  Sections Projects*/}

            {
              activeSection === 'Project' &&
              (project.length === 0 ? (
                <div className="box-notdata">
                  <h4>No Project Yet Now</h4>
                </div>
              ) : (
                <div className="project-container">
                  <h1 className="project-title">Project Records</h1>

                  {/* Project Summary with Icons */}
                  <div className="project-summary">
                    <div className="summary-box total">
                      <FaTasks className="summary-icon totalicon" />
                      <p className="text_total_inner">Total Projects: {project.length}</p>
                    </div>
                    <div className="summary-box delayed">
                      <FaExclamationTriangle className="summary-icon" />
                      <p className="text_total_inner">
                        Delayed: {project.filter(proj => proj.project_status === 'delayed').length}
                      </p>
                    </div>
                    <div className="summary-box pending">
                      <FaHourglassHalf className="summary-icon" />
                      <p className="text_total_inner">
                        Pending: {project.filter(proj => proj.project_status === 'pending').length}
                      </p>
                    </div>
                    <div className="summary-box completed">
                      <FaCheckCircle className="summary-icon" />
                      <p className="text_total_inner">
                        Completed: {project.filter(proj => proj.project_status === 'completed').length}
                      </p>
                    </div>
                  </div>

                  {/* Project Table */}
                  <div className="project-content">
                    <table className="project-table">
                      <thead>
                        <tr>
                          <th>Project Name</th>
                          <th>Project Started</th>
                          <th>Deadline</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {project.map((proj, index) => (
                          <tr key={index} className={`project-status-${proj.project_status.toLowerCase()}`}>
                            <td>{proj.project_description}</td>
                            <td>{new Date(proj.date_created).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                            <td>{new Date(proj.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                            <td>{proj.project_status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            }





            {/*  Sections reviews*/}

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
                      <div className="box_notdata">
                        <p className="no-reviews box_notdata">No reviews or marks available</p>
                      </div>
                    ) : (
                      reviews.map((review, index) => {
                        const status = getPassFailStatus(review);
                        const totalMarks =
                          parseInt(review.aptitude) +
                          parseInt(review.technical) +
                          parseInt(review.viva) +
                          (parseInt(review.theory) || 0);
                        const progressPercentage = ((totalMarks / 150) * 100).toFixed(2);

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

                              {/* Progress Bar */}
                              <div className="marks-progress_main">
                                <div className="marks-progress">
                                  <div
                                    className="marks-progress-line"
                                    style={{
                                      width: `${progressPercentage}%`,
                                      backgroundColor: status === 'pass' ? '#4caf50' : '#f44336',
                                    }}
                                  >
                                    <span className="progress-text" style={{

                                      color: status === 'pass' ? '#4caf50' : '#f44336',
                                    }}>{progressPercentage}%</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            )}




            {/*  Sections tests*/}

            {activeSection === 'tests' && (
              <div className="home-container_tests">
                <h1 style={{ color: '#6a5af9' }}>No Test Yet Now</h1>

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
                                    {
                                      paymentData.balance_amount === '0'
                                        ? 'Payment Completed'
                                        : (
                                          <div>
                                            Balance Amount <RiMoneyRupeeCircleFill className='money-icon' />{paymentData.balance_amount}
                                          </div>
                                        )
                                    }
                                  </p>
                                  <div className='due-date'>{paymentData.due_date ? <div> Due Date: {new Date(paymentData.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} </div> : ' '}
                                  </div>
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

            {/* Sections study materails*/}

            {activeSection === 'material' && (
              <div className="material-container">
                <h1 className="material-title">Study Material</h1>
                {loading ? (
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                  </div>
                ) : (
                  <div className="material-content">
                    {material.length === 0 ? (
                      <div className="box_notdata">
                        <p className="no-material">No materials yet now</p>
                      </div>
                    ) : (
                      <ul className="material-list">
                        {material.map((item) => (
                          <li key={item.material_id} className="material-item">
                            <h3>{item.material_title}</h3>
                            <p>{item.material_description}</p>
                            {item.material_file && (
                              <a
                                href={item.material_file.replace('../', '')}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Download Material
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Sections study announcement*/}

            {activeSection === 'announcement' && (
              <div className="announcement-container">
                <h1 className="announcement-title">Announcements</h1>
                <button className='anouncement_button_per' onClick={() => fetchData('personalannouncement')}>Personal Announcements</button>

                {nodata ? (
                  <div>
                    <h1>No data found</h1>
                  </div>
                ) : loading ? (
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                  </div>
                ) : announcement.length === 0 ? (
                  <div className="box_notdata">
                    <p className="no-announcement">No announcements available</p>
                  </div>
                ) : (
                  <div className="announcement-grid">
                    {announcement
                      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Sort by latest date
                      .map((item) => (
                        <div key={item.id} className="announcement-card">
                          <h3 className="announcement-card-title">{item.title}</h3>
                          <p className="announcement-description">{item.description}</p>
                          {item.image && (
                            <div className="announcement-image">
                              <img
                                src={`https://your-backend-url/uploads/${item.image}`}
                                alt={item.title}
                              />
                            </div>
                          )}
                          <p className="announcement-date">
                            Posted on: {new Date(item.created_at).toLocaleDateString()}
                          </p>
                          <p className="announcement-batch">Batch: {item.batch}</p>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}




            {/* Sections personal announcement*/}


            {activeSection === 'personalannouncement' && (
              <div className="announcement-container">
                <h1 className="announcement-title">Announcements</h1>
                <button className='anouncement_button_per' onClick={() => fetchData('announcement')}>Announcements</button>

                {nodata ? (
                  <div>
                    <h1>No data found</h1>
                  </div>
                ) : loading ? (
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                  </div>
                ) : personalAnn.length === 0 ? (
                  <div className="box_notdata">
                    <p className="no-announcement">No announcements available</p>
                  </div>
                ) : (
                  <div className="announcement-grid">
                    {personalAnn
                      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                      .map((item) => (
                        <div key={item.message_id} className="announcement-card">

                          <h3 className="announcement-card-title">{item.message_details}</h3>


                          <p className="announcement-description">{item.message_details}</p>


                          <p className="announcement-date">
                            Posted on: {new Date(item.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                  </div>
                )}
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
                    <div className="box_notdata">
                      <p >No bill data available</p>
                    </div>
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

          {/* Sections Announcement*/}

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


        {/* Sections Sidebar Down side*/}
        <div className="topSectionMain_div_userHomepage_down">
          <div className="topsection_inner_div_userHompage_down">
            <div
              className="topsection_card_userhomepage_down"
              onClick={() => fetchData('batchDetails')}
            >
              <span className="res_down_menus">Overview</span>
              <h3>
                <FaList
                  style={{ marginRight: '4%', height: '25px', width: '25px' }}
                />
              </h3>
            </div>

            <div
              className="topsection_card_userhomepage_down"
              onClick={() => fetchData('reviews')}
            >
              <span className="res_down_menus">Result</span>
              <h3>
                <MdInsertChart
                  style={{ marginRight: '4%', height: '25px', width: '25px' }}
                />
              </h3>
            </div>

            <div
              className="topsection_card_userhomepage_down"
              onClick={() => fetchData('attendance')}
            >
              <span className="res_down_menus">Attendance</span>
              <h3>
                <FaCalendarCheck
                  style={{ marginRight: '4%', height: '25px', width: '25px' }}
                />
              </h3>
            </div>

            <div
              className="topsection_card_userhomepage_down"
              onClick={() => fetchData('bill')}
            >
              <span className="res_down_menus">Payment</span>
              <h3>
                <IoIosCard
                  style={{ marginRight: '4%', height: '25px', width: '25px' }}
                />
              </h3>
            </div>

            <div
              className="topsection_card_userhomepage_down"
              onClick={() => fetchData('task')}
            >
              <span className="res_down_menus">Task</span>
              <h3>
                <BiTask
                  style={{ marginRight: '4%', height: '25px', width: '25px' }}
                />
              </h3>
            </div>

            <div
              className="topsection_card_userhomepage_down"
              onClick={() => fetchData('Project')}
            >
              <span className="res_down_menus">Project</span>
              <h3>
                <FaLaptopCode
                  style={{ marginRight: '4%', height: '25px', width: '25px' }}
                />
              </h3>
            </div>

            {/* —— NEW “More” CARD —— */}
            <div
              className="topsection_card_userhomepage_down"
              onClick={toggleMore}
              style={{ position: 'relative' }}
            >{!showMore &&
              <span className="res_down_menus">More</span>
              }
              <h3>
                <FaFolderOpen
                  style={{ marginRight: '4%', height: '25px', width: '25px' }}
                />
              </h3>

              {showMore && (
                <div
                  className="more-dropdown"
                  style={{
                    position: 'absolute',
                    bottom: '100%',     // “drop-top” sits above the card
                    left: '-30px',
                    background: '#fff',
                    border: '1px solid #ccc',
                    borderRadius: '20px',
                    boxShadow: '2px 0px 6px rgba(0, 0, 0, 0.45)',
                    zIndex: 10,
                    width: '50px',
                    textAlign: 'left',
                  }}
                >
                  <div
                    className="topsection_card_userhomepage_down-more"
                    onClick={() => fetchData('material')}
                  >
                    <span className="res_down_menus-more">Study Materia</span>
                    <h3>
                      <FaNoteSticky
                        style={{ height: '25px', width: '25px' }}
                      />
                    </h3>
                  </div>

                  <Link
                    className="topsection_card_userhomepage_down-more"
                    style={{ textDecoration: 'none' }}
                    to={'/Aptitude'}
                  >
                    <span className="res_down_menus-more">Test</span>
                    <h3>
                      <PiExamFill
                        style={{ height: '25px', width: '25px' }}
                      />
                    </h3>
                  </Link>

                </div>
              )}
            </div>
            {/* —— END “More” CARD —— */}
          </div>
        </div>


        <Footer />
      </div >
    )
  }
}

export default Home;
