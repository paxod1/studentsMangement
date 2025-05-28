import React, { useEffect, useState } from 'react'
import { TokenRequest } from '../Axios/AxiosCreste';
import { useSelector } from 'react-redux';
import '../Componets/Allcss.css'


function UserResult() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const logininfom = useSelector((state) => state.userlogin?.LoginInfo[0]);

  useEffect(() => {
    async function GetResult() {
      setLoading(true)
      var response = await TokenRequest.get(`/student/getdatareview?student_id=${logininfom.student_id}`);
      if (response.data.length === 0) {
        setReviews([]);
        setLoading(false)

      } else {
        setReviews(response.data);
        setLoading(false)
      }

    }
    GetResult()
  }, [logininfom])


  const getPassFailStatus = (marks) => {
    const aptitude = parseInt(marks.aptitude) || 0;
    const technical = parseInt(marks.technical) || 0;
    const viva = parseInt(marks.viva) || 0;
    const theory = parseInt(marks.theory) || 0;

    const totalMarks = aptitude + technical + viva + theory;
    const passThreshold = 75;
    return totalMarks >= passThreshold ? 'pass' : 'fail';
  };

  return (
    <div>
      {
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
      }

    </div>
  )
}

export default UserResult