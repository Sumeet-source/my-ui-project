export default function Footer() {
  return (
    <footer className="bg-white border-t py-8 mt-12">
      <div className="max-w-6xl mx-auto px-6 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} MyBrand. All rights reserved.</p>
        <div className="flex justify-center gap-6 mt-4">
          <a href="#" className="hover:text-blue-600 transition">Twitter</a>
          <a href="#" className="hover:text-blue-600 transition">GitHub</a>
          <a href="#" className="hover:text-blue-600 transition">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}