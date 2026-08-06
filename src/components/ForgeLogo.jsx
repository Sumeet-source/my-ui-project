import { Link } from "react-router-dom";
import "./ForgeLogo.css";

export default function ForgeLogo() {
  return (
    <Link
      to="/"
      className="flex items-center md:ml-8 lg:ml-16 shrink-0 select-none text-white"
    >
      <span className="forge-logo">FORGE</span>
    </Link>
  );
}