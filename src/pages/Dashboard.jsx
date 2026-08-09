import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ENTITY_NAMES, ENTITY_SCHEMAS, ENTITY_GROUPS } from "@/lib/entitySchemas";
import AdminLayout from "@/components/admin/AdminLayout";
import { Loader2, ArrowRight } from "lucide-react";

const GROUP_ORDER = ["core", "learning", "seerah", "guidance", "community"];

export default function Dashboard() {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const results = await Promise.all(
        ENTITY_NAMES.map(async (name) => {
          try {
            const records = await base44.entities[name].list("-created_date", 1000);
            return [name, records.length];
          } catch {
            return [name, null];
          }
        })
      );
      if (!cancelled) {
        setCounts(Object.fromEntries(results));
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalRecords = Object.values(counts).reduce((sum, n) => sum + (n || 0), 0);

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          {!loading && (
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-700">{totalRecords}</span> total records
            </p>
          )}
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Managing content for the shared Path to Jannah backend — changes here reflect live in the public app.
        </p>

        {loading ? (
          <div className="p-12 flex justify-center text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            {GROUP_ORDER.map((groupKey) => {
              const items = ENTITY_NAMES.filter((name) => ENTITY_SCHEMAS[name].group === groupKey);
              if (items.length === 0) return null;
              return (
                <div key={groupKey}>
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    {ENTITY_GROUPS[groupKey]}
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((name) => {
                      const schema = ENTITY_SCHEMAS[name];
                      const Icon = schema.icon;
                      const isEmpty = !counts[name];
                      return (
                        <Link
                          key={name}
                          to={`/${name}`}
                          className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-sm transition-all group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-500">
                              {Icon && <Icon className="w-4 h-4" />}
                              <p className="font-medium text-gray-900">{schema.label}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
                          </div>
                          <p className={`text-3xl font-semibold mt-2 ${isEmpty ? "text-gray-300" : "text-gray-900"}`}>
                            {counts[name] === null ? "—" : counts[name]}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {isEmpty ? "no records yet" : "records"}
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
