import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <div className="glass p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gradient mb-8">Admin Login</h2>
        {error && <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-blue" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-blue" 
              required
            />
          </div>
          <button type="submit" className="w-full py-4 bg-gradient-to-r from-electric-blue to-purple text-white font-bold rounded-lg hover:glow transition-all">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
