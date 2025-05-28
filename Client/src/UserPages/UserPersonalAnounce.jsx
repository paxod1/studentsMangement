import React, { useEffect, useState } from 'react'
import { TokenRequest } from '../../../Frontend/src/AxiosCreate';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function UserPersonalAnounce() {
  const [loading, setLoading] = useState(false);
  const [nodata, setNodata] = useState(false)
  const [personalAnn, setPersonalAnn] = useState([])
  const logininfom = useSelector((state) => state.userlogin?.LoginInfo[0]);

  useEffect(() => {
    async function GetPersonlAnounce() {
      var response = await TokenRequest.get(`/student/getdataAnnouncementsid?student_id=${logininfom.student_id}`);

      if (response.data.length === 0) {
        setPersonalAnn([]);
        setNodata(true)
      } else {
        setPersonalAnn(response.data);
        console.log("personalAnn", personalAnn);
      }
    }
    GetPersonlAnounce()
  }, [])

  return (
    <div className='second_section_main'>
      {
        <div className="announcement-container">
          <h1 className="announcement-title">Announcements</h1>
          <Link className='anouncement_button_per' style={{ textDecoration: 'none' }} to={'/Anouncement'}>Announcements</Link>

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
      }


    </div>
  )
}

export default UserPersonalAnounce