import React, { useEffect, useState } from 'react';
import './ChangePass.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { TokenRequest } from '../AxiosCreate';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';

function ChangePass() {
  const [studentData, setStudentData] = useState({});
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const logininfom = useSelector((state) => state.userlogin?.LoginInfo[0]);
  const student_id = logininfom?.student_id;
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStudentDetails() {
      try {
        const res = await TokenRequest.get(`/student/getstudent?student_id=${student_id}`);
        console.log(res.data[0]);
        
        setStudentData(res.data[0]);
      } catch (err) {
        toast.error("Failed to fetch details");
      }
    }
    fetchStudentDetails();
  }, [student_id]);

  async function handleChangePassword() {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const res = await TokenRequest.post('/student/change-password', {
        student_id,
        currentPassword,
        newPassword
      });
      toast.success(res.data.message);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || "Password update failed.");
    }
    setLoading(false);
  }

  async function handleUpdateDetails() {
    try {
      const res = await TokenRequest.put('/student/updatedata', { ...studentData, student_id });
      toast.success(res.data.message || "Updated successfully");
    } catch (err) {
      toast.error("Failed to update details.");
    }
  }

  return (
    <div className="main-container">
      <section className="navbar_main_video">
        <div className="inner_div_nav_video">
          <div className="leftnav_video">
            <img src="https://techwingsys.com/tws-logo.png" className="logo_nav_video" alt="logo" />
          </div>
          <div className="rightnav_video">
            <Link to="/" className="menus_right_video">
              <AiFillHome /> <span className="menus_right_video_text">Home</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="update-section">
        {/* Details Update */}
        <div className="update-box">
          <h3>Update Student Details</h3>
          <input value={studentData.name || ''} onChange={(e) => setStudentData({ ...studentData, name: e.target.value })} placeholder="Full Name" />
          <input value={studentData.email || ''} onChange={(e) => setStudentData({ ...studentData, email: e.target.value })} placeholder="Email" />
          <input value={studentData.mobile_num || ''} onChange={(e) => setStudentData({ ...studentData, mobile_num: e.target.value })} placeholder="Mobile Number" />
          <input value={studentData.address || ''} onChange={(e) => setStudentData({ ...studentData, address: e.target.value })} placeholder="Address" />
          <button onClick={handleUpdateDetails}>Update Details</button>
        </div>

        {/* Password Update */}
        <div className="update-box">
          <h3>Change Password</h3>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current Password" />
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" />
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" />
          <button onClick={handleChangePassword} disabled={loading}>
            {loading ? 'Updating...' : 'Change Password'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangePass;
