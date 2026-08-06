import { Link } from "react-router-dom";
import "./ForgeLogo.css";

export default function ForgeLogo() {
  return (
    <Link
      to="/"
      className="flex flex-col md:flex-row items-center gap-1 md:gap-3 md:ml-8 lg:ml-16 shrink-0 select-none text-white"
    >
      <div className="flex flex-col leading-none">
        <span className="forge-logo">FORGE</span>
        <span className="forge-tagline">GEAR</span>
      </div>
    </Link>
  );
}