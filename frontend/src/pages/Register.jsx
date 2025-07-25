// import React, { useState, useEffect } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import { register, clearError } from '../redux/authSlice'
// import { UserPlus } from 'lucide-react'
// import toast from 'react-hot-toast'

// const Register = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     role: 'student',
//     studentId: '',
//     department: '',
//     adminCode:''
//   })

//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   const { loading, error, isAuthenticated } = useSelector((state) => state.auth)

//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate('/dashboard')
//     }
//   }, [isAuthenticated, navigate])

//   useEffect(() => {
//     if (error) {
//       toast.error(error)
//       dispatch(clearError())
//     }
//   }, [error, dispatch])

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     })
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
    
//     // Validation
//     if (!formData.name || !formData.email || !formData.password || !formData.department) {
//       toast.error('Please fill in all required fields')
//       return
//     }

//     if (formData.role === 'student' && !formData.studentId) {
//       toast.error('Student ID is required for students')
//       return
//     }

//     if (formData.password !== formData.confirmPassword) {
//       toast.error('Passwords do not match')
//       return
//     }

//     if (formData.password.length < 6) {
//       toast.error('Password must be at least 6 characters long')
//       return
//     }

//     try {
//       const result = await dispatch(register({
//         name: formData.name,
//         email: formData.email,
//         password: formData.password,
//         role: formData.role,
//         studentId: formData.studentId,
//         department: formData.department
//       }))
      
//       if (register.fulfilled.match(result)) {
//         toast.success('Registration successful!')
//         navigate('/dashboard')
//       }
//     } catch (error) {
//       console.error('Registration error:', error)
//     }
//   }

//   return (
//     <div className="max-w-md mx-auto">
//       <div className="card">
//         <div className="text-center mb-8">
//           <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//             <UserPlus className="h-8 w-8 text-primary-600" />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
//           <p className="text-gray-600">Join our college events community</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//               Full Name
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className="input-field"
//               placeholder="Enter your full name"
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//               Email Address
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="input-field"
//               placeholder="Enter your email"
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
//               Role
//             </label>
//             <select
//               id="role"
//               name="role"
//               value={formData.role}
//               onChange={handleChange}
//               className="input-field"
//               required
//             >
//               <option value="student">Student</option>
//               <option value="organizer">Organizer</option>
//             </select>
//           </div>

//           {formData.role === 'student' && (
//             <div>
//               <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
//                 Student ID
//               </label>
//               <input
//                 type="text"
//                 id="studentId"
//                 name="studentId"
//                 value={formData.studentId}
//                 onChange={handleChange}
//                 className="input-field"
//                 placeholder="Enter your student ID"
//                 required
//               />
//             </div>
//           )}

//           <div>
//             <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
//               Department
//             </label>
//             <select
//               id="department"
//               name="department"
//               value={formData.department}
//               onChange={handleChange}
//               className="input-field"
//               required
//             >
//               <option value="">Select Department</option>
//               <option value="Computer Science">Computer Science</option>
//               <option value="Engineering">Engineering</option>
//               <option value="Business">Business</option>
//               <option value="Arts">Arts</option>
//               <option value="Science">Science</option>
//               <option value="Mathematics">Mathematics</option>
//               <option value="Other">Other</option>
//             </select>
//           </div>

//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               className="input-field"
//               placeholder="Enter your password"
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
//               Confirm Password
//             </label>
//             <input
//               type="password"
//               id="confirmPassword"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               className="input-field"
//               placeholder="Confirm your password"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="btn-primary w-full"
//           >
//             {loading ? 'Creating Account...' : 'Create Account'}
//           </button>
//         </form>

//         <div className="mt-6 text-center">
//           <p className="text-gray-600">
//             Already have an account?{' '}
//             <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
//               Sign in
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }



// export default Register














import React, { useState, useEffect } from 'react' 
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { register, clearError } from '../redux/authSlice'
import { UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    studentId: '',
    department: '',
    adminCode: ''
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.department) {
      toast.error('Please fill in all required fields')
      return
    }

    if (formData.role === 'student' && !formData.studentId) {
      toast.error('Student ID is required for students')
      return
    }


    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    try {
      const result = await dispatch(register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        studentId: formData.studentId,
        department: formData.department,
        adminCode: formData.adminCode 
      }))
      
      if (register.fulfilled.match(result)) {
        toast.success('Registration successful!')
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Registration error:', error)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <div className="text-center mb-8">
          <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-600">Join our college events community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="student">Student</option>
              <option value="organizer">Organizer</option>
            </select>
          </div>

          {formData.role === 'student' && (
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
                Student ID
              </label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your student ID"
                required
              />
            </div>
          )}

          {formData.role === 'organizer' && (
            <div>
              <label htmlFor="adminCode" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Code
              </label>
              <input
                type="password"
                id="adminCode"
                name="adminCode"
                value={formData.adminCode}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter the admin code"
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Select Department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Engineering">Engineering</option>
              <option value="Business">Business</option>
              <option value="Arts">Arts</option>
              <option value="Science">Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your password"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
