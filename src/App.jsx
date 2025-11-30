import React, { useState, useEffect, useContext } from 'react';
import { Loader2 } from 'lucide-react';
import Navbar from './components/Navbar.jsx';
import { Login, Register } from './pages/AuthPages.jsx';
import { Dashboard, StudentBrowse, Classroom } from './pages/StudentPages.jsx';
import { AdminCourses, AdminStudents, AdminCourseEditor, AdminSubmissions, AdminFeedback } from './pages/AdminPages.jsx';
import UserProfile from './pages/UserProfile.jsx';
import { AuthProvider, ThemeProvider, ToastProvider, AuthContext } from './context/Contexts.jsx';

// --- App Controller (Router) ---
const AppContent = () => {
  const { user, loading } = useContext(AuthContext);
  const [route, setRoute] = useState('login'); 

  useEffect(() => { 
    if (!loading) setRoute(user ? 'dashboard' : 'login'); 
  }, [loading, user]);

  const navigate = (path) => { 
    window.scrollTo(0,0); 
    setRoute(path); 
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"><Loader2 className="animate-spin" /></div>;

  let view;
  if (!user) {
    if (route === 'register') view = <Register onNavigate={navigate} />;
    else view = <Login onNavigate={navigate} />;
  } else {
    if (route.startsWith('classroom/')) view = <Classroom courseId={route.split('/')[1]} onNavigate={navigate} />;
    else if (route.startsWith('admin-course-edit/')) view = <AdminCourseEditor courseId={route.split('/')[1]} onNavigate={navigate} />;
    else if (route.startsWith('admin-course-submissions/')) view = <AdminSubmissions courseId={route.split('/')[1]} onNavigate={navigate} />;
    else if (route.startsWith('admin-course-feedback/')) view = <AdminFeedback courseId={route.split('/')[1]} onNavigate={navigate} />;
    else {
      switch(route) {
        case 'dashboard': view = <Dashboard onNavigate={navigate} />; break;
        case 'profile': view = <UserProfile />; break;
        case 'admin-courses': view = user.role === 'admin' ? <AdminCourses onNavigate={navigate} /> : <Dashboard onNavigate={navigate} />; break;
        // UPDATED: Passed onNavigate prop here
        case 'admin-students': view = user.role === 'admin' ? <AdminStudents onNavigate={navigate} /> : <Dashboard onNavigate={navigate} />; break;
        case 'student-browse': view = <StudentBrowse onNavigate={navigate} />; break;
        default: view = <Dashboard onNavigate={navigate} />;
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-200">
      <Navbar onNavigate={navigate} />
      <main className="animate-fade-in">{view}</main>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}