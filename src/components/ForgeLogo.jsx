import { Link } from "react-router-dom";
import "./ForgeLogo.css";

export default function ForgeLogo() {
  return (
    <Link
      to="/"
      // 🟢 FIX: 'text-white' ko hata kar 'text-black' kar diya
      className="flex items-center md:ml-8 lg:ml-16 shrink-0 select-none text-black"
    >
      <span className="forge-logo">FORGE</span>
    </Link>
  );
}