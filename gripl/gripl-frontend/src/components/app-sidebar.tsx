import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu, SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar";
import Link from "next/link";
import {Newspaper, Tag, Workflow} from "lucide-react";
import {ReactNode} from "react";
import Image from "next/image";

interface Page {
    href: string;
    label: string;
    icon: ReactNode;
}

export default function AppSidebar() {

    const pages = [
        {
            href: "/",
            label: "Modeling",
            icon: <Workflow />
        },
        {
            href: "/labeling",
            label: "Labeling",
            icon: <Tag />
        },
        {
            href: "/thesis",
            label: "Thesis",
            icon: <Newspaper />
        }
    ] as Page[]

    return <Sidebar>
        <SidebarHeader className="flex flex-row justify-start items-center space-x-2 pb-4">
            <Image src="/icon.png" alt="GRIPL App Icon" width={10} height={10} className="w-10 h-10" />
            <h1 className="text-lg font-semibold">GRIPL</h1>
        </SidebarHeader>
        <SidebarContent className="p-2">
            <SidebarMenu>
                { pages.map((page) => {
                    return <SidebarMenuItem key={page.href}>
                        <SidebarMenuButton asChild>
                            <Link href={page.href}>
                                { page.icon }
                                <p>{page.label}</p>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                })}
            </SidebarMenu>
        </SidebarContent>
        <SidebarFooter />
    </Sidebar>
}