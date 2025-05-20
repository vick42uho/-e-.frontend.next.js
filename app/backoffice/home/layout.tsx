import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./components/SideBar"
import { PageBreadcrumb } from "./components/PageBreadcrumb"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 overflow-hidden">
        <div className="p-4 pb-0">
          <SidebarTrigger className="mb-4" />
          <PageBreadcrumb />
        </div>
        <div className="h-[calc(100%-80px)]">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
