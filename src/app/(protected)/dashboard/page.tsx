import { checkRole } from "@/lib/auth-check"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardLayout } from "@/components/dashboard/layout"
import { Button } from "@/components/ui/button"
import { PlusCircle,SettingsIcon } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await checkRole()

  const butons = [
    {
      label: "Create Post",
      href: "/dashboard/posts",
      icon: PlusCircle,
      description: "Create a new post",
      hide: session.user.role !== "WRITER" && session.user.role !== "ADMIN",
      path: "/dashboard/posts",
    },
    {
      label: "Manage Applications",
      href: "/dashboard/manage",
      icon: SettingsIcon,
      description: "Manage your applications",
      hide: session.user.role !== "ADMIN",
      path: "/dashboard/manage",
    },
  ]
  return (
    <DashboardLayout
      title="Use some of the features below"
      illustration={
        <div className="flex flex-col gap-4">
          <video src="/hero-illustration.mp4" autoPlay muted playsInline className="w-full h-full object-cover rounded-lg" />
        </div>
      }
      header={
        <DashboardHeader
          name={session.user.name}
          role={session.user.role}
          email={session.user.email}
        />
      }

    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3">

        {
          butons.map((button) => (
            button.hide ? null : (
              <Button key={button.label} variant="outline" className="">
                <Link href={button.path}>
                  <div className="flex items-center">
                    <span className="mr-2 font-bold">
                      <button.icon className="h-4 w-4" />
                    </span>
                    <div className="flex flex-col">
                      <span className="font-bold">
                        {button.label}
                      </span>
                      <div className="text-xs text-muted-foreground">
                        {button.description}
                      </div>
                    </div>
                  </div>

                </Link>
              </Button>
            ))
          )
        }
      </div>
    </DashboardLayout>
  )
} 