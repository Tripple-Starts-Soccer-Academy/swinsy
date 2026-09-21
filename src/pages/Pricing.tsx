import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Star, Users, CreditCard } from 'lucide-react';

export const Pricing: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  const plans = [
    {
      id: 'free',
      name: 'Free Plan',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started with Python basics',
      features: [
        'Python Basics Course',
        'Access to Online IDE',
        'Basic Exercises',
        'Community Support',
        'Limited Project Storage'
      ],
      notIncluded: [
        'Advanced Courses',
        'One-on-One Tutoring',
        'Certificate of Completion',
        'Priority Support',
        'Unlimited Projects'
      ],
      popular: false,
      buttonText: 'Get Started',
      buttonLink: '/courses'
    },
    {
      id: 'tutoring',
      name: 'Python Tutoring',
      price: '$30',
      period: 'per hour',
      description: 'Personalized one-on-one Python instruction. First 8 weeks free.',
      features: [
        'Expert Python Tutors',
        'Personalized Learning Plan',
        'Real-time Code Review',
        'Flexible Scheduling',
        'Screen Sharing Support',
        'Recorded Sessions',
        'Homework Help',
        'Project Guidance'
      ],
      notIncluded: [
        'Course Materials (sold separately)',
        '24/7 Support'
      ],
      popular: true,
      buttonText: 'Book Session',
      buttonLink: '#booking'
    },
    {
      id: 'premium',
      name: 'Premium Access',
      price: '$99',
      period: 'per month',
      description: 'Complete access to all courses and features',
      features: [
        'All Python Courses',
        'Unlimited IDE Access',
        '10 Hours Tutoring/Month',
        'Priority Support',
        'Certificate of Completion',
        'Unlimited Projects',
        'Advanced Workshops',
        'Career Guidance'
      ],
      notIncluded: [],
      popular: false,
      buttonText: 'Start Free Trial',
      buttonLink: '/signup'
    }
  ];

  const tutors = [
    {
      name: 'Dr. Sarah Chen',
      expertise: 'Python, Data Science, Machine Learning',
      experience: '10+ years',
      rating: 4.9,
      students: 500,
      image: '/api/placeholder/100/100'
    },
    {
      name: 'Prof. Michael Rodriguez',
      expertise: 'Python, Web Development, Algorithms',
      experience: '8+ years',
      rating: 4.8,
      students: 350,
      image: '/api/placeholder/100/100'
    },
    {
      name: 'Emily Johnson',
      expertise: 'Python, Automation, Testing',
      experience: '6+ years',
      rating: 4.9,
      students: 280,
      image: '/api/placeholder/100/100'
    }
  ];

  const handleBooking = (planId: string) => {
    setSelectedPlan(planId);
    // In a real app, this would open a booking modal or redirect to booking page
    alert('Booking system would open here. This is a demo - in production, you would be able to select a tutor, time slot, and payment method.');
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Learning Path
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From free basics to personalized tutoring, we have options for every learning style and budget
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${
                plan.popular ? 'ring-2 ring-blue-500 transform scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-1">/{plan.period}</span>
                  </div>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 opacity-50">
                      <X className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-500">{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.buttonLink === '#booking' ? (
                  <button
                    onClick={() => handleBooking(plan.id)}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                      plan.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                ) : (
                  <Link
                    to={plan.buttonLink}
                    className={`block w-full py-3 px-6 rounded-lg font-semibold text-center transition-colors ${
                      plan.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.buttonText}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tutoring Section */}
        <div className="bg-blue-50 rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our Expert Tutors
            </h2>
            <p className="text-xl text-gray-600">
              Learn from industry professionals with real-world experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tutors.map((tutor, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{tutor.name}</h3>
                    <p className="text-sm text-gray-600">{tutor.experience}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-700 mb-2">{tutor.expertise}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{tutor.rating}</span>
                    </div>
                    <div className="text-gray-600">
                      {tutor.students} students
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleBooking('tutoring')}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book Session
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Form (Demo) */}
        {selectedPlan === 'tutoring' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Book Your Python Tutoring Session</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Tutor
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Dr. Sarah Chen</option>
                  <option>Prof. Michael Rodriguez</option>
                  <option>Emily Johnson</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Duration
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>1 hour - $30</option>
                  <option>2 hours - $60</option>
                  <option>3 hours - $90</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Time
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>9:00 AM - 10:00 AM</option>
                  <option>10:00 AM - 11:00 AM</option>
                  <option>11:00 AM - 12:00 PM</option>
                  <option>2:00 PM - 3:00 PM</option>
                  <option>3:00 PM - 4:00 PM</option>
                  <option>4:00 PM - 5:00 PM</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What would you like to focus on?
              </label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., I need help with Python basics, data structures, or a specific project..."
              />
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-gray-600" />
                <span className="text-gray-600">Payment will be collected after confirmation</span>
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Confirm Booking
              </button>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-2">How does Python tutoring work?</h3>
              <p className="text-gray-600">
                Our tutoring sessions are one-on-one video calls where you can share your screen, 
                get real-time code review, and receive personalized guidance from expert Python developers.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-2">Can I reschedule my tutoring session?</h3>
              <p className="text-gray-600">
                Yes, you can reschedule up to 24 hours before your session with no penalty. 
                Late cancellations may incur a fee.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-2">Do you offer group discounts?</h3>
              <p className="text-gray-600">
                Yes! We offer discounts for groups of 3 or more students. Contact us for custom pricing.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-2">Is there a money-back guarantee?</h3>
              <p className="text-gray-600">
                We offer a 100% satisfaction guarantee. If you're not happy with your tutoring session, 
                we'll provide a full refund.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
