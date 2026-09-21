import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Courses } from './pages/Courses';
import { IDE } from './pages/IDE';
import { Pricing } from './pages/Pricing';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { Dashboard } from './pages/Dashboard';
import { PythonCourse } from './pages/PythonCourse';
import { MyClass } from './pages/MyClass';
import { Books } from './components/Books';
import './styles.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/python" element={<PythonCourse />} />
          <Route path="/my-class" element={<MyClass />} />
          <Route path="/books" element={<Books />} />
          <Route path="/ide" element={<IDE />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
