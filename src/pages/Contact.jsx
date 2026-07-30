export default function Contact() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">Contact Us</h1>
      <form className="bg-white shadow-md rounded-lg p-8 space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Name</label>
          <input type="text" className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500" placeholder="Your name" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input type="email" className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500" placeholder="your@email.com" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Message</label>
          <textarea className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500 h-32" placeholder="Write your message here..."></textarea>
        </div>
        <button type="button" className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition shadow-md">
          Send Message
        </button>
      </form>
    </div>
  );
}