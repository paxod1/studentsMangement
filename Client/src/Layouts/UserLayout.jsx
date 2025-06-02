import React from 'react'
import { Outlet } from 'react-router-dom'
import UserNavbar from '../Componets/UserNavbar'
import UserSidbar from '../Componets/UserSidebar'
import UserDownbar from '../Componets/UserDownbar'
import Footer from '../Componets/UserFooter'

function UserLayout() {
    return (
        <div>
            <UserNavbar />
            <UserSidbar />

            <Outlet />

            <UserDownbar />
            <Footer />

        </div>
    )
}

export default UserLayout