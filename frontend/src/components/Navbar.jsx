// import React from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { useSelector, useDispatch } from 'react-redux'
// import { logout } from '../redux/authSlice'
// import { Calendar, User, LogOut, Plus } from 'lucide-react'

// const Navbar = () => {
//   const { isAuthenticated, user } = useSelector((state) => state.auth)
//   const dispatch = useDispatch()
//   const navigate = useNavigate()

//   const handleLogout = () => {
//     dispatch(logout())
//     navigate('/')
//   }

//   return (
//     <nav className="bg-white shadow-lg">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center py-4">
//           <Link to="/" className="flex items-center space-x-2">
//             <Calendar className="h-8 w-8 text-primary-600" />
//             <span className="text-xl font-bold text-gray-800">College Events</span>
//           </Link>

// <div>
//               <span className="text-3xl font-extrabold text-black ">Galgotias University</span>

// </div>

//           <div className="flex items-center space-x-6">
//             <Link to="/events" className="text-gray-600 hover:text-primary-600 transition-colors">
//               Events
//             </Link>

//             {isAuthenticated ? (
//               <>
//                 <Link to="/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors">
//                   Dashboard
//                 </Link>

//                 {user?.role === 'organizer' && (
//                   <Link
//                     to="/create-event"
//                     className="flex items-center space-x-1 bg-primary-600 text-white px-3 py-2 rounded-lg hover:bg-primary-700 transition-colors"
//                   >
//                     <Plus className="h-4 w-4" />
//                     <span>Create Event</span>
//                   </Link>
//                 )}

//                 <div className="flex items-center space-x-3">
//                   <div className="flex items-center space-x-2">
//                     {/* <User className="h-5 w-5 text-gray-500" />
//                     <span className="text-sm text-gray-600">{user?.name}</span> */}

//                     <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold text-sm uppercase">
//                       {user?.name?.charAt(0) || 'U'}
//                     </div>

//                     <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
//                       {user?.role}
//                     </span>
//                   </div>
//                   <button
//                     onClick={handleLogout}
//                     className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
//                   >
//                     <LogOut className="h-4 w-4" />
//                     <span>Logout</span>
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <div className="flex items-center space-x-4">
//                 <Link
//                   to="/login"
//                   className="text-gray-600 hover:text-primary-600 transition-colors"
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   to="/register"
//                   className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
//                 >
//                   Register
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   )
// }

// export default Navbar



import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/authSlice'
import { Calendar, LogOut, Plus } from 'lucide-react'

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Calendar className="h-7 w-7 text-primary-600" />
            <span className="text-xl font-semibold text-gray-800">College Events</span>
          </Link>

          {/* University Title */}
          <div className="hidden sm:block">
            <span className="text-2xl font-bold text-black">Galgotias University</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link to="/events" className="text-gray-600 hover:text-primary-600 transition font-medium">
              Events
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-primary-600 transition font-medium">
                  Dashboard
                </Link>

                {user?.role === 'organizer' && (
                  <Link
                    to="/create-event"
                    className="flex items-center gap-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Event</span>
                  </Link>
                )}

                {/* Profile Circle + Role + Logout */}
                <div className="flex items-center gap-4">
                  <Link
                    to="/profile"
                    className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold uppercase hover:scale-105 transition"
                    title="View Profile"
                  >
                    {user?.name?.charAt(0) || 'U'}
                  </Link>

                  <span className="text-xs font-semibold bg-primary-300 py-2 text-primary-800 px-2  rounded-md capitalize">
                    {user?.role}
                  </span>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary-600 transition font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
