"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { AlertTriangle, Settings2 } from "lucide-react"
import { UseFormReturn } from "react-hook-form"

interface PostFormSettingsProps {
  form: UseFormReturn<any>
}

function checkErrors(form: UseFormReturn<any>) {  
    const statusError = form.formState.errors.status
    const featuredError = form.formState.errors.featured
    return !!(statusError || featuredError)
}

export function PostFormSettings({ form }: PostFormSettingsProps) {
    const hasErrors = checkErrors(form)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={hasErrors ? "destructive" : "outline"} className="w-full h-10">
          <Settings2 className="w-4 h-4 mr-2" />
          <div>
            Post Settings {hasErrors ? <AlertTriangle className="w-4 h-4 ml-2" /> : ''}
           
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Post Settings</DialogTitle>
          <DialogDescription>
            Configure your post settings and publishing options
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center gap-4">
          <div className="grid max-w-lg gap-6 py-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    value={field.value} 
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFTED">DRAFTED</SelectItem>
                      <SelectItem value="PUBLISHED">PUBLISHED</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Set the current status of your post
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Featured Post
                    </FormLabel>
                    <FormDescription>
                      Display this post in featured sections
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}