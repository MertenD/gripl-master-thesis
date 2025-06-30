"use client"

import {usePathname} from "next/navigation";
import {generateBreadcrumbs} from "@/lib/breadcrumbs";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator} from "@/components/ui/breadcrumb";
import Link from "next/link";

export default function AppBreadCrumbs() {

    const pathname = usePathname()
    const crumbs = generateBreadcrumbs(pathname, {
        "": 'Modeling'
    })

    console.log("Breadcrumbs:", crumbs)

    return <Breadcrumb>
        <BreadcrumbList>
            {crumbs.map((crumb, index) => (
                <>
                    <BreadcrumbItem key={index}>
                        <Link href={crumb.href}>{crumb.label}</Link>
                    </BreadcrumbItem>
                    { index < crumbs.length - 1 && <BreadcrumbSeparator /> }
                </>
            ))}
        </BreadcrumbList>
    </Breadcrumb>
}