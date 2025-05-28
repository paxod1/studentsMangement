import React, { useEffect, useState } from 'react'
import { TokenRequest } from '../Axios/AxiosCreste';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function UserAnouncement() {

  const [loading, setLoading] = useState(false);
  const [announcement, setAnnouncement] = useState([])
  const [nodata, setNodata] = useState(false)
  const logininfom = useSelector((state) => state.userlogin?.LoginInfo[0]);

  useEffect(() => {
    async function GetAnnouncements() {
      setLoading(true);

      try {
        const response = await TokenRequest.get(`/student/getdatatraining?student_id=${logininfom.student_id}`);
        const batchName = response.data[0]?.batch || 'No Batch Assigned';

        const response1 = await TokenRequest.get(`/student/getdataAnnouncements?batchname=${batchName}`);

        if (response1?.data?.length === 0) {
          setAnnouncement([]);
          setNodata(true);
        } else {
          setAnnouncement(response1.data);
          setNodata(false);
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
        setAnnouncement([]);
        setNodata(true);
      } finally {
        setLoading(false);
      }
    }

    if (logininfom?.student_id) {
      GetAnnouncements();
    }
  }, [logininfom]);



  return (
    <div className='second_section_main'>
      {
        <div className="announcement-container">
          <h1 className="announcement-title">Announcements</h1>
          <Link className='anouncement_button_per' style={{ textDecoration: 'none' }} to={'/Personal-Anouncement'}>Personal Announcements</Link>

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
      }



    </div>
  )
}

export default UserAnouncement