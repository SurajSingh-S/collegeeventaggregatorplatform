import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Users, Award, Sparkles } from 'lucide-react'
import EventCard from '../components/EventCard'
import axios from 'axios'

const Home = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUpcomingEvents()
  }, [])

  const fetchUpcomingEvents = async () => {
    try {
      const response = await axios.get('/api/events?limit=6')
      setUpcomingEvents(response.data.slice(0, 6))
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-16">


      {/* Hero sex*/}
      <section className="text-center py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-2xl">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-6">
            Discover Amazing College Events
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Join exciting events, connect with peers, and make unforgettable memories at your college
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/events" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Browse Events
            </Link>
            <Link to="/register" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors">
              Join Now
            </Link>
          </div>
        </div>
      </section>




      {/* Features sex */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="text-center p-6">
          <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Diverse Events</h3>
          <p className="text-gray-600">From academic seminars to cultural festivals, find events that match your interests</p>
        </div>
        
        <div className="text-center p-6">
          <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Easy Registration</h3>
          <p className="text-gray-600">Register for events with just a few clicks and manage your schedule effortlessly</p>
        </div>
        
        <div className="text-center p-6">
          <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Networking</h3>
          <p className="text-gray-600">Connect with like-minded students and build lasting relationships</p>
        </div>
      </section>



      {/* Upcoming Events sex */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Upcoming Events</h2>
            <p className="text-gray-600">Don't miss out on these exciting upcoming events</p>
          </div>
          <Link to="/events" className="btn-primary">
            View All Events
          </Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="card animate-pulse">
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : upcomingEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Sparkles className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Events Yet</h3>
            <p className="text-gray-500">Check back soon for exciting upcoming events!</p>
          </div>
        )}
      </section>

      {/* CTA Sesx */}
      <section className="bg-gray-100 rounded-2xl p-12 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Get Started?</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Join our community of students and organizers. Discover events, make connections, and create memorable experiences.
        </p>
        <Link to="/register" className="btn-primary text-lg px-8 py-3">
          Join the Community
        </Link>
      </section>
    </div>
  )
}

export default Home