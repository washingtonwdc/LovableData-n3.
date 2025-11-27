import { Home, Search, Phone, Info, Building2, CalendarDays } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAdmin } from "@/components/admin-provider";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Início",
    url: "/",
    icon: Home,
    testId: "link-home",
  },
  {
    title: "Buscar Setores",
    url: "/setores",
    icon: Search,
    testId: "link-setores",
  },
  {
    title: "Lista Telefônica",
    url: "/lista-telefonica",
    icon: Phone,
    testId: "link-lista-telefonica",
  },
  {
    title: "Agenda",
    url: "/agenda",
    icon: CalendarDays,
    testId: "link-agenda",
  },
  {
    title: "Sobre",
    url: "/sobre",
    icon: Info,
    testId: "link-sobre",
  },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { adminOpen } = useAdmin();

  const safeItems = menuItems;

  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <Link href="/" className="flex items-center gap-2" data-testid="link-logo">
          <Building2 className="h-8 w-8 text-primary" />
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-tight">SEEPE</span>
            <span className="text-xs text-muted-foreground leading-tight">SEE-PE</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {safeItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={item.testId}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
