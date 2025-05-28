import React, { useEffect, useState } from 'react'
import { TokenRequest } from '../Axios/AxiosCreste';
import { useSelector } from 'react-redux';
import '../Componets/Allcss.css'

function UserStudymaterial() {

  const [loading, setLoading] = useState(false);
  const [material, setMaterial] = useState([])
  const [noData, setNoData] = useState(false)

  const logininfom = useSelector((state) => state.userlogin?.LoginInfo[0]);

  useEffect(() => {
    async function GetStudyMaterial() {
      setLoading(true);
      try {
        const response1 = await TokenRequest.get(`/student/getdatatraining?student_id=${logininfom.student_id}`);
        const batchName = response1.data[0]?.batch || 'No Batch Assigned';
        const response = await TokenRequest.get(`/student/getdatamaterial?batchname=${batchName}`);
        if (response.data.length === 0) {
          setMaterial([]);
          setNoData(true);
        } else {
          setMaterial(response.data);
          setNoData(false);
        }
      } catch (error) {
        console.error("Error fetching material:", error);
        setMaterial([]);
        setNoData(true);
      } finally {
        setLoading(false);
      }
    }

    if (logininfom?.student_id) {
      GetStudyMaterial();
    }
  }, [logininfom]);

  return (
    <div className='second_section_main'>

      {
        <div className="material-container">
          <h1 className="material-title">Study Material</h1>
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="material-content">
              {noData ? (
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
      }

    </div>
  )
}

export default UserStudymaterial