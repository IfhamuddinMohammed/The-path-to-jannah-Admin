import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ENTITY_SCHEMAS } from "@/lib/entitySchemas";
import AdminLayout from "@/components/admin/AdminLayout";
import EntityFormDialog from "@/components/admin/EntityFormDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Loader2, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function EntityListPage() {
  const { entityName } = useParams();
  const schema = ENTITY_SCHEMAS[entityName];
  const { toast } = useToast();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [saving, setSaving] = useState(false);

  const columns = useMemo(() => {
    if (!schema) return [];
    const keys = Object.keys(schema.fields);
    return keys.filter((k) => k !== schema.titleField).slice(0, 2);
  }, [schema]);

  const load = useCallback(async () => {
    if (!schema) return;
    setLoading(true);
    try {
      const data = await base44.entities[entityName].list("-created_date", 200);
      setRecords(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(`Failed to load ${entityName}:`, error);
      toast({ variant: "destructive", title: `Couldn't load ${schema.label}`, description: error.message });
    } finally {
      setLoading(false);
    }
  }, [entityName, schema, toast]);

  useEffect(() => {
    load();
  }, [load]);

  if (!schema) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-gray-500">Unknown entity "{entityName}".</div>
      </AdminLayout>
    );
  }

  const filtered = records.filter((r) => {
    if (!search.trim()) return true;
    const haystack = JSON.stringify(r).toLowerCase();
    return haystack.includes(search.trim().toLowerCase());
  });

  const openCreate = () => {
    setEditingRecord(null);
    setDialogOpen(true);
  };

  const openEdit = (record) => {
    setEditingRecord(record);
    setDialogOpen(true);
  };

  const handleSave = async (payload) => {
    setSaving(true);
    try {
      if (editingRecord) {
        await base44.entities[entityName].update(editingRecord.id, payload);
        toast({ title: `${schema.label} updated` });
      } else {
        await base44.entities[entityName].create(payload);
        toast({ title: `${schema.label} created` });
      }
      setDialogOpen(false);
      await load();
    } catch (error) {
      console.error("Save failed:", error);
      toast({ variant: "destructive", title: "Save failed", description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (record) => {
    const title = String(record[schema.titleField] ?? "this record").slice(0, 60);
    if (!window.confirm(`Delete "${title}"? This can't be undone.`)) return;
    try {
      await base44.entities[entityName].delete(record.id);
      toast({ title: `${schema.label} deleted` });
      await load();
    } catch (error) {
      console.error("Delete failed:", error);
      toast({ variant: "destructive", title: "Delete failed", description: error.message });
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            {schema.icon && (
              <div className="w-9 h-9 rounded-lg bg-emerald-800/10 text-emerald-800 flex items-center justify-center shrink-0">
                <schema.icon className="w-4 h-4" />
              </div>
            )}
            <div>
              <h1 className="text-xl font-semibold">{schema.label}</h1>
              <p className="text-sm text-gray-500">{records.length} records</p>
            </div>
          </div>
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" />
            New {schema.label}
          </Button>
        </div>

        <div className="relative mb-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder={`Search ${schema.label}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No {schema.label} records yet.</div>
          ) : (
            // Scrolls horizontally on narrow screens instead of forcing every column to
            // truncate/overlap — the table's column alignment (for scanning data) matters more
            // here than avoiding a scrollbar, same trade-off admin tools like this typically make.
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{schema.titleField.replace(/_/g, " ")}</TableHead>
                  {columns.map((col) => (
                    <TableHead key={col}>{col.replace(/_/g, " ")}</TableHead>
                  ))}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium max-w-xs truncate">
                      {String(record[schema.titleField] ?? "—")}
                    </TableCell>
                    {columns.map((col) => (
                      <TableCell key={col} className="max-w-[200px] truncate text-gray-600">
                        {Array.isArray(record[col]) ? (
                          <Badge variant="outline">{record[col].length} items</Badge>
                        ) : typeof record[col] === "boolean" ? (
                          record[col] ? (
                            <Badge>Yes</Badge>
                          ) : (
                            <span className="text-gray-400">No</span>
                          )
                        ) : (
                          String(record[col] ?? "—")
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(record)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(record)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          )}
        </div>
      </div>

      <EntityFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        schema={schema}
        record={editingRecord}
        onSave={handleSave}
        saving={saving}
      />
    </AdminLayout>
  );
}
