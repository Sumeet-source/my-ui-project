import { Link } from "react-router-dom";
import "./ForgeLogo.css";
import ScrambleLogo from './ScrambleLogo'; // 🟢 Import kiya

export default function ForgeLogo() {
  return (
    <Link
      to="/"
      className="flex items-center md:ml-8 lg:ml-16 shrink-0 select-none text-black"
    >
      {/* 🟢 Ab ye ScrambleLogo use karega aur forge-logo CSS apply karega */}
      <ScrambleLogo text="FORGE" className="forge-logo" />
    </Link>
  );
}