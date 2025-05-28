import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function UserProtect({children}) {
    const logininfom = useSelector((state) => state.userlogin?.LoginInfo[0]);
    console.log("from app.js logininfom", logininfom);
    const UserToken = logininfom?.token;


    if (!UserToken) {
        return <Navigate to='/' replace />
    }else{
        return children;
    }
}

export default UserProtect