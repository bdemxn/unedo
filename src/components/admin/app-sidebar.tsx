"use client"

import {
  ChartPieIcon,
  CombineIcon,
  HandPlatterIcon,
  IdCardLanyardIcon,
  LandmarkIcon,
  MailCheckIcon,
  PackageIcon,
  PercentIcon,
  WarehouseIcon,
} from "lucide-react";
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
} from "../ui/sidebar";
import { authClient } from "@/lib/auth-client";
import useSWR from "swr"

export function AppSidebar() {
  async function getOrg() {
    const { data, error } = await authClient.organization.getFullOrganization();

    if (error) throw error;
    return data
  }

  const { data: organizationSession, error } = useSWR("org", getOrg)

  const inventoryItems = [
    {
      title: "Bodegas",
      url: "/workspace/warehouses",
      icon: WarehouseIcon,
    },
    {
      title: "Inventario",
      url: "/workspace/inventory",
      icon: PackageIcon,
    },
    {
      title: "Movimientos",
      url: "/workspace/movements",
      icon: CombineIcon,
    },
    {
      title: "Servicios",
      url: "/workspace/my-services",
      icon: HandPlatterIcon,
    },
  ];

  const workspaceItems = [
    {
      title: "Usuarios",
      url: "/workspace/users",
      icon: IdCardLanyardIcon,
    },
    {
      title: "Suscripción",
      url: "/workspace/subscription",
      icon: LandmarkIcon,
    },
  ];

  const operationItems = [
    {
      title: "Cotizaciones",
      url: "/workspace/quotes",
      icon: MailCheckIcon,
    },
    {
      title: "Reportes",
      url: "/workspace/reports",
      icon: ChartPieIcon,
    },
    {
      title: "Ventas",
      url: "/workspace/sales",
      icon: PercentIcon,
    },
  ];

  return (
    <Sidebar variant="inset" className="font-sans">
      <SidebarHeader>
        <SidebarMenu>
          <div>
            {
              error ? <span>No organization</span> : <span>{organizationSession?.name}</span>
            }
          </div>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Inventario</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {inventoryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Operaciones</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {operationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Organización</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {workspaceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
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
