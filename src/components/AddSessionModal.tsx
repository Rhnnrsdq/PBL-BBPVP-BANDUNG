import React, { useState } from 'react';
import { X, Calendar, Clock, BookOpen, MapPin, FileText } from 'lucide-react';

interface AddSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sessionData: any) => Promise<void>;
  programs: any[];
}

export default function AddSessionModal({ isOpen, onClose, onSubmit, programs }: AddSessionModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    training_id: '',
    date: '',
    time_slot: 'AM',
    location: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Session title is required';
    }

    if (!formData.training_id) {
      newErrors.training_id = 'Please select a program';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onSubmit(formData);
      setFormData({
        title: '',
        description: '',
        training_id: '',
        date: '',
        time_slot: 'AM',
        location: ''
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error adding session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-text">Add New Session</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Session Title
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter session title"
              />
            </div>
            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Program
            </label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                name="training_id"
                value={formData.training_id}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all appearance-none bg-white ${
                  errors.training_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select a program</option>
                {programs.map(program => (
                  <option key={program.id} value={program.id}>
                    {program.title}
                  </option>
                ))}
              </select>
            </div>
            {errors.training_id && <p className="text-red-600 text-sm mt-1">{errors.training_id}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all ${
                    errors.date ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Time Slot
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  name="time_slot"
                  value={formData.time_slot}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all appearance-none bg-white"
                >
                  <option value="AM">Morning (08:00 - 12:00)</option>
                  <option value="PM">Afternoon (13:00 - 17:00)</option>
                </select>
              </div>
            </div>
          </div>

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
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all ${
                  errors.location ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter location"
              />
            </div>
            {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Description (Optional)
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all resize-none"
                placeholder="Enter session description"
              />
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-secondary hover:bg-secondary/90 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-all"
            >
              {isLoading ? 'Adding...' : 'Add Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}