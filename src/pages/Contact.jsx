import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 4000);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center overflow-x-hidden">
        <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg mb-6 inline-block">
          <span className="text-2xl">✅</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Thanks, {formData.name}!</h2>
        <p className="text-gray-600 mb-8">
          Your message has been sent. Our support team will get back to you within 24 hours.
        </p>
        <button 
          onClick={() => setIsSubmitted(false)}
          className="bg-black text-white px-8 py-3 rounded font-bold hover:bg-gray-800 transition"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 overflow-x-hidden">
      <h1 className="text-4xl font-bold text-gray-900 mb-6 border-l-4 border-black pl-4">
        Contact Us
      </h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Name</label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-black transition"
            placeholder="Your name" 
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-black transition"
            placeholder="your@email.com" 
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Message</label>
          <textarea 
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-black transition h-32 resize-none"
            placeholder="Write your message here..."
          ></textarea>
        </div>
        <button 
          type="submit" 
          className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition shadow-md uppercase tracking-wider"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}