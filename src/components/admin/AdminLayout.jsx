import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import { ENTITY_NAMES, ENTITY_SCHEMAS, ENTITY_GROUPS } from "@/lib/entitySchemas";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const GROUP_ORDER = ["core", "learning", "seerah", "guidance", "community"];

// Previously a hand-rolled `<aside className="w-64 shrink-0">` that never adapted below desktop
// widths — on a phone it permanently ate ~60% of the screen, squeezing every page's content
// (tables, buttons, titles) into the remaining strip and forcing text to wrap/truncate badly.
// Rebuilt on the same shadcn Sidebar primitives the main Path to Jannah app already uses: on
// mobile this renders as an off-canvas drawer (triggered by the hamburger below) instead of a
// permanently-visible column, and every page composes through this one component, so the fix
// applies everywhere at once.
export default function AdminLayout({ children }) {
  const location = useLocation();

  const grouped = GROUP_ORDER.map((groupKey) => ({
    key: groupKey,
    label: ENTITY_GROUPS[groupKey],
    items: ENTITY_NAMES.filter((name) => ENTITY_SCHEMAS[name].group === groupKey),
  }));

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50 text-gray-900">
        <Sidebar collapsible="offcanvas" className="border-r border-gray-200 bg-white">
          <SidebarHeader className="p-5 border-b border-gray-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center shrink-0">
                <span className="text-white text-sm font-semibold">P</span>
              </div>
              <div>
                <h1 className="font-semibold text-[15px] leading-tight">Path to Jannah</h1>
                <p className="text-xs text-gray-500">Content Admin</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-3">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/"}>
                  <Link to="/">
                    <LayoutDashboard className="w-4 h-4 shrink-0" />
                    Dashboard
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            {grouped.map((group) => (
              <SidebarGroup key={group.key}>
                <SidebarGroupLabel className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  {group.label}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((name) => {
                      const schema = ENTITY_SCHEMAS[name];
                      const Icon = schema.icon;
                      const isActive = location.pathname === `/${name}`;
                      return (
                        <SidebarMenuItem key={name}>
                          <SidebarMenuButton asChild isActive={isActive}>
                            <Link to={`/${name}`}>
                              {Icon && <Icon className="w-4 h-4 shrink-0" />}
                              <span className="truncate">{schema.label}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 min-w-0 flex flex-col">
          <header className="md:hidden sticky top-0 z-30 flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3">
            <SidebarTrigger className="p-2 rounded-lg hover:bg-gray-100 transition-colors" />
            <span className="font-semibold text-[15px]">Path to Jannah Admin</span>
          </header>
          <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
