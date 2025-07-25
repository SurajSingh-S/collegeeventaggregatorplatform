import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, MapPin, Users } from 'lucide-react'

const EventCard = ({ event }) => {
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

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      {event.bannerImage && (
        <img
          src={
            event.bannerImage
              ? `${import.meta.env.VITE_API_BASE_URL}${event.bannerImage}`
              : '/default-banner.jpg'
          }
          alt={event.title}
          className="w-full h-48 object-cover rounded-t"
        />

        // <img
        //   src={event.bannerImage || '/default-banner.jpg'}
        //   alt={event.title}
        //   className="w-full h-48 object-cover rounded-t"
        // />


      )}

      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">
            {event.title}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
            {event.category}
          </span>
        </div>

        <p className="text-gray-600 line-clamp-3">{event.description}</p>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            {formatDate(event.date)}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-2" />
            {event.time}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-2" />
            {event.location}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-2" />
            {event.registrationCount || 0} / {event.maxParticipants} registered
          </div>
        </div>

        <div className="pt-4 border-t">
          <Link
            to={`/events/${event._id}`}
            className="btn-primary w-full text-center block"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EventCard