import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaEnvelope, FaLinkedin, FaDownload, FaReact, FaNodeJs, FaDatabase, FaCode } from 'react-icons/fa';

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, projectsRes, skillsRes] = await Promise.all([
          axios.get('/api/profile'),
          axios.get('/api/projects'),
          axios.get('/api/skills')
        ]);
        
        // Safety check: if the response is HTML (like a 404 redirect), it's not our API data.
        if (typeof profileRes.data === 'string' && profileRes.data.includes('<!DOCTYPE html>')) {
           throw new Error("Received HTML instead of JSON. The VITE_API_URL is likely missing or incorrect.");
        }

        setProfile(profileRes.data);
        setProjects(projectsRes.data || []);
        setSkills(skillsRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Set a dummy profile so the page doesn't crash completely while debugging
        setProfile({ name: "Error Loading Data", subtitle: "Check API Connection", title: "API Unreachable", description: error.message });
      }
    };
    fetchData();
  }, []);

  if (!profile) return <div className="h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!profile.name) return <div className="h-screen flex items-center justify-center text-white">API returned invalid data format.</div>;

  const nameParts = profile.name.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  // Group skills
  const groupedSkills = skills.reduce((acc, skill) => {
    acc[skill.category] = acc[skill.category] || [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="relative w-full overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] rounded-full bg-purple/20 blur-[120px]"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-electric-blue/10 blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        
        {/* HERO SECTION */}
        <section className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-32 relative">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-left"
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.9] mb-4">
              <span className="block text-white uppercase">{firstName}</span>
              <span className="block text-gradient uppercase italic pe-4">{lastName}</span>
            </h1>
            <h2 className="text-xl md:text-2xl text-gray-400 mb-2 font-light tracking-wide">{profile.subtitle}</h2>
            <h3 className="text-2xl md:text-3xl font-semibold text-white mb-6 flex items-center gap-4">
              {profile.title} <span className="inline-block w-12 h-1 bg-gradient-to-r from-electric-blue to-purple rounded-full"></span>
            </h3>
            <p className="text-gray-400 text-lg max-w-xl mb-10 leading-relaxed">
              {profile.description}
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <a href="#projects" className="px-8 py-4 bg-gradient-to-r from-electric-blue to-purple text-white font-bold rounded-full hover:glow-purple transition-all flex items-center gap-2">
                View My Work <span className="ml-2">→</span>
              </a>
              <a href="#contact" className="px-8 py-4 glass text-white font-bold rounded-full hover:bg-white/10 transition-all flex items-center gap-2">
                Contact Me <FaExternalLinkAlt size={14} />
              </a>
            </div>

            <div className="flex items-center gap-6 mt-12">
              {profile.github && <a href={profile.github} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors"><FaGithub size={24} /></a>}
              {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors"><FaLinkedin size={24} /></a>}
              {profile.email && <a href={`mailto:${profile.email}`} className="text-gray-400 hover:text-white transition-colors"><FaEnvelope size={24} /></a>}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex-1 relative flex justify-center lg:justify-end"
          >
            {/* Circular Glow behind image */}
            <div className="absolute inset-0 m-auto w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-gradient-to-tr from-purple/40 to-electric-blue/40 rounded-full blur-2xl animate-pulse"></div>
            
            <div className="relative z-10 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full border border-white/10 overflow-hidden bg-dark-surface backdrop-blur-sm p-4">
               {profile.heroImage ? (
                  <img src={profile.heroImage} alt={profile.name} className="w-full h-full object-cover rounded-full" />
               ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-purple/20 to-electric-blue/20 flex items-center justify-center">
                    <span className="text-6xl text-white font-bold">{firstName[0]}</span>
                  </div>
               )}
            </div>

            {/* Floating Icons */}
            <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute top-10 right-10 glass p-4 rounded-2xl text-electric-blue"><FaReact size={32}/></motion.div>
            <motion.div animate={{ y: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute bottom-20 left-10 glass p-4 rounded-2xl text-purple"><FaDatabase size={32}/></motion.div>
            <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 3.5 }} className="absolute bottom-40 right-0 glass p-4 rounded-2xl text-green-400"><FaNodeJs size={32}/></motion.div>
          </motion.div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="mb-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h4 className="text-electric-blue font-semibold tracking-widest text-xs mb-3 uppercase">About Me</h4>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Get to <span className="text-gradient italic">know me</span>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {profile.aboutText}
              </p>
              <button className="px-6 py-3 glass rounded-full font-semibold flex items-center gap-2 hover:bg-white/10 transition-colors">
                More About Me
              </button>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.stats?.length > 0 ? (
                profile.stats.map((stat, idx) => (
                  <div key={idx} className="glass-card p-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-electric-blue/20 to-purple/20 flex items-center justify-center mb-4 border border-white/10">
                      <FaCode className="text-electric-blue" size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{stat.label}</h3>
                    <p className="text-gray-400 text-sm">{stat.value}</p>
                  </div>
                ))
              ) : (
                <>
                  <div className="glass-card p-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple/20 to-transparent flex items-center justify-center mb-4 border border-white/10 text-purple"><FaCode size={24}/></div>
                    <h3 className="text-xl font-bold mb-2">Computer Science Engineering</h3>
                    <p className="text-gray-400 text-sm">Strong foundation in CS concepts and problem solving.</p>
                  </div>
                  <div className="glass-card p-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-electric-blue/20 to-transparent flex items-center justify-center mb-4 border border-white/10 text-electric-blue"><FaReact size={24}/></div>
                    <h3 className="text-xl font-bold mb-2">Full Stack Development</h3>
                    <p className="text-gray-400 text-sm">Building end-to-end scalable web applications.</p>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="mb-32">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
            <h4 className="text-purple font-semibold tracking-widest text-xs mb-3 uppercase">My Skills</h4>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-12">
              Technologies I <span className="text-gradient italic">Work With</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(groupedSkills).map(([category, items], idx) => (
              <motion.div key={category} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="glass-card p-5">
                <h3 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-electric-blue glow"></span> {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {items.map(skill => (
                    <div key={skill._id} className="bg-white/5 border border-white/10 rounded-md px-2.5 py-1 flex items-center gap-1.5 hover:bg-white/10 hover:border-white/20 transition-all cursor-default group">
                      {skill.icon && <img src={skill.icon} alt={skill.name} className="w-3.5 h-3.5 object-contain opacity-70 group-hover:opacity-100 transition-opacity" />}
                      <span className="text-xs font-semibold text-gray-400 group-hover:text-white transition-colors">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
            
            {Object.keys(groupedSkills).length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-10 glass-card">
                Skills are empty. Add them from the dashboard.
              </div>
            )}
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="mb-32">
           <div className="flex justify-between items-end mb-12">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h4 className="text-electric-blue font-semibold tracking-widest text-xs mb-3 uppercase">My Projects</h4>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Featured <span className="text-gradient italic">Projects</span>
              </h2>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="hidden sm:block">
               {/* Arrow decoration */}
               <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-purple opacity-50 transform rotate-45"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <motion.div 
                key={project._id} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card overflow-hidden group hover:border-electric-blue/50 transition-colors duration-500 flex flex-col"
              >
                <div className="relative h-56 overflow-hidden bg-dark-bg/50 p-4 border-b border-white/5">
                  <div className="w-full h-full rounded-xl overflow-hidden relative">
                    {project.image ? (
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                       <div className="w-full h-full bg-gradient-to-br from-purple/20 to-electric-blue/20"></div>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                      {project.githubLink && (
                        <a href={project.githubLink} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/20 hover:text-electric-blue transition-all">
                          <FaGithub size={20} />
                        </a>
                      )}
                      {project.liveLink && (
                        <a href={project.liveLink} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-electric-blue text-dark-bg flex items-center justify-center hover:bg-electric-blue/80 transition-all">
                          <FaExternalLinkAlt size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-6 flex-grow line-clamp-3">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.techStack.map((tech, idx) => (
                      <span key={idx} className="px-3 py-1 text-xs font-semibold text-electric-blue bg-electric-blue/10 border border-electric-blue/20 rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* BOTTOM SECTION: Experience & Contact side-by-side */}
        <section className="grid lg:grid-cols-2 gap-16 mb-20">
          {/* Experience */}
          <div id="experience">
            <h4 className="text-purple font-semibold tracking-widest text-xs mb-3 uppercase">Experience</h4>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-10">
              My <span className="text-gradient italic">Journey</span>
            </h2>
            
            <div className="space-y-6 border-l border-white/10 pl-6 ml-3 relative">
               <div className="relative">
                 <span className="absolute -left-[31px] top-2 w-3 h-3 rounded-full bg-purple glow-purple"></span>
                 <p className="text-sm text-gray-400 font-semibold mb-1">2024 - Present</p>
                 <h3 className="text-xl font-bold text-white mb-1">Full Stack Developer</h3>
                 <p className="text-sm text-gray-500">Building scalable web applications and creating exceptional digital experiences.</p>
               </div>
               <div className="relative">
                 <span className="absolute -left-[31px] top-2 w-3 h-3 rounded-full bg-electric-blue glow"></span>
                 <p className="text-sm text-gray-400 font-semibold mb-1">2023 - 2024</p>
                 <h3 className="text-xl font-bold text-white mb-1">Web Developer</h3>
                 <p className="text-sm text-gray-500">Developed responsive websites and optimized frontend performance.</p>
               </div>
            </div>
          </div>

          {/* Contact */}
          <div id="contact" className="glass-card p-8">
            <h4 className="text-electric-blue font-semibold tracking-wider text-sm mb-2 uppercase">Get In Touch</h4>
            <h2 className="text-3xl font-bold mb-4">Let's Work Together</h2>
            <p className="text-gray-400 mb-8">I'm open to new opportunities and exciting projects. Let's build something amazing together!</p>
            
            <div className="flex flex-col gap-4">
              <a href={`mailto:${profile.email}`} className="w-full py-4 bg-gradient-to-r from-purple to-electric-blue rounded-xl font-bold text-center flex items-center justify-center gap-2 hover:glow-purple transition-all">
                 <FaEnvelope /> Email Me
              </a>
              <div className="grid grid-cols-2 gap-4">
                 <a href={profile.linkedin} target="_blank" rel="noreferrer" className="py-4 glass rounded-xl font-bold text-center flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                   <FaLinkedin /> LinkedIn
                 </a>
                 <a href={profile.github} target="_blank" rel="noreferrer" className="py-4 glass rounded-xl font-bold text-center flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                   <FaGithub /> GitHub
                 </a>
              </div>
              {profile.resumeUrl && (
                 <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="w-full py-4 glass rounded-xl font-bold text-center flex items-center justify-center gap-2 hover:bg-white/10 transition-all border border-white/20 mt-2 text-gray-300">
                   <FaDownload /> Download Resume
                 </a>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
          <div className="flex items-center gap-2">
             <span className="text-2xl font-bold text-white">PE.</span> 
             <div>
               <p className="font-bold text-white">{profile.name}</p>
               <p>{profile.title}</p>
             </div>
          </div>
          <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-white transition-colors">
            Back to Top ↑
          </button>
        </footer>

      </div>
    </div>
  );
};

export default Home;
