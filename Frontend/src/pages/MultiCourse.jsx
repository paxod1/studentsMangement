import React, { useEffect, useState } from 'react';
import './MultiCourse.css';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { basicRequest, TokenRequest } from '../AxiosCreate';
import { LoginData } from '../Redux/UserSlice';


function MultiCourse({ data }) {
    const [courses, setCourses] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        async function getCourses() {
            try {
                const responses = await Promise.all(
                    data.trainingIdArray.map(id =>
                        basicRequest.get(`/student/getdatatraining?training_id=${id}`)
                    )
                );

                const courseData = responses.map(res => res.data); // extract data from all responses
                setCourses(courseData);
            } catch (error) {
                console.error("Error fetching course data:", error);
            }
        }

        getCourses();
    }, [data]);

    const handleSelect = (selectedCourse) => {
        dispatch(LoginData({ ...data, selectedTrainingId: selectedCourse.training_id }));
        navigate('/'); // or your target route
    };

    return (
        <div className="multi-course-container">
            <h2>Select Your Course</h2>
            <div className="course-box-wrapper">
                {courses.map((course, index) => (
                    <div
                        key={index}
                        className="course-box"
                        onClick={() => handleSelect(course)}
                    >
                        <h3>{course.batch || `Course ${index + 1}`}</h3>
                        <p>Training ID: {course.training_id}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MultiCourse;
