import React, { useState } from 'react';
import { X, FileText, Calendar, BookOpen } from 'lucide-react';

interface AddAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (assignmentData: any) => Promise<void>;
  programs: any[];
}

export default function AddAssignmentModal({ isOpen, onClose, onSubmit, programs }: AddAssignmentModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    training_id: '',
    due_date: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Assignment title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.training_id) {
      newErrors.training_id = 'Please select a program';
    }

    if (!formData.due_date) {
      newErrors.due_date = 'Due date is required';
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
        due_date: ''
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error adding assignment:', error);
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
          <h2 className="text-xl font-bold text-text">Add New Assignment</h2>
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
              Assignment Title
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter assignment title"
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

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Due Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all ${
                  errors.due_date ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.due_date && <p className="text-red-600 text-sm mt-1">{errors.due_date}</p>}
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
              Description
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all resize-none"
                placeholder="Enter assignment description"
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