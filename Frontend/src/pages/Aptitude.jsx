import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { TokenRequest } from '../AxiosCreate';

function Aptitude() {

    const [loading, setLoading] = useState(false);
    const [nodata, setNodata] = useState(false)
    const logininfom = useSelector((state) => state.userlogin?.LoginInfo[0]);

    useEffect(() => {
        async function GetAptitude() {
            setLoading(true);
            console.log(logininfom);


            try {
                const response = await TokenRequest.get(`/student/getdatatraining?student_id=${logininfom.student_id}`);
                const batchName = response.data[0]?.batch || 'No Batch Assigned';
                console.log(batchName);

                const response1 = await TokenRequest.get(`/student/getAptitude?batchname=${batchName}`);

                if (response1?.data?.length === 0) {
                    setNodata(true);
                } else {
                    console.log(response.data);
                    setNodata(false);
                }
            } catch (error) {
                console.error("Error fetching Aptitude:", error);

                setNodata(true);
            } finally {
                setLoading(false);
            }
        }

        if (logininfom?.student_id) {
            GetAptitude();
        }
    }, [logininfom]);



    return (
        <div >
            <h1>Aptitude page</h1>

        </div>
    )
}

export default Aptitude