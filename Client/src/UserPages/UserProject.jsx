import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { TokenRequest } from '../Axios/AxiosCreste';
import { FaCheckCircle, FaExclamationTriangle, FaHourglassHalf, FaTasks } from 'react-icons/fa';


function UserProject() {

    const [loading, setLoading] = useState(false);

    const [project, setProject] = useState([])
    const logininfom = useSelector((state) => state.userlogin?.LoginInfo[0]);


    useEffect(() => {

        async function GetProjects() {
            setLoading(true)
            var response = await TokenRequest.get(`/student/getProjects?student_id=${logininfom.student_id}`);

            if (response.data.length === 0) {
                setActiveSection(' ');
                setNodata(true)
                setLoading(false)
            } else {
                setProject(response.data)
                console.log(project);
                setLoading(false)
            }
        }
        GetProjects()
    }, [])

    return (
        <div  className='second_section_main'>
            {
                loading ?
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                    </div>
                    :
                    project.length === 0 ? (
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
                    )
            }

        </div>
    )
}

export default UserProject