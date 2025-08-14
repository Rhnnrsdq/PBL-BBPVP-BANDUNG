import React, { useState, useMemo } from 'react';
import { Calendar, Clock, User, MapPin, Filter } from 'lucide-react';
import { getSessions, getPrograms, getUsers } from '../data/mockData';
import { format, parseISO, isSameDay } from 'date-fns';

export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('all');

  const sessions = getSessions();
  const programs = getPrograms();
  const users = getUsers();

  const enrichedSessions = useMemo(() => {
    return sessions.map(session => {
      const program = programs.find(p => p.id === session.training_id);
      const trainer = users.find(u => u.id === session.trainer_id);
      
      return {
        ...session,
        program,
        trainer
      };
    });
  }, [sessions, programs, users]);

  const filteredSessions = useMemo(() => {
    return enrichedSessions.filter(session => {
      const matchesDate = selectedDate === 'all' || session.date === selectedDate;
      const matchesTimeSlot = selectedTimeSlot === 'all' || session.time_slot === selectedTimeSlot;
      
      return matchesDate && matchesTimeSlot;
    });
  }, [enrichedSessions, selectedDate, selectedTimeSlot]);

  // Group sessions by date
  const sessionsByDate = useMemo(() => {
    const grouped = filteredSessions.reduce((acc, session) => {
      if (!acc[session.date]) {
        acc[session.date] = [];
      }
      acc[session.date].push(session);
      return acc;
    }, {} as Record<string, typeof filteredSessions>);

    // Sort dates
    return Object.keys(grouped)
      .sort()
      .reduce((acc, date) => {
        acc[date] = grouped[date].sort((a, b) => {
          if (a.time_slot === 'AM' && b.time_slot === 'PM') return -1;
          if (a.time_slot === 'PM' && b.time_slot === 'AM') return 1;
          return 0;
        });
        return acc;
      }, {} as Record<string, typeof filteredSessions>);
  }, [filteredSessions]);

  const getUniqueDate = () => {
    return [...new Set(sessions.map(s => s.date))].sort();
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'EEEE, MMMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  const getTimeSlotDetails = (timeSlot: string) => {
    return timeSlot === 'AM' 
      ? { time: '08:00 - 12:00', label: 'Morning Session' }
      : { time: '13:00 - 17:00', label: 'Afternoon Session' };
  };

  return (
    <div className="min-h-screen bg-primary py-12 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-xl mb-6">
            <Calendar className="h-8 w-8 text-secondary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-6">
            Training Schedule
          </h1>
          <p className="text-lg text-text/70 max-w-3xl mx-auto">
            Stay up to date with all upcoming training sessions, workshops, and events. Plan your learning journey with our comprehensive schedule.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all appearance-none bg-white"
              >
                <option value="all">All Dates</option>
                {getUniqueDate().map(date => (
                  <option key={date} value={date}>
                    {formatDate(date)}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Slot Filter */}
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all appearance-none bg-white"
              >
                <option value="all">All Time Slots</option>
                <option value="AM">Morning (08:00 - 12:00)</option>
                <option value="PM">Afternoon (13:00 - 17:00)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-text/70">
            Showing {filteredSessions.length} sessions
          </p>
        </div>

        {/* Schedule List */}
        <div className="space-y-8">
          {Object.entries(sessionsByDate).map(([date, dateSessions]) => (
            <div key={date} className="animate-slide-up">
              {/* Date Divider */}
              <div className="flex items-center mb-6">
                <div className="bg-secondary text-white px-6 py-3 rounded-full">
                  <h2 className="text-lg font-semibold">
                    {formatDate(date)}
                  </h2>
                </div>
                <div className="flex-1 h-px bg-gray-300 ml-6"></div>
              </div>

              {/* Sessions for this date */}
              <div className="grid gap-6">
                {dateSessions.map((session) => {
                  const timeDetails = getTimeSlotDetails(session.time_slot);
                  
                  return (
                    <div
                      key={session.id}
                      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1 p-6"
                    >
                      <div className="grid lg:grid-cols-4 gap-6 items-center">
                        {/* Time Slot */}
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            session.time_slot === 'AM' 
                              ? 'bg-blue-100 text-blue-600' 
                              : 'bg-orange-100 text-orange-600'
                          }`}>
                            <Clock className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="font-semibold text-text">{timeDetails.label}</p>
                            <p className="text-text/60 text-sm">{timeDetails.time}</p>
                          </div>
                        </div>

                        {/* Session Info */}
                        <div className="lg:col-span-2">
                          <h3 className="text-xl font-bold text-text mb-2">{session.title}</h3>
                          {session.program && (
                            <p className="text-text/70 mb-2">{session.program.title}</p>
                          )}
                          <div className="flex items-center space-x-4 text-sm text-text/60">
                            {session.trainer && (
                              <div className="flex items-center space-x-1">
                                <User className="h-4 w-4" />
                                <span>{session.trainer.name}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>Training Room A</span>
                            </div>
                          </div>
                        </div>

                        {/* Action */}
                        <div className="text-right">
                          <button className="bg-secondary hover:bg-secondary/90 text-white px-6 py-2 rounded-lg font-medium transition-all">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {Object.keys(sessionsByDate).length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-text mb-2">No sessions found</h3>
            <p className="text-text/60 mb-6">Try adjusting your filter criteria or check back later for new sessions.</p>
            <button
              onClick={() => {
                setSelectedDate('all');
                setSelectedTimeSlot('all');
              }}
              className="bg-secondary hover:bg-secondary/90 text-white px-6 py-2 rounded-lg font-medium transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Legend */}
        <div className="mt-12 bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-text mb-4">Time Slot Legend</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-text">Morning Session (AM)</p>
                <p className="text-sm text-text/60">08:00 - 12:00</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-text">Afternoon Session (PM)</p>
                <p className="text-sm text-text/60">13:00 - 17:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}