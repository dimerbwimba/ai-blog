import { checkRole } from "@/lib/auth-check"
import { DashboardLayout } from "@/components/dashboard/layout"
import { SettingsForm } from "@/components/forms/settings-form"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default async function SettingsPage() {
  const session = await checkRole()

  return (
    <DashboardLayout
      header={
        <div></div>
      }
      title="Personalize your account"
    >
      <div >
        {/*tabs*/}
        <div>
          <Tabs defaultValue="overview">
            <TabsList className="w-full">
              <TabsTrigger className="w-full" value="overview">Overview</TabsTrigger>
              <TabsTrigger className="w-full" value="account">Account</TabsTrigger>
            </TabsList>
            <TabsContent className="w-full" value="overview">
              <div className="flex flex-col gap-4 border rounded-lg p-4">
                <h1 className="text-2xl text-center font-bold">Overview</h1>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-semibold">Account Settings</h2>
                    <p className="text-sm text-muted-foreground">
                      Manage your account settings and preferences.
                    </p>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <div className="rounded-lg bg-green-500 text-white border p-4">
                        <h3 className="font-bold">Profile Information</h3>
                        <p className="text-sm text-white mt-1">
                          Update your name, email and profile picture in the Account tab
                        </p>
                      </div>
                      <div className="rounded-lg bg-red-500 text-white border p-4">
                        <h3 className="font-bold">Security</h3>
                        <p className="text-sm text-white mt-1">
                          Manage your password and account security settings in the Password tab
                        </p>
                      </div>
                      <div className="rounded-lg bg-blue-500 text-white border p-4">
                        <h3 className=" font-bold">Preferences</h3>
                        <p className="text-sm text-white mt-1">
                          Set your notification preferences and account display options
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-semibold">Account Status</h2>
                    <p className="text-sm text-muted-foreground">
                      Your account is active and in good standing
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="account">
              <SettingsForm
                initialData={{
                  name: session.user.name,
                  email: session.user.email,
                  image: session.user.image,
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
} 