import React, { useState, useEffect } from 'react';
import { X, BookOpen, Calendar, Users, FileText } from 'lucide-react';
import { updateProgram } from '../utils/googleSheetsApi';
import { useNotification } from '../hooks/useNotification';
import LoadingSpinner from './LoadingSpinner';

interface EditProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProgramUpdated: () => void;
  program: any;
}

export default function EditProgramModal({ isOpen, onClose, onProgramUpdated, program }: EditProgramModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: 'smart-creative' as 'smart-creative' | 'smart-manufacturing' | 'smart-tourism',
    start_date: '',
    end_date: '',
    max_participants: 20,
    status: 'upcoming' as 'upcoming' | 'ongoing' | 'completed'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { showNotification } = useNotification();

  useEffect(() => {
    if (program && isOpen) {
      setFormData({
        title: program.title || '',
        description: program.description || '',
        department: program.department || 'smart-creative',
        start_date: program.start_date || '',
        end_date: program.end_date || '',
        max_participants: program.max_participants || 20,
        status: program.status || 'upcoming'
      });
      setErrors({});
    }
  }, [program, isOpen]);

  if (!isOpen || !program) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Program title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Program description is required';
    }
    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }
    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    }
    if (formData.start_date && formData.end_date && new Date(formData.start_date) >= new Date(formData.end_date)) {
      newErrors.end_date = 'End date must be after start date';
    }
    if (formData.max_participants < 1) {
      newErrors.max_participants = 'Maximum participants must be at least 1';
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
      console.log('[EDIT_PROGRAM] Updating program:', program.id, formData);
      
      const result = await updateProgram(program.id, {
        ...formData,
        updated_at: new Date().toISOString()
      });

      if (result.success) {
        console.log('[EDIT_PROGRAM] Program updated successfully');
        showNotification('success', `Program "${formData.title}" updated successfully!`);
        onProgramUpdated();
        onClose();
      } else {
        throw new Error(result.error || 'Failed to update program');
      }
    } catch (error) {
      console.error('[EDIT_PROGRAM] Error updating program:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update program';
      showNotification('error', errorMessage);
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
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text">Edit Program</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Program Title */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Program Title *
            </label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter program title"
                disabled={isLoading}
              />
            </div>
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Description *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter program description"
                disabled={isLoading}
              />
            </div>
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Department *
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent appearance-none bg-white"
              disabled={isLoading}
            >
              <option value="smart-creative">Smart Creative Skills</option>
              <option value="smart-manufacturing">Smart Manufacturing</option>
              <option value="smart-tourism">Smart Tourism</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Start Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent ${
                    errors.start_date ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                End Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent ${
                    errors.end_date ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>}
            </div>
          </div>

          {/* Max Participants and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Maximum Participants *
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="max_participants"
                  value={formData.max_participants}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent ${
                    errors.max_participants ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter maximum participants"
                  disabled={isLoading}
                />
              </div>
              {errors.max_participants && <p className="text-red-500 text-sm mt-1">{errors.max_participants}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent appearance-none bg-white"
                disabled={isLoading}
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
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
              {isLoading ? <LoadingSpinner size="sm" text="Updating..." /> : 'Update Program'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}