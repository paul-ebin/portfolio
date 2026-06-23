import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile'); // Default to profile now
  
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  
  // Form States
  const [profileForm, setProfileForm] = useState({ name: '', title: '', subtitle: '', description: '', aboutText: '', email: '', github: '', linkedin: '' });
  const [profileFile, setProfileFile] = useState(null);

  const [projectForm, setProjectForm] = useState({ title: '', description: '', techStack: '', githubLink: '', liveLink: '', order: 0 });
  const [projectImage, setProjectImage] = useState(null);

  const [skillForm, setSkillForm] = useState({ name: '', category: 'Frontend' });
  const [skillIcon, setSkillIcon] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Setup Axios interceptor
  useEffect(() => {
    if (user?.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  const fetchData = async () => {
    try {
      const [profRes, pRes, sRes] = await Promise.all([
        axios.get('/api/profile'),
        axios.get('/api/projects'), 
        axios.get('/api/skills')
      ]);
      setProfile(profRes.data);
      setProfileForm({
        name: profRes.data.name || '',
        title: profRes.data.title || '',
        subtitle: profRes.data.subtitle || '',
        description: profRes.data.description || '',
        aboutText: profRes.data.aboutText || '',
        email: profRes.data.email || '',
        github: profRes.data.github || '',
        linkedin: profRes.data.linkedin || ''
      });
      setProjects(pRes.data);
      setSkills(sRes.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  // Handle Profile Update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.keys(profileForm).forEach(key => formData.append(key, profileForm[key]));
      if (profileFile) formData.append('file', profileFile); // The backend uses 'file' for both image and pdf

      await axios.put('/api/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert('Profile updated successfully!');
      setProfileFile(null);
      fetchData();
    } catch (error) {
      alert('Error updating profile: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Project Submit
  const handleAddProject = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.keys(projectForm).forEach(key => formData.append(key, projectForm[key]));
      if (projectImage) formData.append('image', projectImage);

      await axios.post('/api/projects', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setProjectForm({ title: '', description: '', techStack: '', githubLink: '', liveLink: '', order: 0 });
      setProjectImage(null);
      e.target.reset();
      fetchData();
    } catch (error) {
      alert('Error adding project: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Skill Submit
  const handleAddSkill = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', skillForm.name);
      formData.append('category', skillForm.category);
      if (skillIcon) formData.append('icon', skillIcon);

      await axios.post('/api/skills', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setSkillForm({ name: '', category: 'Frontend' });
      setSkillIcon(null);
      e.target.reset();
      fetchData();
    } catch (error) {
      alert('Error adding skill: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if(window.confirm('Delete this project?')) {
      await axios.delete(`/api/projects/${id}`);
      fetchData();
    }
  };

  const handleDeleteSkill = async (id) => {
    if(window.confirm('Delete this skill?')) {
      await axios.delete(`/api/skills/${id}`);
      fetchData();
    }
  };

  if (loading || !user) return <div className="min-h-screen pt-20 text-center text-white">Loading...</div>;

  return (
    <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 text-white">
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <button onClick={() => { logout(); navigate('/'); }} className="px-4 py-2 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors">
          Logout
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="glass p-4 rounded-2xl flex flex-col space-y-2 h-fit border-white/10">
          <button onClick={() => setActiveTab('profile')} className={`text-left px-4 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'profile' ? 'bg-electric-blue/20 text-electric-blue' : 'text-gray-400 hover:bg-white/5'}`}>
            Edit Profile
          </button>
          <button onClick={() => setActiveTab('projects')} className={`text-left px-4 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'projects' ? 'bg-purple/20 text-purple' : 'text-gray-400 hover:bg-white/5'}`}>
            Manage Projects
          </button>
          <button onClick={() => setActiveTab('skills')} className={`text-left px-4 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'skills' ? 'bg-neon-violet/20 text-neon-violet' : 'text-gray-400 hover:bg-white/5'}`}>
            Manage Skills
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">

          {/* Profile Tab */}
          {activeTab === 'profile' && profile && (
             <div className="glass p-6 rounded-2xl border-white/10">
               <h2 className="text-2xl font-bold mb-6 text-electric-blue">Edit Profile Details</h2>
               <form onSubmit={handleUpdateProfile} className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                     <input type="text" required value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-electric-blue" />
                   </div>
                   <div>
                     <label className="block text-sm text-gray-400 mb-1">Subtitle (e.g. Computer Science Engineer)</label>
                     <input type="text" required value={profileForm.subtitle} onChange={e => setProfileForm({...profileForm, subtitle: e.target.value})} className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-electric-blue" />
                   </div>
                   <div className="md:col-span-2">
                     <label className="block text-sm text-gray-400 mb-1">Main Title (e.g. Full Stack Developer)</label>
                     <input type="text" required value={profileForm.title} onChange={e => setProfileForm({...profileForm, title: e.target.value})} className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-electric-blue" />
                   </div>
                 </div>
                 
                 <div>
                   <label className="block text-sm text-gray-400 mb-1">Hero Description (Short intro)</label>
                   <textarea rows="2" required value={profileForm.description} onChange={e => setProfileForm({...profileForm, description: e.target.value})} className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-electric-blue"></textarea>
                 </div>

                 <div>
                   <label className="block text-sm text-gray-400 mb-1">About Me Paragraph (Detailed)</label>
                   <textarea rows="4" required value={profileForm.aboutText} onChange={e => setProfileForm({...profileForm, aboutText: e.target.value})} className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-electric-blue"></textarea>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div>
                     <label className="block text-sm text-gray-400 mb-1">Email</label>
                     <input type="email" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-electric-blue" />
                   </div>
                   <div>
                     <label className="block text-sm text-gray-400 mb-1">GitHub URL</label>
                     <input type="url" value={profileForm.github} onChange={e => setProfileForm({...profileForm, github: e.target.value})} className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-electric-blue" />
                   </div>
                   <div>
                     <label className="block text-sm text-gray-400 mb-1">LinkedIn URL</label>
                     <input type="url" value={profileForm.linkedin} onChange={e => setProfileForm({...profileForm, linkedin: e.target.value})} className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-electric-blue" />
                   </div>
                 </div>

                 <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                   <label className="block text-sm text-gray-400 mb-2">Upload Profile Picture (Image) OR Resume (PDF)</label>
                   <p className="text-xs text-gray-500 mb-3">Note: Backend handles both through the same field depending on the file type.</p>
                   <input type="file" accept="image/*,.pdf" onChange={e => setProfileFile(e.target.files[0])} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-electric-blue/20 file:text-electric-blue hover:file:bg-electric-blue/30" />
                 </div>

                 <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-electric-blue text-dark-bg font-bold rounded-lg hover:bg-electric-blue/80 transition-colors disabled:opacity-50">
                   {isSubmitting ? 'Saving...' : 'Save Profile Changes'}
                 </button>
               </form>
             </div>
          )}
          
          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-8">
              {/* Add Form */}
              <div className="glass p-6 rounded-2xl border-white/10">
                <h2 className="text-2xl font-bold mb-6 text-purple">Add New Project</h2>
                <form onSubmit={handleAddProject} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Project Title" required value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-purple" />
                    <input type="text" placeholder="Tech Stack (comma separated)" value={projectForm.techStack} onChange={e => setProjectForm({...projectForm, techStack: e.target.value})} className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-purple" />
                    <input type="url" placeholder="GitHub URL" value={projectForm.githubLink} onChange={e => setProjectForm({...projectForm, githubLink: e.target.value})} className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-purple" />
                    <input type="url" placeholder="Live Demo URL" value={projectForm.liveLink} onChange={e => setProjectForm({...projectForm, liveLink: e.target.value})} className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-purple" />
                  </div>
                  <textarea placeholder="Description" required rows="3" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-purple"></textarea>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Project Image</label>
                    <input type="file" required accept="image/*" onChange={e => setProjectImage(e.target.files[0])} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple/20 file:text-purple hover:file:bg-purple/30" />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-purple text-white font-bold rounded-lg hover:bg-purple/80 transition-colors disabled:opacity-50">
                    {isSubmitting ? 'Uploading...' : 'Add Project'}
                  </button>
                </form>
              </div>

              {/* List */}
              <div className="glass p-6 rounded-2xl border-white/10">
                <h2 className="text-xl font-bold mb-4">Existing Projects ({projects.length})</h2>
                <div className="space-y-3">
                  {projects.map(p => (
                    <div key={p._id} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                      <div className="flex items-center gap-4">
                        {p.image && <img src={p.image} className="w-16 h-12 object-cover rounded-md" />}
                        <div>
                          <h4 className="font-bold">{p.title}</h4>
                          <p className="text-xs text-gray-400">{p.techStack.join(', ')}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteProject(p._id)} className="text-red-400 hover:text-red-300 px-3 py-1 bg-red-400/10 rounded-md transition-colors">Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className="space-y-8">
              <div className="glass p-6 rounded-2xl border-white/10">
                <h2 className="text-2xl font-bold mb-6 text-neon-violet">Add New Skill</h2>
                <form onSubmit={handleAddSkill} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Skill Name (e.g. React.js)" required value={skillForm.name} onChange={e => setSkillForm({...skillForm, name: e.target.value})} className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-violet" />
                    <select value={skillForm.category} onChange={e => setSkillForm({...skillForm, category: e.target.value})} className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-violet text-white">
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Database">Database</option>
                      <option value="Tools & Others">Tools & Others</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Skill Icon (Optional Image/SVG)</label>
                    <input type="file" accept="image/*" onChange={e => setSkillIcon(e.target.files[0])} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-neon-violet/20 file:text-neon-violet hover:file:bg-neon-violet/30" />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-neon-violet text-white font-bold rounded-lg hover:bg-neon-violet/80 transition-colors disabled:opacity-50">
                    {isSubmitting ? 'Uploading...' : 'Add Skill'}
                  </button>
                </form>
              </div>

              <div className="glass p-6 rounded-2xl border-white/10">
                <h2 className="text-xl font-bold mb-4">Existing Skills ({skills.length})</h2>
                <div className="space-y-3">
                  {skills.map(s => (
                    <div key={s._id} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                      <div className="flex items-center gap-4">
                        {s.icon ? <img src={s.icon} className="w-8 h-8 object-contain" /> : <div className="w-8 h-8 bg-white/10 rounded-md"></div>}
                        <div>
                          <h4 className="font-bold">{s.name}</h4>
                          <p className="text-xs text-gray-400">{s.category}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteSkill(s._id)} className="text-red-400 hover:text-red-300 px-3 py-1 bg-red-400/10 rounded-md transition-colors">Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
