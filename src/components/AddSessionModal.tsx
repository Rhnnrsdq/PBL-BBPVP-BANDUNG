import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, FileText } from 'lucide-react';
import { addSession, getPrograms } from '../data/mockData';
import { useNotification } from '../hooks/useNotification';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

interface AddSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionAdded: () => void;
}

export default function AddSessionModal({ isOpen, onClose, onSessionAdded }: AddSessionModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    training_id: '',
    date: '',
    time_slot: 'AM' as 'AM' | 'PM',
    title: '',
    description: '',
    location: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { showNotification } = useNotification();

  const programs = getPrograms().filter(p => p.trainer_id === user?.id);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.training_id) {
      newErrors.training_id = 'Please select a program';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Session title is required';
    }
    if (!formData.date) {
      newErrors.date = 'Session date is required';
    }
    if (formData.date && new Date(formData.date) < new Date()) {
      newErrors.date = 'Session date cannot be in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showNotification('error', 'Please fix the form errors');
      return;
    }

    setIsLoading(true);

    try {
      console.log('[ADD_SESSION] Starting session creation:', formData);
      
      const newSession = {
        id: Date.now().toString(),
        training_id: formData.training_id,
        date: formData.date,
        time_slot: formData.time_slot,
        trainer_id: user?.id || '',
        title: formData.title,
        description: formData.description || undefined,
        location: formData.location || undefined
      };

      addSession(newSession);
      console.log('[ADD_SESSION] Session created successfully:', newSession.id);
      
      showNotification('success', `Session "${formData.title}" added successfully!`);
      onSessionAdded();
      onClose();
      
      // Reset form
      setFormData({
        training_id: '',
        date: '',
        time_slot: 'AM',
        title: '',
        description: '',
        location: ''
      });
      setErrors({});
    } catch (error) {
      console.error('[ADD_SESSION] Error creating session:', error);
      showNotification('error', 'Failed to add session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text">Add New Session</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Program Selection */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Training Program *
            </label>
            <select
              name="training_id"
              value={formData.training_id}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent appearance-none bg-white ${
                errors.training_id ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
            >
              <option value="">Select a program...</option>
              {programs.map(program => (
                <option key={program.id} value={program.id}>
                  {program.title}
                </option>
              ))}
            </select>
            {errors.training_id && <p className="text-red-500 text-sm mt-1">{errors.training_id}</p>}
          </div>

          {/* Session Title */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Session Title *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter session title"
                disabled={isLoading}
              />
            </div>
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Time Slot *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  name="time_slot"
                  value={formData.time_slot}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent appearance-none bg-white"
                  disabled={isLoading}
                >
                  <option value="AM">Morning (08:00 - 12:00)</option>
                  <option value="PM">Afternoon (13:00 - 17:00)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                placeholder="Enter session location"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent resize-none"
              placeholder="Enter session description (optional)"
              disabled={isLoading}
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 text-gray-700 py-3 rounded-lg font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-secondary hover:bg-secondary/90 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-all flex items-center justify-center"
            >
              {isLoading ? <LoadingSpinner size="sm" text="Adding..." /> : 'Add Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}