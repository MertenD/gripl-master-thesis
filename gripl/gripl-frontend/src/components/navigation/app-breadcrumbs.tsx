"use client"

import {usePathname} from "next/navigation";
import {generateBreadcrumbs} from "@/lib/breadcrumbs";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator} from "@/components/ui/breadcrumb";
import Link from "next/link";
import {useEffect, useState} from "react";
import {Crumb} from "@/models/Crumb";
import {EvaluationData} from "@/models/dto/EvaluationData";

const nameMap = {
    "": 'Sandbox',
    labeling: "Labeling",
    thesis: "Thesis",
}

export default function AppBreadCrumbs() {

    const pathname = usePathname()
    const [crumbs, setCrumbs] = useState<Crumb[]>(generateBreadcrumbs(pathname, nameMap))

    useEffect(() => {

        const newCrumbs = generateBreadcrumbs(pathname, nameMap);

        // If the user is on the labeling page and has a test case selected the name of the test case should be displayed instead of the id
        if (newCrumbs[0].label === nameMap["labeling"] && newCrumbs.length === 2) {
            fetch(`/api/dataset/testcase/${newCrumbs[1].label}`).then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch test case with id ${newCrumbs[1].label}: ${response.statusText}`);
                }
                return response.json()
            }).then((data: EvaluationData) => {
                const updatedCrumbs = newCrumbs.map((crumb, index) => {
                    if (index === 1) {
                        return {
                            ...crumb,
                            label: `${data.name} (${data.id})`,
                        };
                    }
                    return crumb;
                });
                setCrumbs(updatedCrumbs);
            }).catch(error => {
                console.error("Error fetching dataset name:", error);
                setCrumbs(newCrumbs)
            })
            return
        }

        setCrumbs(newCrumbs)
    }, [pathname])

    return <Breadcrumb>
        <BreadcrumbList>
            <>
            {crumbs.map((crumb, index) => <>
                <BreadcrumbItem key={index}>
                    <Link href={crumb.href}>{crumb.label}</Link>
                </BreadcrumbItem>
                { index < crumbs.length - 1 && <BreadcrumbSeparator /> }
            </> )}
            </>
        </BreadcrumbList>
    </Breadcrumb>
}