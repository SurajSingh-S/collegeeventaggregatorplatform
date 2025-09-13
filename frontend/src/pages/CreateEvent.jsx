import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'


const CreateEvent = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
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

    // Check if date is in the future
    const eventDate = new Date(formData.date)
    if (eventDate < new Date()) {
      toast.error('Event date must be in the future')
      return
    }

    try {
      setLoading(true)

      const form = new FormData()
      for (const key in formData) {
        form.append(key, formData[key])
      }

      const token = localStorage.getItem('token');

      const response = await axios.post('https://collegeeventaggregatorplatform-wayabove.onrender.com/api/events', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      toast.success('Event created successfully!')
      navigate(`/events/${response.data.event._id}`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create event')
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
    { value: 'workshop', label: 'Workshop' },
    { value: 'other', label: 'Other' }
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="text-center mb-8">
          <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Create New Event</h1>
          <p className="text-gray-600">Fill in the details to create an exciting event</p>
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
                min={new Date().toISOString().split('T')[0]}
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

          <div>
            <label htmlFor="bannerImage" className="block text-sm font-medium text-gray-700 mb-2">
              Banner Image
            </label>
            <input
              type="file"
              id="bannerImage"
              name="bannerImage"
              accept="image/*"
              onChange={(e) => setFormData(prev => ({ ...prev, bannerImage: e.target.files[0] }))}
              className="input-field"
            />
            <p className="text-sm text-gray-500 mt-1">
              Upload an image
            </p>
          </div>


          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateEvent