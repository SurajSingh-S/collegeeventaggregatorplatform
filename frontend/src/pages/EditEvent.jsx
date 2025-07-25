import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Edit } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const EditEvent = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [bannerFile, setBannerFile] = useState(null)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'academic',
    maxParticipants: 100,
    bannerImage: ''
  })

  useEffect(() => {
    fetchEvent()
  }, [id])

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`/api/events/${id}`)
      const event = response.data

      // Format date for input field
      const eventDate = new Date(event.date).toISOString().split('T')[0]

      setFormData({
        title: event.title,
        description: event.description,
        date: eventDate,
        time: event.time,
        location: event.location,
        category: event.category,
        maxParticipants: event.maxParticipants,
        bannerImage: event.bannerImage || ''
      })
    } catch (error) {
      console.error('Error fetching event:', error)
      toast.error('Event not found')
      navigate('/dashboard')
    } finally {
      setFetchLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.date || !formData.time || !formData.location) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)

      const form = new FormData()
      form.append('title', formData.title)
      form.append('description', formData.description)
      form.append('date', formData.date)
      form.append('time', formData.time)
      form.append('location', formData.location)
      form.append('category', formData.category)
      form.append('maxParticipants', formData.maxParticipants)

      // Only append new file if user selected one
      if (bannerFile) {
        form.append('bannerImage', bannerFile)
      }

      await axios.put(`/api/events/${id}`, form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      toast.success('Event updated successfully!')
      navigate(`/events/${id}`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update event')
    } finally {
      setLoading(false)
    }
  }


  const categories = [
    { value: 'academic', label: 'Academic' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'sports', label: 'Sports' },
    { value: 'technical', label: 'Technical' },
    { value: 'social', label: 'Social' },
    { value: 'other', label: 'Other' }
  ]

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="text-center mb-8">
          <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Edit className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Edit Event</h1>
          <p className="text-gray-600">Update your event details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter event title"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="input-field"
              placeholder="Describe your event..."
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Event Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                Event Time *
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="input-field"
              placeholder="Event venue or location"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
                required
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-2">
                Max Participants
              </label>
              <input
                type="number"
                id="maxParticipants"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                className="input-field"
                min="1"
                max="1000"
              />
            </div>
          </div>

          <input
            type="file"
            id="bannerFile"
            accept="image/*"
            onChange={(e) => setBannerFile(e.target.files[0])}
            className="input-field"
          />
          <p className="text-sm text-gray-500 mt-1">
            Upload a new banner image to replace the existing one
          </p>
          {formData.bannerImage && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Current Image:</p>
              <img src={formData.bannerImage} alt="Current banner" className="w-full h-48 object-cover rounded-lg mt-1" />
            </div>
          )}


          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate(`/events/${id}`)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'Updating...' : 'Update Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditEvent