import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ENTITY_NAMES, ENTITY_SCHEMAS } from "@/lib/entitySchemas";
import AdminLayout from "@/components/admin/AdminLayout";
import { Loader2, ArrowRight } from "lucide-react";

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

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-xl font-semibold mb-1">Dashboard</h1>
        <p className="text-sm text-gray-500 mb-6">
          Managing content for the shared Path to Jannah backend — changes here reflect live in the public app.
        </p>

        {loading ? (
          <div className="p-12 flex justify-center text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ENTITY_NAMES.map((name) => (
              <Link
                key={name}
                to={`/${name}`}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">{ENTITY_SCHEMAS[name].label}</p>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                </div>
                <p className="text-3xl font-semibold mt-2">
                  {counts[name] === null ? "—" : counts[name]}
                </p>
                <p className="text-xs text-gray-400 mt-1">records</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
