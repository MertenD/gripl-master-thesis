import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu, SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar";
import Link from "next/link";
import {BookA, ChartBarDecreasing, Newspaper, Tag, Workflow} from "lucide-react";
import React, {ReactNode} from "react";
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
            label: "Sandbox",
            icon: <Workflow />
        },
        {
            href: "/labeling",
            label: "Labeling",
            icon: <Tag />
        },
        {
            href: "/evaluation",
            label: "Evaluation",
            icon: <ChartBarDecreasing />
        },
        {
            href: "/thesis",
            label: "Thesis",
            icon: <Newspaper />
        },
        {
            href: "/api-docs",
            label: "API Docs",
            icon: <BookA />
        }
    ] as Page[]

    return <Sidebar>
        <SidebarHeader className="flex flex-row justify-start items-center space-x-2 pl-3 pt-3">
            <Image src="/logo.png" alt="GRIPL App Icon" width={100} height={100} className="w-32 h-auto" />
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