"use client"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { useBreadcrumbs } from "@/hooks/use-breadcrumb"
import Link from "next/link"
import { Home } from "lucide-react"
import React from "react"

export const BreadcrumbNav = () => {
    const items = useBreadcrumbs({
        pathLabels: {
            "/dashboard": "Dashboard",
            "/dashboard/settings": "Settings",
            // Add more custom labels as needed
        },
        excludePaths: ["/auth", "/api"],
        rootPath: "/dashboard"
    })

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <Home className="h-4 w-4" />
                            Dashboard
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {items.map((item, index) => (
                    <React.Fragment key={item.href}>
                        <BreadcrumbSeparator key={`sep-${item.href}`} />
                        <BreadcrumbItem key={item.href}>
                            {index === items.length - 1 ? (
                                <BreadcrumbPage>{item.label}</BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink asChild>
                                    <Link href={item.href}>{item.label}</Link>
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
} 