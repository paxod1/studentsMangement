import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { TokenRequest } from '../Axios/AxiosCreste';
import '../UserStyleSheet/UserBill.css'
import '../Componets/Allcss.css'

function UserBill() {
  const [bill, setBill] = useState([]);
  const [loading, setLoading] = useState(true);

  const logininfom = useSelector((state) => state.userlogin?.LoginInfo[0]);

  useEffect(() => {
    setLoading(true);

    async function GetBill() {
      try {
        const response = await TokenRequest.get(`/student/getdatabill?student_id=${logininfom.student_id}`);
        if (response.data.length === 0) {
          setBill([]);
        } else {
          setBill(response.data);
        }
        console.log('Fetched bill data:', response.data);
      } catch (error) {
        console.error('Error fetching bill data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (logininfom?.student_id) {
      GetBill();
    }
  }, [logininfom]);



  return (
    <div className='second_section_main'>
      {
        <div className="bill-container">
          <h1>Bill Details</h1>
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : (
            bill.length === 0 ? (
              <div className="box_notdata">
                <p >No bill data available</p>
              </div>
            ) : (
              bill.map((record, index) => (
                <div key={index} className="bill-card">
                  <div className="bill-header">
                    <h3>Bill ID: {record.bill_id}</h3>
                    <p><strong>Pay Status:</strong> {record.pay_status}</p>
                  </div>
                  <div className="bill-body">
                    <p><strong>Amount:</strong> ₹{record.amount}</p>
                    <p><strong>Balance Amount:</strong> ₹{record.balance_amount}</p>
                    <p><strong>Payment Method:</strong> {record.pay_method}</p>
                    <p><strong>Pay Date:</strong> {new Date(record.pay_date).toLocaleDateString()}</p>
                    <p><strong>Due Date:</strong> {new Date(record.due_date).toLocaleDateString()}</p>
                    <p><strong>Number of EMIs:</strong> {record.no_of_emi}</p>
                    <p><strong>Training ID:</strong> {record.training_id}</p>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      }

    </div>
  )
}

export default UserBill