import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Target, Award, Mail, Phone, MapPin, Palette, Cog } from 'lucide-react';
import { getPrograms, departments } from '../data/mockData';

export default function Home() {
  const programs = getPrograms().slice(0, 3); // Featured programs

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary via-secondary/90 to-secondary/80 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Empowering Skills for the 
                <span className="text-accent"> Future</span>
              </h1>
              <p className="text-xl mb-8 text-white/90 leading-relaxed">
                Join BBPVP Bandung's comprehensive training programs designed to equip you with cutting-edge skills in creative design, smart manufacturing, and innovative tourism.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/programs"
                  className="bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 inline-flex items-center justify-center group"
                >
                  Explore Programs
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/register"
                  className="border-2 border-white text-white hover:bg-white hover:text-secondary px-8 py-4 rounded-lg font-semibold transition-all inline-flex items-center justify-center"
                >
                  Get Started Today
                </Link>
              </div>
            </div>
            
            {/* Hero Illustration */}
            <div className="lg:text-right animate-scale-up">
              <div className="inline-block p-8 bg-white/10 rounded-2xl backdrop-blur-sm">
                <Users className="h-32 w-32 text-white/80 mx-auto" />
                <p className="text-center mt-4 text-white/90 font-medium">Building Tomorrow's Workforce</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-text mb-6">
            Welcome to BBPVP Bandung
          </h2>
          <p className="text-lg text-text/70 max-w-3xl mx-auto mb-12 leading-relaxed">
            We are a leading vocational training center committed to developing Indonesia's human resources through innovative, industry-relevant programs that bridge the gap between education and employment.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                <Target className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-2">Industry Focused</h3>
              <p className="text-text/60">Programs designed with industry partners to meet real market demands</p>
            </div>
            
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 transition-colors">
                <Award className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-2">Certified Excellence</h3>
              <p className="text-text/60">Nationally recognized certifications that enhance career prospects</p>
            </div>
            
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-green-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/20 transition-colors">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-2">Expert Instructors</h3>
              <p className="text-text/60">Learn from industry professionals with years of practical experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-text mb-6">Our Mission</h2>
              <p className="text-lg text-text/70 mb-6 leading-relaxed">
                To empower individuals with cutting-edge skills and knowledge that drive innovation, productivity, and sustainable growth in Indonesia's evolving economy.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center mt-0.5">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  </div>
                  <span className="text-text/80">Develop world-class technical and creative competencies</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center mt-0.5">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  </div>
                  <span className="text-text/80">Foster entrepreneurial mindset and innovation</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center mt-0.5">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  </div>
                  <span className="text-text/80">Bridge the skills gap between education and industry</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="grid grid-cols-2 gap-6">
                {departments.map((dept) => {
                  const IconComponent = dept.icon === 'Palette' ? Palette : dept.icon === 'Cog' ? Cog : MapPin;
                  return (
                    <div key={dept.key} className="text-center">
                      <div className={`w-12 h-12 ${dept.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <h4 className="font-semibold text-text text-sm">{dept.name}</h4>
                    </div>
                  );
                })}
                <div className="col-span-2 text-center pt-4 border-t border-gray-200">
                  <p className="text-text/60 text-sm">Three specialized departments working towards one goal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-6">
              Featured Training Programs
            </h2>
            <p className="text-lg text-text/70 max-w-2xl mx-auto">
              Explore our most popular programs designed to equip you with in-demand skills for the modern workforce.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {programs.map((program) => {
              const department = departments.find(d => d.key === program.department);
              const IconComponent = department?.icon === 'Palette' ? Palette : department?.icon === 'Cog' ? Cog : MapPin;
              
              return (
                <div key={program.id} className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-2 overflow-hidden">
                  <div className={`h-2 ${department?.color.includes('purple') ? 'bg-purple-500' : department?.color.includes('blue') ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${department?.color} rounded-lg flex items-center justify-center`}>
                        {IconComponent && <IconComponent className="h-6 w-6" />}
                      </div>
                      <span className="text-xs font-medium text-text/60 bg-gray-100 px-2 py-1 rounded-full">
                        {program.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-text mb-2">{program.title}</h3>
                    <p className="text-text/70 mb-4 text-sm leading-relaxed">{program.description}</p>
                    
                    <div className="flex justify-between items-center text-sm text-text/60 mb-4">
                      <span>Duration: 4 weeks</span>
                      <span>{program.current_participants}/{program.max_participants} enrolled</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div 
                        className="bg-accent h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(program.current_participants / program.max_participants) * 100}%` }}
                      ></div>
                    </div>
                    
                    <Link
                      to="/programs"
                      className="w-full bg-secondary hover:bg-secondary/90 text-white py-2 px-4 rounded-lg font-medium transition-all inline-flex items-center justify-center group"
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="text-center">
            <Link
              to="/programs"
              className="bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 inline-flex items-center"
            >
              View All Programs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Get in Touch</h2>
              <p className="text-white/90 text-lg mb-8 leading-relaxed">
                Ready to start your journey with us? Contact our team for more information about our programs, enrollment process, and how we can help you achieve your career goals.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                    <Mail className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-white/80">info@bbpvpbandung.ac.id</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                    <Phone className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-white/80">+62 22 1234 5678</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold">Address</p>
                    <p className="text-white/80">Jl. Pendidikan No. 123<br />Bandung, West Java</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
              <h3 className="text-xl font-semibold mb-6">Quick Contact</h3>
              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:border-accent focus:bg-white/20 transition-all"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:border-accent focus:bg-white/20 transition-all"
                  />
                </div>
                <div>
                  <textarea
                    rows={4}
                    placeholder="Your Message"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:border-accent focus:bg-white/20 transition-all resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-accent hover:bg-accent/90 text-white py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}