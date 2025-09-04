import React, { useState } from 'react';
import { X, BookOpen, Calendar, Users, FileText } from 'lucide-react';

interface AddProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (programData: any) => Promise<void>;
}

export default function AddProgramModal({ isOpen, onClose, onSubmit }: AddProgramModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: 'smart-creative',
    start_date: '',
    end_date: '',
    max_participants: 20,
    status: 'upcoming'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }

    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    }

    if (formData.start_date && formData.end_date && formData.start_date >= formData.end_date) {
      newErrors.end_date = 'End date must be after start date';
    }

    if (formData.max_participants < 1) {
      newErrors.max_participants = 'Max participants must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onSubmit({
        ...formData,
        current_participants: 0
      });
      setFormData({
        title: '',
        description: '',
        department: 'smart-creative',
        start_date: '',
        end_date: '',
        max_participants: 20,
        status: 'upcoming'
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error adding program:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'max_participants' ? parseInt(value) || 0 : value 
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-text">Add New Program</h2>
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
              Program Title
            </label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter program title"
              />
            </div>
            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Description
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all resize-none ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter program description"
              />
            </div>
            {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Department
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all appearance-none bg-white"
            >
              <option value="smart-creative">Smart Creative Skills</option>
              <option value="smart-manufacturing">Smart Manufacturing</option>
              <option value="smart-tourism">Smart Tourism</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Start Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all ${
                    errors.start_date ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.start_date && <p className="text-red-600 text-sm mt-1">{errors.start_date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                End Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all ${
                    errors.end_date ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.end_date && <p className="text-red-600 text-sm mt-1">{errors.end_date}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Max Participants
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="number"
                name="max_participants"
                value={formData.max_participants}
                onChange={handleInputChange}
                min="1"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all ${
                  errors.max_participants ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter max participants"
              />
            </div>
            {errors.max_participants && <p className="text-red-600 text-sm mt-1">{errors.max_participants}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all appearance-none bg-white"
            >
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
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
              {isLoading ? 'Updating...' : 'Update Program'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}