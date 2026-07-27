import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function buildEmptyForm(fields) {
  const form = {};
  for (const [key, def] of Object.entries(fields)) {
    if (def.type === "boolean") form[key] = false;
    else if (def.type === "array") form[key] = "";
    else if (def.type === "number") form[key] = "";
    else form[key] = "";
  }
  return form;
}

function recordToForm(fields, record) {
  const form = {};
  for (const [key, def] of Object.entries(fields)) {
    const value = record?.[key];
    if (def.type === "array") form[key] = Array.isArray(value) ? value.join("\n") : "";
    else if (def.type === "boolean") form[key] = !!value;
    else form[key] = value ?? "";
  }
  return form;
}

function formToPayload(fields, form) {
  const payload = {};
  for (const [key, def] of Object.entries(fields)) {
    const value = form[key];
    if (def.type === "array") {
      payload[key] = value
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    } else if (def.type === "number") {
      payload[key] = value === "" ? undefined : Number(value);
    } else if (def.type === "boolean") {
      payload[key] = !!value;
    } else {
      payload[key] = value;
    }
  }
  return payload;
}

export default function EntityFormDialog({ open, onOpenChange, schema, record, onSave, saving }) {
  const [form, setForm] = useState(() => buildEmptyForm(schema.fields));

  useEffect(() => {
    if (open) {
      setForm(record ? recordToForm(schema.fields, record) : buildEmptyForm(schema.fields));
    }
  }, [open, record, schema.fields]);

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const missingRequired = Object.entries(schema.fields).some(
    ([key, def]) => def.required && !String(form[key] ?? "").trim()
  );

  const handleSave = () => {
    onSave(formToPayload(schema.fields, form));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{record ? `Edit ${schema.label}` : `New ${schema.label}`}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {Object.entries(schema.fields).map(([key, def]) => (
            <div key={key} className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                {key.replace(/_/g, " ")}
                {def.required && <span className="text-red-500 ml-0.5">*</span>}
              </label>

              {def.type === "boolean" ? (
                <div className="flex items-center gap-2">
                  <Checkbox checked={form[key]} onCheckedChange={(v) => setField(key, !!v)} />
                  <span className="text-sm text-gray-600">Enabled</span>
                </div>
              ) : def.enum ? (
                <Select value={form[key]} onValueChange={(v) => setField(key, v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {def.enum.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : def.type === "array" ? (
                <Textarea
                  value={form[key]}
                  onChange={(e) => setField(key, e.target.value)}
                  placeholder="One item per line"
                  rows={4}
                />
              ) : def.multiline ? (
                <Textarea
                  value={form[key]}
                  onChange={(e) => setField(key, e.target.value)}
                  dir={def.rtl ? "rtl" : "ltr"}
                  className={def.rtl ? "text-right" : ""}
                  rows={4}
                />
              ) : (
                <Input
                  type={def.type === "number" ? "number" : "text"}
                  value={form[key]}
                  onChange={(e) => setField(key, e.target.value)}
                  dir={def.rtl ? "rtl" : "ltr"}
                  className={def.rtl ? "text-right" : ""}
                />
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={missingRequired || saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
