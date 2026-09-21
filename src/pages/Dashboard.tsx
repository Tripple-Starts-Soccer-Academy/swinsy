import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Code, Award, Clock, TrendingUp, Calendar, Play, CheckCircle, Lock, Star, Users } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [userProgress, setUserProgress] = useState({
    completedLessons: 12,
    totalLessons: 45,
    currentStreak: 5,
    totalHours: 8.5,
    certificates: 1,
    enrolledCourses: 2,
    currentLevel: 'Beginner'
  });

  const [studentStats, setStudentStats] = useState({
    totalStudents: 352,
    beginner: 180,
    intermediate: 120,
    advanced: 52
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'lesson', title: 'Completed: Python Functions', time: '2 hours ago', icon: CheckCircle, color: 'text-green-500' },
    { id: 2, type: 'exercise', title: 'Solved: List Comprehensions', time: '5 hours ago', icon: Code, color: 'text-blue-500' },
    { id: 3, type: 'achievement', title: 'Earned: 5-Day Streak', time: '1 day ago', icon: Award, color: 'text-purple-500' },
    { id: 4, type: 'session', title: 'Tutoring Session with Dr. Chen', time: '2 days ago', icon: Users, color: 'text-orange-500' }
  ]);

  const [courses] = useState([
    {
      id: 'python-basics',
      title: 'Python Basics',
      progress: 75,
      totalLessons: 8,
      completedLessons: 6,
      nextLesson: 'File I/O Operations',
      isLocked: false,
      lastAccessed: '2 hours ago'
    },
    {
      id: 'python-intermediate',
      title: 'Python Intermediate',
      progress: 25,
      totalLessons: 12,
      completedLessons: 3,
      nextLesson: 'Object-Oriented Programming',
      isLocked: false,
      lastAccessed: '1 day ago'
    },
    {
      id: 'python-advanced',
      title: 'Python Advanced',
      progress: 0,
      totalLessons: 16,
      completedLessons: 0,
      nextLesson: 'Metaclasses and Descriptors',
      isLocked: true,
      lastAccessed: 'Never'
    }
  ]);

  const [upcomingSessions, setUpcomingSessions] = useState([
    {
      id: 1,
      tutor: 'Dr. Sarah Chen',
      date: 'Tomorrow',
      time: '3:00 PM - 4:00 PM',
      topic: 'Data Structures Review',
      type: 'tutoring'
    },
    {
      id: 2,
      tutor: 'Prof. Michael Rodriguez',
      date: 'Friday',
      time: '2:00 PM - 3:00 PM',
      topic: 'Web Development with Flask',
      type: 'tutoring'
    }
  ]);

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      window.location.href = '/signin';
    }
  }, []);

  const userName = localStorage.getItem('userName') || 'Student';
  const userEmail = localStorage.getItem('userEmail') || '';

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userName}!
          </h1>
          <p className="text-gray-600">
            Continue your Python learning journey and track your progress
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 rounded-full p-3">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {userProgress.completedLessons}/{userProgress.totalLessons}
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium">Lessons Completed</h3>
            <div className="mt-2">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(userProgress.completedLessons / userProgress.totalLessons) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 rounded-full p-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{userProgress.currentStreak}</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium">Day Streak</h3>
            <p className="text-sm text-gray-500 mt-1">Keep it going!</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 rounded-full p-3">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{userProgress.totalHours}h</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium">Learning Time</h3>
            <p className="text-sm text-gray-500 mt-1">Total this month</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 rounded-full p-3">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{userProgress.certificates}</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium">Certificates</h3>
            <p className="text-sm text-gray-500 mt-1">Earned so far</p>
          </div>
        </div>

        {/* Student Completion Levels */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Student Completion Levels</h2>
            <p className="text-gray-600 text-sm mt-1">Total Students: {studentStats.totalStudents}</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Beginner</h3>
                  <span className="text-2xl font-bold text-green-600">{studentStats.beginner}</span>
                </div>
                <div className="bg-green-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${(studentStats.beginner / studentStats.totalStudents) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {Math.round((studentStats.beginner / studentStats.totalStudents) * 100)}% of students
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Intermediate</h3>
                  <span className="text-2xl font-bold text-blue-600">{studentStats.intermediate}</span>
                </div>
                <div className="bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(studentStats.intermediate / studentStats.totalStudents) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {Math.round((studentStats.intermediate / studentStats.totalStudents) * 100)}% of students
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Advanced</h3>
                  <span className="text-2xl font-bold text-purple-600">{studentStats.advanced}</span>
                </div>
                <div className="bg-purple-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${(studentStats.advanced / studentStats.totalStudents) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {Math.round((studentStats.advanced / studentStats.totalStudents) * 100)}% of students
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Learning */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Continue Learning</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {course.isLocked ? (
                            <Lock className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Play className="h-5 w-5 text-blue-600" />
                          )}
                          <div>
                            <h3 className="font-semibold text-gray-900">{course.title}</h3>
                            <p className="text-sm text-gray-500">Last accessed: {course.lastAccessed}</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {course.progress}% Complete
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                          {course.isLocked ? 'Enroll to unlock' : `Next: ${course.nextLesson}`}
                        </p>
                        {course.isLocked ? (
                          <Link
                            to="/pricing"
                            className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded hover:bg-gray-200 transition-colors"
                          >
                            Enroll Now
                          </Link>
                        ) : (
                          <Link
                            to={`/courses/python`}
                            className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                          >
                            Continue
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <div key={activity.id} className="flex items-center space-x-4">
                        <div className={`rounded-full p-2 bg-gray-50`}>
                          <Icon className={`h-5 w-5 ${activity.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">{activity.title}</p>
                          <p className="text-sm text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Upcoming Sessions */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Sessions</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {upcomingSessions.length > 0 ? (
                    upcomingSessions.map((session) => (
                      <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-gray-900">{session.date}</span>
                        </div>
                        <p className="text-sm text-gray-900 mb-1">{session.time}</p>
                        <p className="text-sm text-gray-600 mb-2">with {session.tutor}</p>
                        <p className="text-sm text-blue-600 font-medium">{session.topic}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No upcoming sessions</p>
                  )}
                </div>
                <Link
                  to="/pricing"
                  className="mt-4 block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book a Session
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-3">
                <Link
                  to="/ide"
                  className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Code className="h-5 w-5" />
                  <span>Open IDE</span>
                </Link>
                <Link
                  to="/courses"
                  className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <BookOpen className="h-5 w-5" />
                  <span>Browse Courses</span>
                </Link>
                <Link
                  to="/pricing"
                  className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Users className="h-5 w-5" />
                  <span>Book Tutoring</span>
                </Link>
              </div>
            </div>

            {/* Achievement Badge */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <Star className="h-8 w-8" />
                <div>
                  <h3 className="text-lg font-semibold">Python Learner</h3>
                  <p className="text-blue-100 text-sm">Level 2</p>
                </div>
              </div>
              <p className="text-sm text-blue-100 mb-4">
                You're making great progress! Complete 5 more lessons to reach Level 3.
              </p>
              <div className="bg-white bg-opacity-20 rounded-full h-2">
                <div className="bg-white h-2 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
