import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed w-full z-50 glass top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="text-3xl font-bold text-white tracking-tighter">
            PE<span className="text-electric-blue">.</span>
          </Link>

          <div className="hidden md:flex space-x-8 items-center bg-white/5 px-8 py-3 rounded-full border border-white/10">
            <Link to="/" className="text-sm font-medium text-white hover:text-electric-blue transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-electric-blue after:rounded-full">Home</Link>
            <a href="#about" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">About</a>
            <a href="#skills" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Skills</a>
            <a href="#projects" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Projects</a>
            <a href="#experience" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Experience</a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/admin" className="text-sm font-medium text-electric-blue hover:text-white transition-colors">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <a href="#contact" className="px-6 py-2.5 text-sm font-medium text-white border border-white/20 rounded-full hover:bg-white/10 transition-colors">
                Contact Me
              </a>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white">
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/10"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              <Link to="/" className="block px-3 py-2 text-base font-medium text-white" onClick={() => setIsOpen(false)}>Home</Link>
              <a href="#about" className="block px-3 py-2 text-base font-medium text-gray-300" onClick={() => setIsOpen(false)}>About</a>
              <a href="#skills" className="block px-3 py-2 text-base font-medium text-gray-300" onClick={() => setIsOpen(false)}>Skills</a>
              <a href="#projects" className="block px-3 py-2 text-base font-medium text-gray-300" onClick={() => setIsOpen(false)}>Projects</a>
              <a href="#contact" className="block px-3 py-2 text-base font-medium text-gray-300" onClick={() => setIsOpen(false)}>Contact</a>
              {user && (
                <Link to="/admin" className="block px-3 py-2 text-base font-medium text-electric-blue" onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
