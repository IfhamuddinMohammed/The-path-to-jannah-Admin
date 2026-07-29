import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import { ENTITY_NAMES, ENTITY_SCHEMAS, ENTITY_GROUPS } from "@/lib/entitySchemas";

const GROUP_ORDER = ["core", "learning", "seerah", "guidance", "community"];

export default function AdminLayout({ children }) {
  const location = useLocation();

  const grouped = GROUP_ORDER.map((groupKey) => ({
    key: groupKey,
    label: ENTITY_GROUPS[groupKey],
    items: ENTITY_NAMES.filter((name) => ENTITY_SCHEMAS[name].group === groupKey),
  }));

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      <aside className="w-64 shrink-0 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-semibold">P</span>
            </div>
            <div>
              <h1 className="font-semibold text-[15px] leading-tight">Path to Jannah</h1>
              <p className="text-xs text-gray-500">Content Admin</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          <Link
            to="/"
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              location.pathname === "/" ? "bg-emerald-800 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            Dashboard
          </Link>

          {grouped.map((group) => (
            <div key={group.key}>
              <p className="px-3 pb-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((name) => {
                  const schema = ENTITY_SCHEMAS[name];
                  const Icon = schema.icon;
                  const isActive = location.pathname === `/${name}`;
                  return (
                    <Link
                      key={name}
                      to={`/${name}`}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive ? "bg-emerald-800 text-white" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {Icon && <Icon className="w-4 h-4 shrink-0" />}
                      <span className="truncate">{schema.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
      <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
    </div>
  );
}
