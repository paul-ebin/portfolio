import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 glass mt-20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <h3 className="text-xl font-bold text-gradient">Paul Ebineezer</h3>
          <p className="text-gray-400 mt-1">Full Stack Developer</p>
        </div>
        
        <div className="flex space-x-6">
          <a href="https://github.com/paulebineezer" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
            <FaGithub size={24} />
          </a>
          <a href="https://linkedin.com/in/paulebineezer" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
            <FaLinkedin size={24} />
          </a>
          <a href="mailto:paul@example.com" className="text-gray-400 hover:text-white transition-colors">
            <FaEnvelope size={24} />
          </a>
        </div>
      </div>
      <div className="text-center mt-8 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Paul Ebineezer. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
