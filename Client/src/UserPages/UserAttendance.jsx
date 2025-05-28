import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { TokenRequest } from '../Axios/AxiosCreste';
import '../UserStyleSheet/UserAttendace.css'

function UserAttendance() {
  const [student_id, setStudent_id] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [activeSection, setActiveSection] = useState('attendance');
  const [nodata, setNodata] = useState(false)
    const [loading, setLoading] = useState(false);

  const logininfom = useSelector((state) => state.userlogin?.LoginInfo[0]);

  useEffect(() => {
    if (logininfom) {
      setLoading(true);
      setStudent_id(logininfom.student_id);

    }
  }, [logininfom]);

  async function getdataattendance() {
    var response = await TokenRequest.get(`/student/getdataattendance?student_id=${logininfom.student_id}&year=${selectedYear}&month=${selectedMonth}`);
    console.log(response);
    if (response.data.length === 0) {
      setAttendance([]);
      setFilteredAttendance([]);
      setActiveSection(' ');
      setNodata(true)
      setLoading(false);

    } else {
      setActiveSection('attendance');
      setAttendance(response.data);
      setFilteredAttendance(response.data);
      setLoading(false);
    }

  }

  useEffect(() => {

    getdataattendance()
  }, [selectedYear, selectedMonth])


  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  // Calculate Attendance Percentage
  const calculateAttendancePercentage = () => {
    if (attendance.length === 0) return 0;

    const presentCount = attendance.filter(record => record.attendance === 'Present').length;
    const totalDays = attendance.length;
    return (presentCount / totalDays) * 100;
  };


  return (
    <div className='second_section_main'>
      {/* Attendance Section */}
      {
        activeSection === 'attendance' && (
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
    </div>
  )
}

export default UserAttendance