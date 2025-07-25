import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Calendar, Users, Plus, BookOpen,Clock, MapPin  } from 'lucide-react'
import EventCard from '../components/EventCard'
import axios from 'axios'

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth)
  const [events, setEvents] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalRegistrations: 0,
    upcomingEvents: 0
  })

  useEffect(() => {
    if (user?.role === 'organizer') {
      fetchOrganizerData()
    } else {
      fetchStudentData()
    }
  }, [user])

  const fetchOrganizerData = async () => {
    try {
      const response = await axios.get('/api/events/organizer')
      setEvents(response.data)
      
      // Calculate stats
      const totalEvents = response.data.length
      const totalRegistrations = response.data.reduce((sum, event) => sum + (event.registrationCount || 0), 0)
      const upcomingEvents = response.data.filter(event => new Date(event.date) > new Date()).length
      
      setStats({ totalEvents, totalRegistrations, upcomingEvents })
    } catch (error) {
      console.error('Error fetching organizer data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudentData = async () => {
    try {
      const response = await axios.get('/api/registrations/student')
      setRegistrations(response.data)
      
      // Calculate stats
      const totalRegistrations = response.data.length
      const upcomingEvents = response.data.filter(reg => new Date(reg.event.date) > new Date()).length
      
      setStats({ totalRegistrations, upcomingEvents, totalEvents: 0 })
    } catch (error) {
      console.error('Error fetching student data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="card bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-primary-100">
              {user?.role === 'organizer' 
                ? 'Manage your events and track registrations' 
                : 'View your registered events and discover new ones'
              }
            </p>
          </div>
          <div className="text-right">
            <p className="text-primary-100 text-sm">{user?.department} Department</p>
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {user?.role === 'organizer' ? (
          <>
            <div className="card text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{stats.totalEvents}</h3>
              <p className="text-gray-600">Total Events</p>
            </div>
            <div className="card text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{stats.totalRegistrations}</h3>
              <p className="text-gray-600">Total Registrations</p>
            </div>
            <div className="card text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{stats.upcomingEvents}</h3>
              <p className="text-gray-600">Upcoming Events</p>
            </div>
          </>
        ) : (
          <>
            <div className="card text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{stats.totalRegistrations}</h3>
              <p className="text-gray-600">Registered Events</p>
            </div>
            <div className="card text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{stats.upcomingEvents}</h3>
              <p className="text-gray-600">Upcoming Events</p>
            </div>
            <div className="card text-center">
              <Link to="/events" className="block hover:bg-gray-50 transition-colors rounded-lg p-4">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Plus className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Discover More</h3>
                <p className="text-gray-600">Browse Events</p>
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      {user?.role === 'organizer' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Your Events</h2>
            <Link to="/create-event" className="btn-primary flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Event
            </Link>
          </div>

          {events.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Events Yet</h3>
              <p className="text-gray-500 mb-6">Create your first event to get started</p>
              <Link to="/create-event" className="btn-primary">
                Create Your First Event
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Registered Events</h2>

          {registrations.length > 0 ? (
            <div className="space-y-4">
              {registrations.map((registration) => (
                <div key={registration._id} className="card">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {registration.event.title}
                      </h3>
                      <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(registration.event.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {registration.event.time}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {registration.event.location}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          Organized by {registration.event.organizer.name}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        new Date(registration.event.date) > new Date() 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {new Date(registration.event.date) > new Date() ? 'Upcoming' : 'Past'}
                      </span>
                      <Link 
                        to={`/events/${registration.event._id}`}
                        className="btn-secondary text-center"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Registered Events</h3>
              <p className="text-gray-500 mb-6">Discover and register for exciting events</p>
              <Link to="/events" className="btn-primary">
                Browse Events
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Dashboard