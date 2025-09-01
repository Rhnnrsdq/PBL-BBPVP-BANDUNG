import React, { useState, useMemo } from 'react';
import { Clock, Users, Calendar, Filter, Search } from 'lucide-react';
import { getPrograms, departments } from '../data/mockData';

export default function TrainingPrograms() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const programs = getPrograms();

  const filteredPrograms = useMemo(() => {
    return programs.filter(program => {
      const matchesDepartment = selectedDepartment === 'all' || program.department === selectedDepartment;
      const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           program.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || program.status === selectedStatus;
      
      return matchesDepartment && matchesSearch && matchesStatus;
    });
  }, [programs, selectedDepartment, searchTerm, selectedStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDepartmentIcon = (department: string) => {
    const dept = departments.find(d => d.key === department);
    return dept?.icon || 'Cog';
  };

  const getDepartmentColor = (department: string) => {
    const dept = departments.find(d => d.key === department);
    return dept?.color || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="min-h-screen bg-primary py-12 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-6">
            Training Programs
          </h1>
          <p className="text-lg text-text/70 max-w-3xl mx-auto">
            Explore our comprehensive training programs across three specialized departments designed to prepare you for the future of work.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
              />
            </div>

            {/* Department Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all appearance-none bg-white"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.key} value={dept.key}>{dept.name}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-text/70">
            Showing {filteredPrograms.length} of {programs.length} programs
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPrograms.map((program) => {
            const department = departments.find(d => d.key === program.department);
            
            return (
              <div
                key={program.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-2 overflow-hidden animate-scale-up"
              >
                {/* Status Bar */}
                <div className={`h-2 ${program.status === 'upcoming' ? 'bg-blue-500' : program.status === 'ongoing' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${getDepartmentColor(program.department)} rounded-lg flex items-center justify-center`}>
                      <span className="text-lg font-bold">
                        {department?.name.charAt(0)}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(program.status)}`}>
                      {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-text mb-3">{program.title}</h3>
                  <p className="text-text/70 mb-4 text-sm leading-relaxed line-clamp-3">
                    {program.description}
                  </p>

                  {/* Department Badge */}
                  <div className="mb-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDepartmentColor(program.department)}`}>
                      {department?.name}
                    </span>
                  </div>

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-text/60">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{new Date(program.start_date).toLocaleDateString()} - {new Date(program.end_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-text/60">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{program.current_participants}/{program.max_participants} participants</span>
                    </div>
                    <div className="flex items-center text-sm text-text/60">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>4 weeks duration</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-text/60 mb-1">
                      <span>Enrollment</span>
                      <span>{Math.round((program.current_participants / program.max_participants) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-accent h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(program.current_participants / program.max_participants) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                      program.status === 'upcoming'
                        ? 'bg-secondary hover:bg-secondary/90 text-white'
                        : program.status === 'ongoing'
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    }`}
                    disabled={program.status === 'completed'}
                  >
                    {program.status === 'upcoming' && 'Enroll Now'}
                    {program.status === 'ongoing' && 'Join Session'}
                    {program.status === 'completed' && 'Program Completed'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredPrograms.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-text mb-2">No programs found</h3>
            <p className="text-text/60 mb-6">Try adjusting your search or filter criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDepartment('all');
                setSelectedStatus('all');
              }}
              className="bg-secondary hover:bg-secondary/90 text-white px-6 py-2 rounded-lg font-medium transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Department Info */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {departments.map((dept) => (
            <div key={dept.key} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
              <div className={`w-16 h-16 ${dept.color} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                <span className="text-2xl font-bold">{dept.name.charAt(0)}</span>
              </div>
              <h3 className="text-xl font-bold text-text mb-2 text-center">{dept.name}</h3>
              <p className="text-text/70 text-sm text-center">{dept.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}