import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import UserLogin from './UserPages/UserLogin'
import UserLayout from './Layouts/UserLayout'
import UserHome from './UserPages/UserHome'
import './Componets/Allcss.css'
import UserProtect from './Componets/UserProtect'
import UserAttendance from './UserPages/UserAttendance'
import UserBill from './UserPages/UserBill'
import UserResult from './UserPages/UserResult'
import UserAnouncement from './UserPages/UserAnouncement'
import UserTask from './UserPages/UserTask'
import UserProject from './UserPages/UserProject'
import UserStudymaterial from './UserPages/UserStudymaterial'
import UserPersonalAnounce from './UserPages/UserPersonalAnounce'
import ClassVideo from './UserPages/UserClassVideo'
import ChangePass from './UserPages/ChangePass'

function App() {
  return (
    <div>

      <Router>
        <Routes>
          {/**Basic routers without verify */}
          <Route path='/' element={<UserLogin />} />

          <Route element={<UserProtect> <UserLayout /> </UserProtect>}>
            <Route path='/home' element={<UserHome />} />
            <Route path='/Attendance' element={<UserAttendance />} />
            <Route path='/Bill' element={<UserBill />} />
            <Route path='/Review' element={<UserResult />} />
            <Route path='/Anouncement' element={<UserAnouncement />} />
            <Route path='/Task' element={<UserTask />} />
            <Route path='/Project' element={<UserProject />} />
            <Route path='/Studymaterial' element={<UserStudymaterial />} />
            <Route path='/Personal-Anouncement' element={<UserPersonalAnounce />} />


          </Route>
          <Route path='/ClassVideo' element={<ClassVideo />} />
          <Route path='/ChangePassword' element={<ChangePass />} />
        </Routes>
      </Router>


    </div>
  )
}

export default App