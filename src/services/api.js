/**
 * ==============================================================================
 * MOCK API & DATA LAYER
 * ==============================================================================
 */

export const STORAGE_KEYS = {
  USERS: 'lms_users_v2',
  COURSES: 'lms_courses_v2',
  ENROLLMENTS: 'lms_enrollments_v2',
  SUBMISSIONS: 'lms_submissions_v2',
  FEEDBACK: 'lms_feedback_v2', // New Key
  SESSION: 'lms_session_v2',
  THEME: 'lms_theme_v2'
};

const INITIAL_DATA = {
  users: [
    { id: 'u1', name: 'Admin User', email: 'admin@learn.hub', password: 'password', role: 'admin', bio: 'Senior Educator with 10 years experience.' },
    { id: 'u2', name: 'Jane Student', email: 'student@learn.hub', password: 'password', role: 'student', bio: 'Eager learner specializing in frontend.' }
  ],
  courses: [
    { 
      id: 'c1', 
      title: 'Advanced React Patterns', 
      description: 'Master hooks, context, and performance optimization.', 
      category: 'Development', 
      instructorId: 'u1',
      content: [
        { id: 'l1', title: 'Welcome & Setup', type: 'video', duration: '10:00', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }, 
        { id: 'l2', title: 'Understanding Hooks', type: 'text', body: 'Hooks let you use state and other React features without writing a class...' },
        { id: 'a1', title: 'Build a Custom Hook', type: 'assignment', description: 'Create a useFetch hook that handles loading and errors. Submit the GitHub Gist link.' }
      ]
    },
    { 
      id: 'c2', 
      title: 'UI/UX Fundamentals', 
      description: 'Learn color theory, typography, and layout design.', 
      category: 'Design', 
      instructorId: 'u1',
      content: [
        { id: 'l3', title: 'Color Theory', type: 'text', body: 'Color theory is a practical combination of art and science...' },
        { id: 'a2', title: 'Redesign a Login Page', type: 'assignment', description: 'Take a screenshot of a bad login page and redesign it using Figma.' }
      ]
    }
  ],
  enrollments: [], 
  submissions: [],
  feedback: [] // New initial data
};

export const initializeDB = () => {
  let users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  let dataChanged = false;

  if (users.length > 0) {
    users = users.map(user => {
      if (user.email && user.email.includes('@edu.com')) {
        const newEmail = user.email.replace('@edu.com', '@learn.hub');
        dataChanged = true;
        return { ...user, email: newEmail };
      }
      return user;
    });
  }

  if (users.length === 0) {
    users = INITIAL_DATA.users;
    dataChanged = true;
    
    if (!localStorage.getItem(STORAGE_KEYS.COURSES)) localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(INITIAL_DATA.courses));
    if (!localStorage.getItem(STORAGE_KEYS.ENROLLMENTS)) localStorage.setItem(STORAGE_KEYS.ENROLLMENTS, JSON.stringify(INITIAL_DATA.enrollments));
    if (!localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)) localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(INITIAL_DATA.submissions));
    if (!localStorage.getItem(STORAGE_KEYS.FEEDBACK)) localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(INITIAL_DATA.feedback));
  }

  if (dataChanged) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const safeGet = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
};

export const api = {
  // --- Auth & Users ---
  login: async (email, password) => {
    await delay(500);
    if (!email.endsWith('@learn.hub')) throw new Error('Access Restricted: Only @learn.hub emails are allowed.');
    const users = safeGet(STORAGE_KEYS.USERS);
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid credentials');
    const token = btoa(user.id); 
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({ user, token }));
    return user;
  },
  
  register: async (name, email, password, role = 'student') => {
    await delay(500);
    if (!email.endsWith('@learn.hub')) throw new Error('Registration Restricted: Only @learn.hub emails are allowed.');
    if (!/^[a-zA-Z\s]+$/.test(name)) throw new Error('Invalid Name: Only letters and spaces are allowed.');
    const users = safeGet(STORAGE_KEYS.USERS);
    if (users.find(u => u.email === email)) throw new Error('Email already exists');
    const newUser = { id: Date.now().toString(), name, email, password, role, bio: '' };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return newUser;
  },

  logout: async () => {
    await delay(200);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  },

  getSession: () => {
    try {
      const session = localStorage.getItem(STORAGE_KEYS.SESSION);
      return session ? JSON.parse(session).user : null;
    } catch { return null; }
  },

  updateProfile: async (userId, updates) => {
    await delay(400);
    const users = safeGet(STORAGE_KEYS.USERS);
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      const session = safeGet(STORAGE_KEYS.SESSION); 
      if (session && session.user.id === userId) {
         session.user = users[idx];
         localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
      }
      return users[idx];
    }
    throw new Error("User not found");
  },

  getAllUsers: async () => {
    await delay(400);
    return safeGet(STORAGE_KEYS.USERS);
  },

  // --- Courses & Content ---
  getCourses: async () => {
    await delay(300);
    return safeGet(STORAGE_KEYS.COURSES);
  },

  getCourse: async (id) => {
    await delay(300);
    const courses = safeGet(STORAGE_KEYS.COURSES);
    return courses.find(c => String(c.id) === String(id));
  },

  createCourse: async (courseData) => {
    await delay(400);
    const courses = safeGet(STORAGE_KEYS.COURSES);
    const newCourse = { ...courseData, id: Date.now().toString(), content: [] };
    courses.push(newCourse);
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    return newCourse;
  },

  deleteCourse: async (id) => {
    await delay(400);
    const courses = safeGet(STORAGE_KEYS.COURSES);
    const newCourses = courses.filter(c => String(c.id) !== String(id));
    if (newCourses.length === courses.length) console.warn("Course ID not found for deletion");
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(newCourses));
  },

  addCourseContent: async (courseId, contentItem) => {
    await delay(300);
    const courses = safeGet(STORAGE_KEYS.COURSES);
    const idx = courses.findIndex(c => String(c.id) === String(courseId));
    if (idx === -1) throw new Error('Course not found');
    
    if (!courses[idx].content) courses[idx].content = [];
    const newItem = { ...contentItem, id: Date.now().toString() };
    courses[idx].content.push(newItem);
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    return newItem;
  },

  deleteCourseContent: async (courseId, contentId) => {
    await delay(300);
    const courses = safeGet(STORAGE_KEYS.COURSES);
    const newCourses = courses.map(course => {
      if (String(course.id) === String(courseId)) {
        return {
          ...course,
          content: (course.content || []).filter(item => String(item.id) !== String(contentId))
        };
      }
      return course;
    });
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(newCourses));
  },

  // --- Enrollment & Progress ---
  enroll: async (userId, courseId) => {
    await delay(400);
    const enrollments = safeGet(STORAGE_KEYS.ENROLLMENTS);
    if (enrollments.find(e => e.userId === userId && e.courseId === courseId)) throw new Error('Already enrolled');
    const newEnrollment = { id: Date.now().toString(), userId, courseId, progress: 0, completedItems: [] };
    enrollments.push(newEnrollment);
    localStorage.setItem(STORAGE_KEYS.ENROLLMENTS, JSON.stringify(enrollments));
  },

  getStudentEnrollments: async (userId) => {
    await delay(300);
    const enrollments = safeGet(STORAGE_KEYS.ENROLLMENTS);
    const courses = safeGet(STORAGE_KEYS.COURSES);
    return enrollments
      .filter(e => e.userId === userId)
      .map(e => ({ ...e, course: courses.find(c => String(c.id) === String(e.courseId)) }))
      .filter(e => e.course);
  },

  updateProgress: async (userId, courseId, itemId) => {
    const enrollments = safeGet(STORAGE_KEYS.ENROLLMENTS);
    const idx = enrollments.findIndex(e => e.userId === userId && String(e.courseId) === String(courseId));
    if (idx === -1) return;

    if (!enrollments[idx].completedItems.includes(itemId)) {
      enrollments[idx].completedItems.push(itemId);
      const courses = safeGet(STORAGE_KEYS.COURSES);
      const course = courses.find(c => String(c.id) === String(courseId));
      const total = course?.content?.length || 1; 
      enrollments[idx].progress = Math.round((enrollments[idx].completedItems.length / total) * 100);
      localStorage.setItem(STORAGE_KEYS.ENROLLMENTS, JSON.stringify(enrollments));
    }
    return enrollments[idx];
  },

  // --- Submissions ---
  submitAssignment: async (userId, assignmentId, content) => {
    await delay(400);
    const submissions = safeGet(STORAGE_KEYS.SUBMISSIONS);
    const filteredSubs = submissions.filter(s => !(s.userId === userId && s.assignmentId === assignmentId));
    const newSub = { id: Date.now().toString(), userId, assignmentId, content, grade: null, feedback: '', date: new Date().toISOString() };
    filteredSubs.push(newSub);
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(filteredSubs));
    return newSub;
  },

  getSubmissionsForCourse: async (courseId) => {
    await delay(400);
    const submissions = safeGet(STORAGE_KEYS.SUBMISSIONS);
    const courses = safeGet(STORAGE_KEYS.COURSES);
    const users = safeGet(STORAGE_KEYS.USERS);
    const course = courses.find(c => String(c.id) === String(courseId));
    if (!course) return [];
    
    const assignmentIds = (course.content || []).filter(i => i.type === 'assignment').map(i => i.id);
    return submissions
      .filter(s => assignmentIds.includes(s.assignmentId))
      .map(s => ({
        ...s,
        student: users.find(u => u.id === s.userId),
        assignmentTitle: course.content.find(i => i.id === s.assignmentId)?.title || 'Deleted Assignment'
      }));
  },

  getMySubmissions: async (userId) => {
    await delay(300);
    const submissions = safeGet(STORAGE_KEYS.SUBMISSIONS);
    return submissions.filter(s => s.userId === userId);
  },

  gradeSubmission: async (submissionId, grade, feedback) => {
    await delay(300);
    const submissions = safeGet(STORAGE_KEYS.SUBMISSIONS);
    const idx = submissions.findIndex(s => s.id === submissionId);
    if(idx !== -1) {
        submissions[idx] = { ...submissions[idx], grade, feedback };
        localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
        return submissions[idx];
    }
  },

  // --- Feedback ---
  submitFeedback: async (courseId, userId, rating, comment) => {
    await delay(400);
    const feedbackList = safeGet(STORAGE_KEYS.FEEDBACK);
    // Check if user already reviewed this course
    const existing = feedbackList.findIndex(f => String(f.courseId) === String(courseId) && f.userId === userId);
    const newEntry = { id: Date.now().toString(), courseId, userId, rating, comment, date: new Date().toISOString() };
    
    if (existing !== -1) {
      feedbackList[existing] = newEntry; // Update existing review
    } else {
      feedbackList.push(newEntry);
    }
    
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(feedbackList));
    return newEntry;
  },

  getCourseFeedback: async (courseId) => {
    await delay(300);
    const feedbackList = safeGet(STORAGE_KEYS.FEEDBACK);
    return feedbackList.filter(f => String(f.courseId) === String(courseId));
  },

  getStats: async () => {
    await delay(300);
    const users = safeGet(STORAGE_KEYS.USERS);
    const courses = safeGet(STORAGE_KEYS.COURSES);
    const enrollments = safeGet(STORAGE_KEYS.ENROLLMENTS);
    return {
      totalStudents: users.filter(u => u.role === 'student').length,
      totalCourses: courses.length,
      activeEnrollments: enrollments.length
    };
  }
};