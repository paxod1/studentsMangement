import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { TokenRequest } from '../Axios/AxiosCreste';
import { FaCheckCircle, FaExclamationCircle, FaHourglassHalf, FaTasks } from 'react-icons/fa';


function UserTask() {
  const [loading, setLoading] = useState(false);
  const [nodata, setNodata] = useState(false)
  const [task, setTask] = useState([])
  const logininfom = useSelector((state) => state.userlogin?.LoginInfo[0]);


  useEffect(() => {


    async function GetTask() {
      setLoading(true)
      var response = await TokenRequest.get(`/student/getTasks?student_id=${logininfom.student_id}`);

      if (response.data.length === 0) {
        setTask([]);
        setActiveSection(' ');
        setNodata(true)
        setLoading(false)
      } else {
        setTask(response.data);
        setLoading(false)

      }
    }
    GetTask()

  }, [])

   const getTaskCounts = (status) => task.filter((task) => task.task_status === status).length;

  return (
    <div className='second_section_main'>
      {
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
      }

    </div>
  )
}

export default UserTask