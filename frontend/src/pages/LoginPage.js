import React, { useEffect } from 'react';
import './LoginPage.css';
import { getUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://sunday-mail.onrender.com'
    : 'http://localhost:5001';

// --- HandWrittenTitle Animation Component ---
function HandWrittenTitle({
  title = 'Hand Written',
  subtitle = '',
}) {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 2.5, ease: [0.43, 0.13, 0.23, 0.96] },
        opacity: { duration: 0.5 },
      },
    },
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center" style={{ height: '520px' }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.svg
          width="700"
          height="520"
          viewBox="0 0 1200 600"
          initial="hidden"
          animate="visible"
          className="w-[700px] h-[520px]"
        >
          <title>Sunday Mail</title>
          <motion.path
            d="M 950 90 
               C 1250 300, 1050 480, 600 520
               C 250 520, 150 480, 150 300
               C 150 120, 350 80, 600 80
               C 850 80, 950 180, 950 180"
            fill="none"
            strokeWidth="16"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={draw}
            className="opacity-90 drop-shadow-lg"
          />
          {/* Centered SVG Text inside the animation */}
          <text
            x="600"
            y="340"
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize="100"
            fontWeight="bold"
            fill="white"
            style={{ fontFamily: 'Inter, Arial, sans-serif', letterSpacing: '-2px', textShadow: '0 2px 16px #0008' }}
          >
            Sunday Mail
          </text>
        </motion.svg>
      </div>
      {subtitle && (
        <motion.p
          className="text-2xl text-white/80 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

// --- Login Page ---
export default function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    getUser()
      .then(() => {
        navigate('/');
      })
      .catch(() => {});
  }, []);

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  return (
    <main className="login-grand-bg min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-5xl space-y-20 flex flex-col items-center">
        <HandWrittenTitle />
        <div className="w-full flex flex-col items-center mt-8">
          <button
            className="btn btn-primary flex items-center gap-3 text-xl px-8 py-4 rounded-2xl font-bold shadow-lg"
            onClick={handleGoogleLogin}
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: 32, height: 32, marginRight: 8, verticalAlign: 'middle' }} />
            Login with Google
          </button>
        </div>
      </div>
    </main>
  );
}
