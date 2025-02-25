"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FolderIcon } from "lucide-react"
import { CategoriesList } from "./categories-list"
import { CategoryForm } from "./category-form"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function CategoriesOverview() {
  const [showNewCategoryDialog, setShowNewCategoryDialog] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">
            Manage your blog categories
          </p>
        </div>
        <Button onClick={() => setShowNewCategoryDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Category
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-4">
          <div className="space-y-2">
            <FolderIcon className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-medium">Active Categories</h3>
            <p className="text-sm text-muted-foreground">
              View and manage your active categories
            </p>
          </div>
        </Card>
      </div>

      <CategoriesList />

      <Dialog open={showNewCategoryDialog} onOpenChange={setShowNewCategoryDialog}>
        <DialogContent className="sm:max-w-[625px] h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Add a new category to organize your posts
            </DialogDescription>
          </DialogHeader>
          <div className="px-20">
            <CategoryForm onSuccess={() => setShowNewCategoryDialog(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 