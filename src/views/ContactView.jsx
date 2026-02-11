import { useState } from 'react';
import { CheckCircle, Loader, Send } from 'lucide-react';

const ContactView = ({ darkMode }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;

    setStatus('sending');

    setTimeout(() => {
      const subject = encodeURIComponent(`Portfolio Inquiry from ${formData.name}`);
      const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);

      const mailtoLink = `mailto:kontakt@joelvanhees.de?subject=${subject}&body=${body}`;

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });

      setTimeout(() => {
        window.location.href = mailtoLink;
        setStatus('idle');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="pt-32 px-6 min-h-screen max-w-7xl mx-auto flex items-center justify-center pb-40">
      <div className={`w-full max-w-2xl backdrop-blur-xl rounded-3xl p-8 md:p-12 border shadow-2xl relative overflow-hidden group transition-all duration-500
        ${darkMode 
          ? 'bg-white/5 border-white/10 text-white shadow-[0_0_50px_rgba(0,255,65,0.1)]' 
          : 'bg-white/60 border-white/40 text-black shadow-[0_0_50px_rgba(0,85,255,0.1)]'
        }`}
      >
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-rubik font-bold mb-2 uppercase">
            <span className="glitch-hover cursor-default block">INITIATE UPLINK</span>
          </h2>
          <p className="font-mono text-sm opacity-60 mb-12">Send a signal. I will respond.</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="group/input relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder=" "
                className={`peer w-full bg-transparent border-b-2 outline-none py-2 font-syne text-xl transition-all ${darkMode ? 'border-white/20 focus:border-green-500' : 'border-black/20 focus:border-blue-500'}`}
              />
              <label className={`absolute left-0 top-2 font-mono text-xs uppercase transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm ${darkMode ? 'text-white/50' : 'text-black/50'}`}>Identity / Name</label>
            </div>

            <div className="group/input relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder=" "
                className={`peer w-full bg-transparent border-b-2 outline-none py-2 font-syne text-xl transition-all ${darkMode ? 'border-white/20 focus:border-green-500' : 'border-black/20 focus:border-blue-500'}`}
              />
              <label className={`absolute left-0 top-2 font-mono text-xs uppercase transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm ${darkMode ? 'text-white/50' : 'text-black/50'}`}>Frequency / Email</label>
            </div>

            <div className="group/input relative">
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
                placeholder=" "
                className={`peer w-full bg-transparent border-b-2 outline-none py-2 font-mono text-sm resize-none transition-all ${darkMode ? 'border-white/20 focus:border-green-500' : 'border-black/20 focus:border-blue-500'}`}
              ></textarea>
              <label className={`absolute left-0 top-2 font-mono text-xs uppercase transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm ${darkMode ? 'text-white/50' : 'text-black/50'}`}>Transmission Data</label>
            </div>

            <button
              type="submit"
              disabled={status === 'sending' || status === 'success'}
              className={`w-full py-6 rounded-xl font-bold uppercase tracking-widest transition-all hover:scale-[1.02] flex items-center justify-center gap-2 mt-8 
                  ${status === 'success' 
                    ? (darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white')
                    : (darkMode ? 'bg-[#00FF41] text-black hover:bg-[#00cc33] shadow-[0_0_20px_rgba(0,255,65,0.4)]' : 'bg-[#0055FF] text-white hover:bg-[#0044cc] shadow-[0_0_20px_rgba(0,85,255,0.4)]')
                  }
                  ${status === 'sending' ? 'opacity-70 cursor-wait' : ''}
                `}
            >
              {status === 'sending' ? (
                <>TRANSMITTING... <Loader className="animate-spin" size={18} /></>
              ) : status === 'success' ? (
                <>SIGNAL SENT <CheckCircle size={18} /></>
              ) : (
                <>SEND SIGNAL <Send size={18} /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactView;
