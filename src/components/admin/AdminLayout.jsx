import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import { ENTITY_NAMES, ENTITY_SCHEMAS } from "@/lib/entitySchemas";

export default function AdminLayout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      <aside className="w-64 shrink-0 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-5 border-b border-gray-200">
          <h1 className="font-semibold text-lg">Path to Jannah</h1>
          <p className="text-xs text-gray-500">Content Admin</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <Link
            to="/"
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
              location.pathname === "/" ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <p className="px-3 pt-4 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Content</p>
          {ENTITY_NAMES.map((name) => (
            <Link
              key={name}
              to={`/${name}`}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === `/${name}` ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {ENTITY_SCHEMAS[name].label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
    </div>
  );
}
