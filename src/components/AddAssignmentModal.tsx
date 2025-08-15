import React, { useState } from 'react';
import { X, FileText, Calendar, BookOpen } from 'lucide-react';
import { addAssignment, getPrograms } from '../data/mockData';
import { useNotification } from '../hooks/useNotification';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

interface AddAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssignmentAdded: () => void;
}

export default function AddAssignmentModal({ isOpen, onClose, onAssignmentAdded }: AddAssignmentModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    training_id: '',
    title: '',
    description: '',
    due_date: ''
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
      newErrors.title = 'Assignment title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Assignment description is required';
    }
    if (!formData.due_date) {
      newErrors.due_date = 'Due date is required';
    }
    if (formData.due_date && new Date(formData.due_date) < new Date()) {
      newErrors.due_date = 'Due date cannot be in the past';
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
      console.log('[ADD_ASSIGNMENT] Starting assignment creation:', formData);
      
      const newAssignment = {
        id: Date.now().toString(),
        training_id: formData.training_id,
        title: formData.title,
        description: formData.description,
        due_date: formData.due_date,
        created_by: user?.id || '',
        created_at: new Date().toISOString()
      };

      addAssignment(newAssignment);
      console.log('[ADD_ASSIGNMENT] Assignment created successfully:', newAssignment.id);
      
      showNotification('success', `Assignment "${formData.title}" added successfully!`);
      onAssignmentAdded();
      onClose();
      
      // Reset form
      setFormData({
        training_id: '',
        title: '',
        description: '',
        due_date: ''
      });
      setErrors({});
    } catch (error) {
      console.error('[ADD_ASSIGNMENT] Error creating assignment:', error);
      showNotification('error', 'Failed to add assignment. Please try again.');
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
          <h2 className="text-xl font-bold text-text">Add New Assignment</h2>
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
            <div className="relative">
              <BookOpen className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                name="training_id"
                value={formData.training_id}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent appearance-none bg-white ${
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
            </div>
            {errors.training_id && <p className="text-red-500 text-sm mt-1">{errors.training_id}</p>}
          </div>

          {/* Assignment Title */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Assignment Title *
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
                placeholder="Enter assignment title"
                disabled={isLoading}
              />
            </div>
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Due Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent ${
                  errors.due_date ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
            </div>
            {errors.due_date && <p className="text-red-500 text-sm mt-1">{errors.due_date}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent resize-none ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter assignment description and requirements"
              disabled={isLoading}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
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
              {isLoading ? <LoadingSpinner size="sm" text="Adding..." /> : 'Add Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}