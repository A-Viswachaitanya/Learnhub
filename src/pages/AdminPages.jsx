import React, { useState, useEffect, useContext } from 'react';
import { Plus, Trash2, Edit, ClipboardList, PenTool, ArrowLeft, Loader2, FileText, UploadCloud, BarChart2, MessageSquare, Download } from 'lucide-react';
import { api } from '../services/api.js';
import { AuthContext, ToastContext } from '../context/Contexts.jsx';
import { Button, Input, Card, Badge, ConfirmModal, SimpleBarChart } from '../components/UI.jsx';

export const AdminStudents = ({ onNavigate }) => {
  const [students, setStudents] = useState([]);
  useEffect(() => { api.getAllUsers().then(users => setStudents(users.filter(u => u.role === 'student'))); }, []);
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* UPDATED: Added Back Button */}
      <Button variant="ghost" onClick={() => onNavigate('dashboard')} className="mb-4 pl-0">
        <ArrowLeft size={16} /> Back to Dashboard
      </Button>
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Student Management</h1>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Bio</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {students.map(s => (
                <tr key={s.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{s.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{s.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{s.bio || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export const AdminCourses = ({ onNavigate }) => {
  const [courses, setCourses] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', description: '', category: '' });
  const { addToast } = useContext(ToastContext);
  const { user } = useContext(AuthContext);
  const [deleteModal, setDeleteModal] = useState({ open: false, courseId: null });
  const [deleting, setDeleting] = useState(false);

  const refreshCourses = () => { api.getCourses().then(setCourses); };
  useEffect(() => { refreshCourses(); }, []);

  const handleCreateCourse = async () => {
    if(!newCourse.title || !newCourse.description) return;
    await api.createCourse({ ...newCourse, instructorId: user.id });
    addToast('Course created');
    setShowCreateModal(false);
    setNewCourse({ title: '', description: '', category: '' });
    refreshCourses();
  };

  const openDeleteModal = (e, id) => {
    e.stopPropagation();
    setDeleteModal({ open: true, courseId: id });
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.deleteCourse(deleteModal.courseId);
      addToast('Course deleted');
      refreshCourses(); 
      setDeleteModal({ open: false, courseId: null });
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* UPDATED: Added Back Button */}
      <Button variant="ghost" onClick={() => onNavigate('dashboard')} className="mb-4 pl-0">
        <ArrowLeft size={16} /> Back to Dashboard
      </Button>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Courses</h1>
        <Button onClick={() => setShowCreateModal(true)}><Plus size={18} /> Create Course</Button>
      </div>

      <div className="grid gap-6">
        {courses.map(course => (
          <Card key={course.id} className="p-6">
             <div className="flex flex-col md:flex-row justify-between items-start gap-4">
               <div className="flex-1">
                 <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{course.title}</h3>
                    <Badge>{course.category}</Badge>
                 </div>
                 <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{course.description}</p>
                 <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><FileText size={14}/> {course.content ? course.content.length : 0} Items</span>
                 </div>
               </div>
               
               <div className="flex flex-wrap gap-2 w-full md:w-auto mt-2 md:mt-0">
                 <Button variant="secondary" className="flex-1 md:flex-none" onClick={() => onNavigate(`admin-course-edit/${course.id}`)}>
                   <PenTool size={16} /> Edit
                 </Button>
                 <Button variant="secondary" className="flex-1 md:flex-none" onClick={() => onNavigate(`admin-course-submissions/${course.id}`)}>
                   <ClipboardList size={16} /> Subs
                 </Button>
                 <Button variant="secondary" className="flex-1 md:flex-none" onClick={() => onNavigate(`admin-course-feedback/${course.id}`)}>
                   <BarChart2 size={16} /> Reviews
                 </Button>
                 <Button variant="danger" className="md:flex-none" onClick={(e) => openDeleteModal(e, course.id)}>
                   <Trash2 size={16} />
                 </Button>
               </div>
             </div>
          </Card>
        ))}
      </div>

      <ConfirmModal 
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, courseId: null })}
        onConfirm={confirmDelete}
        title="Delete Course?"
        message="Are you sure you want to delete this course?"
        loading={deleting}
      />

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg w-11/12 p-6">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Create New Course</h2>
            <Input label="Title" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} required />
            <Input label="Category" value={newCourse.category} onChange={e => setNewCourse({...newCourse, category: e.target.value})} />
            <Input multiline label="Description" value={newCourse.description} onChange={e => setNewCourse({...newCourse, description: e.target.value})} required />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              <Button onClick={handleCreateCourse}>Create</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export const AdminCourseEditor = ({ courseId, onNavigate }) => {
  const { addToast } = useContext(ToastContext);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', type: 'video', url: '', body: '', description: '', duration: '' });
  const [deleteModal, setDeleteModal] = useState({ open: false, itemId: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.getCourse(courseId).then(data => { setCourse(data); setLoading(false); });
  }, [courseId]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 200 * 1024) { 
        addToast("File too large for demo (Limit: 200KB).", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => { setNewItem({ ...newItem, url: reader.result }); };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.title) { addToast('Title is required', 'error'); return; }
    await api.addCourseContent(courseId, newItem);
    addToast('Item added');
    setCourse(await api.getCourse(courseId)); 
    setShowAddModal(false);
    setNewItem({ title: '', type: 'video', url: '', body: '', description: '', duration: '' });
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.deleteCourseContent(courseId, deleteModal.itemId);
      addToast('Item deleted');
      setCourse(await api.getCourse(courseId));
      setDeleteModal({ open: false, itemId: null });
    } catch(e) { addToast(e.message, 'error'); } finally { setDeleting(false); }
  };

  const openDeleteModal = (e, itemId) => {
    e.stopPropagation();
    setDeleteModal({ open: true, itemId });
  };

  if(loading) return <div className="p-8 text-center"><Loader2 className="animate-spin inline" /></div>;
  if(!course) return <div className="p-8">Course not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => onNavigate('admin-courses')} className="mb-4 pl-0">
        <ArrowLeft size={16} /> Back to Courses
      </Button>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Content</h1>
          <p className="text-gray-500">{course.title}</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}><Plus size={18} /> Add Content</Button>
      </div>

      <div className="space-y-4">
        {(!course.content || course.content.length === 0) ? (
          <div className="text-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <p className="text-gray-500">No content yet.</p>
          </div>
        ) : (
          course.content.map((item, idx) => (
            <Card key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
               <div className="flex items-center gap-4 w-full sm:w-auto">
                 <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-500 shrink-0">{idx + 1}</div>
                 <div className="flex-1 min-w-0">
                   <div className="flex items-center gap-2 flex-wrap">
                     <h3 className="font-bold text-gray-900 dark:text-white truncate">{item.title}</h3>
                     <Badge color={item.type === 'video' ? 'blue' : (item.type === 'assignment' ? 'purple' : (item.type === 'pdf' ? 'red' : 'green'))}>{item.type}</Badge>
                   </div>
                   <p className="text-xs text-gray-500 truncate max-w-xs sm:max-w-md">{item.type === 'video' ? item.url : (item.type === 'text' ? (item.body ? item.body.substring(0, 50) + '...' : '') : item.description)}</p>
                 </div>
               </div>
               <div className="flex justify-end w-full sm:w-auto">
                 <Button variant="ghost" className="text-red-500 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); setDeleteModal({ open: true, itemId: item.id }); }}>
                   <Trash2 size={18} />
                 </Button>
               </div>
            </Card>
          ))
        )}
      </div>

      <ConfirmModal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, itemId: null })} onConfirm={confirmDelete} title="Delete Content?" message="Are you sure?" loading={deleting} />

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg w-11/12 p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Add New Content</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <select className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={newItem.type} onChange={e => setNewItem({...newItem, type: e.target.value, url: ''})}>
                <option value="video">Video Lesson</option>
                <option value="text">Text Lesson</option>
                <option value="assignment">Assignment</option>
                <option value="pdf">PDF Resource</option>
              </select>
            </div>
            <Input label="Title" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} />
            {newItem.type === 'video' && <><Input label="Video Embed URL" value={newItem.url} onChange={e => setNewItem({...newItem, url: e.target.value})} /><Input label="Duration" value={newItem.duration} onChange={e => setNewItem({...newItem, duration: e.target.value})} /></>}
            {newItem.type === 'text' && <Input multiline label="Lesson Content" value={newItem.body} onChange={e => setNewItem({...newItem, body: e.target.value})} />}
            {newItem.type === 'assignment' && <Input multiline label="Instructions" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} />}
            {newItem.type === 'pdf' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upload PDF</label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-4 text-center">
                  <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" id="pdf-upload" />
                  <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-blue-500">
                    <UploadCloud size={32} />
                    <span className="text-sm">Click to upload PDF (Max 200KB)</span>
                  </label>
                  {newItem.url && <p className="text-xs text-green-600 mt-2 font-medium">File Loaded!</p>}
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2 mt-6"><Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button><Button onClick={handleAddItem}>Add Item</Button></div>
          </Card>
        </div>
      )}
    </div>
  );
};

export const AdminFeedback = ({ courseId, onNavigate }) => {
  const [course, setCourse] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [stats, setStats] = useState({ data: {}, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const c = await api.getCourse(courseId);
      const f = await api.getCourseFeedback(courseId);
      setCourse(c);
      setFeedbackList(f);
      
      const s = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      f.forEach(item => { if(s[item.rating] !== undefined) s[item.rating]++; });
      setStats({ data: s, total: f.length });
      setLoading(false);
    };
    load();
  }, [courseId]);

  if(loading) return <div className="p-8 text-center"><Loader2 className="animate-spin inline" /></div>;
  if(!course) return <div className="p-8">Course not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => onNavigate('admin-courses')} className="mb-4 pl-0">
        <ArrowLeft size={16} /> Back to Courses
      </Button>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Stats */}
        <div className="md:col-span-1">
          <Card className="p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Overall Rating</h2>
            <div className="text-4xl font-bold text-center mb-6 text-gray-900 dark:text-white">
              {stats.total > 0 ? (feedbackList.reduce((acc, curr) => acc + curr.rating, 0) / stats.total).toFixed(1) : '0.0'}
              <span className="text-sm text-gray-400 font-normal ml-1">/ 5</span>
            </div>
            <SimpleBarChart data={stats.data} total={stats.total} />
            <div className="mt-4 text-center text-sm text-gray-500">{stats.total} total reviews</div>
          </Card>
        </div>

        {/* Right Column: Comments List */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Student Reviews</h2>
          {feedbackList.length === 0 ? (
            <div className="text-center p-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-500">No reviews yet.</p>
            </div>
          ) : (
            feedbackList.map(item => (
              <Card key={item.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge color={item.rating >= 4 ? 'green' : (item.rating >= 3 ? 'yellow' : 'red')}>
                    {item.rating} Stars
                  </Badge>
                  <span className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm">{item.comment}</p>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export const AdminSubmissions = ({ courseId, onNavigate }) => {
  const { addToast } = useContext(ToastContext);
  const [course, setCourse] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gradingState, setGradingState] = useState({});
  const [editingGradeId, setEditingGradeId] = useState(null);

  useEffect(() => {
    const load = async () => {
      const c = await api.getCourse(courseId);
      const s = await api.getSubmissionsForCourse(courseId);
      setCourse(c);
      setSubmissions(s);
      
      const initialGrading = {};
      s.forEach(sub => { initialGrading[sub.id] = { score: sub.grade || '', feedback: sub.feedback || '' }; });
      setGradingState(initialGrading);
      setLoading(false);
    };
    load();
  }, [courseId]);

  const saveGrade = async (subId) => {
    const { score, feedback } = gradingState[subId];
    if (score === '' || isNaN(score) || score < 0 || score > 100) { addToast('Invalid score', 'error'); return; }
    await api.gradeSubmission(subId, score, feedback);
    setSubmissions(prev => prev.map(s => s.id === subId ? { ...s, grade: score, feedback } : s));
    setEditingGradeId(null);
    addToast('Grade saved');
  };

  const handleGradeChange = (subId, field, value) => {
    setGradingState(prev => ({ ...prev, [subId]: { ...prev[subId], [field]: value } }));
  };

  if(loading) return <div className="p-8 text-center"><Loader2 className="animate-spin inline" /></div>;
  if(!course) return <div className="p-8">Course not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => onNavigate('admin-courses')} className="mb-4 pl-0">
        <ArrowLeft size={16} /> Back to Courses
      </Button>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Submissions: {course.title}</h1>
      
      {submissions.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <ClipboardList className="mx-auto h-12 w-12 text-gray-400 mb-2" />
          <p className="text-gray-500">No submissions yet for this course.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {submissions.map(sub => {
             const isGraded = sub.grade !== null && sub.grade !== undefined;
             const isEditing = editingGradeId === sub.id;

             return (
               <Card key={sub.id} className="p-5 border-l-4 border-l-blue-500">
                 <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                   <div>
                     <h3 className="font-bold text-lg text-gray-900 dark:text-white">{sub.student?.name}</h3>
                     <div className="flex items-center gap-2 mt-1">
                       <Badge color="purple">{sub.assignmentTitle}</Badge>
                       <span className="text-xs text-gray-400">{new Date(sub.date).toLocaleDateString()}</span>
                     </div>
                   </div>
                   {isGraded && !isEditing && (
                     <div className="text-left sm:text-right w-full sm:w-auto mt-2 sm:mt-0">
                       <div className="text-2xl font-bold text-gray-900 dark:text-white">{sub.grade}<span className="text-sm text-gray-500 font-normal">/100</span></div>
                       <Button variant="ghost" size="sm" onClick={() => setEditingGradeId(sub.id)} className="text-xs h-6 px-2"><Edit size={12} className="mr-1"/> Edit</Button>
                     </div>
                   )}
                 </div>

                 <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded mb-4 border dark:border-gray-700">
                   {/* ADDED: Check if content is Base64 PDF and show download link */}
                   {sub.content && sub.content.startsWith('data:application/pdf') ? (
                     <a href={sub.content} download={`submission-${sub.student?.name}.pdf`} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                       <Download size={18} /> Download Submission PDF
                     </a>
                   ) : (
                     <p className="font-mono text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{sub.content}</p>
                   )}
                 </div>

                 {(!isGraded || isEditing) && (
                   <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-blue-50 dark:bg-blue-900/10 p-4 rounded">
                     <div className="w-full sm:w-24">
                        <label className="text-xs font-bold text-gray-500 mb-1 block">Score</label>
                        <input type="number" min="0" max="100" className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white" value={gradingState[sub.id]?.score || ''} onChange={(e) => handleGradeChange(sub.id, 'score', e.target.value)} />
                     </div>
                     <div className="flex-1 w-full">
                        <label className="text-xs font-bold text-gray-500 mb-1 block">Feedback</label>
                        <input type="text" className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white" value={gradingState[sub.id]?.feedback || ''} onChange={(e) => handleGradeChange(sub.id, 'feedback', e.target.value)} placeholder="Great job, but..." />
                     </div>
                     <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                       {isEditing && <Button variant="ghost" onClick={() => setEditingGradeId(null)}>Cancel</Button>}
                       <Button onClick={() => saveGrade(sub.id)} className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"><Save size={16} /> Save</Button>
                     </div>
                   </div>
                 )}
                 {isGraded && !isEditing && sub.feedback && (
                   <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 italic">" {sub.feedback} "</div>
                 )}
               </Card>
             );
          })}
        </div>
      )}
    </div>
  );
};