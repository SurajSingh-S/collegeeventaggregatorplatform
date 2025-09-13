import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Calendar, Clock, MapPin, Users, User, Edit, Trash2 } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const EventDetails = () => {
  const { id } = useParams()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isRegistered, setIsRegistered] = useState(false)
  const [registering, setRegistering] = useState(false)

  useEffect(() => {
    fetchEvent()
    if (isAuthenticated && user?.role === 'student') {
      checkRegistration()
    }
  }, [id, isAuthenticated, user])

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`/api/events/${id}`)
      setEvent(response.data)
    } catch (error) {
      console.error('Error fetching event:', error)
      toast.error('Event not found')
    } finally {
      setLoading(false)
    }
  }

  const checkRegistration = async () => {
    try {
      const response = await axios.get(`/api/registrations/check/${id}`)
      setIsRegistered(response.data.isRegistered)
    } catch (error) {
      console.error('Error checking registration:', error)
    }
  }

  const handleRegister = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to register for events')
      return
    }

    try {
      setRegistering(true)
      await axios.post('/api/registrations', { eventId: id })
      setIsRegistered(true)
      toast.success('Successfully registered for event!')
      fetchEvent() // Refresh event data to update registration count
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setRegistering(false)
    }
  }

  const handleCancelRegistration = async () => {
    try {
      setRegistering(true)
      await axios.delete(`/api/registrations/${id}`)
      setIsRegistered(false)
      toast.success('Registration cancelled successfully!')
      fetchEvent() // Refresh event data to update registration count
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel registration')
    } finally {
      setRegistering(false)
    }
  }

  const handleDeleteEvent = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return
    }

    try {
      await axios.delete(`/api/events/${id}`)
      toast.success('Event deleted successfully!')
      window.history.back()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete event')
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCategoryColor = (category) => {
    const colors = {
      academic: 'bg-blue-100 text-blue-800',
      cultural: 'bg-purple-100 text-purple-800',
      sports: 'bg-green-100 text-green-800',
      technical: 'bg-orange-100 text-orange-800',
      social: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800'
    }
    return colors[category] || colors.other
  }

  const isEventPast = (date) => {
    return new Date(date) < new Date()
  }

  const isEventFull = (registrationCount, maxParticipants) => {
    return registrationCount >= maxParticipants
  }

  const canUserEditEvent = () => {
    return user && user.role === 'organizer' && event && event.organizer._id === user.id
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h2>
        <Link to="/events" className="btn-primary">
          Back to Events
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Event Header */}
      <div className="card">
        {event.bannerImage && (
           <img 
            src={event.bannerImage || '/default-banner.jpg'} 
            alt={event.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}
        
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl font-bold text-gray-800">{event.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(event.category)}`}>
                {event.category}
              </span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                {formatDate(event.date)}
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                {event.time}
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                {event.location}
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                {event.registrationCount || 0} / {event.maxParticipants} registered
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {canUserEditEvent() && (
              <div className="flex gap-2">
                <Link 
                  to={`/edit-event/${event._id}`}
                  className="flex items-center gap-2 btn-secondary"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Link>
                <button 
                  onClick={handleDeleteEvent}
                  className="flex items-center gap-2 btn-danger"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            )}

            {user?.role === 'student' && (
              <div>
                {isRegistered ? (
                  <div className="space-y-2">
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-center font-medium">
                      ✓ You are registered
                    </div>
                    <button
                      onClick={handleCancelRegistration}
                      disabled={registering || isEventPast(event.date)}
                      className="btn-danger w-full"
                    >
                      {registering ? 'Cancelling...' : 'Cancel Registration'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleRegister}
                    disabled={registering || isEventPast(event.date) || isEventFull(event.registrationCount, event.maxParticipants)}
                    className="btn-primary w-full"
                  >
                    {registering ? 'Registering...' : 
                     isEventPast(event.date) ? 'Event Ended' :
                     isEventFull(event.registrationCount, event.maxParticipants) ? 'Event Full' :
                     'Register for Event'}
                  </button>
                )}
              </div>
            )}

            {!isAuthenticated && (
              <div className="text-center">
                <Link to="/login" className="btn-primary w-full">
                  Login to Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Organizer Info */}
        <div className="border-t pt-6">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-gray-500" />
            <div>
              <p className="font-medium text-gray-800">Organized by {event.organizer.name}</p>
              <p className="text-sm text-gray-600">{event.organizer.department} Department</p>
            </div>
          </div>
        </div>
      </div>

      {/* Event Description */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Event</h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {event.description}
          </p>
        </div>
      </div>

      {/* Registration List (for organizers) */}
      {canUserEditEvent() && event.registrations && event.registrations.length > 0 && (
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Registered Students ({event.registrations.length})
          </h2>
          <div className="space-y-3">
            {event.registrations.map((registration) => (
              <div key={registration._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{registration.student.name}</p>
                  <p className="text-sm text-gray-600">
                    {registration.student.studentId} • {registration.student.department}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  Registered: {new Date(registration.registrationDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default EventDetails