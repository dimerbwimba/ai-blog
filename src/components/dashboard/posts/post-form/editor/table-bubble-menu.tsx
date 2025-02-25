"use client"

import { BubbleMenu, Editor } from '@tiptap/react'
import {
    Trash2,
    ArrowUpFromLine,
    RowsIcon,
    ColumnsIcon,
    ChevronUp,
    ChevronDown,
    X,
    ChevronRight,
    ChevronLeft,
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { EditorState } from 'prosemirror-state'

interface TableBubbleMenuProps {
    editor: Editor
    shouldShow?: (props: { editor: Editor; state: EditorState; from: number; to: number }) => boolean
}

export function TableBubbleMenu({ editor, shouldShow }: TableBubbleMenuProps) {
    if (!editor) return null

    const handleDeleteTable = (e: React.MouseEvent) => {
        e.preventDefault()
        editor.chain().focus().deleteTable().run()
    }

    const handleToggleHeaderRow = (e: React.MouseEvent) => {
        e.preventDefault()
        editor.chain().focus().toggleHeaderRow().run()
    }

    const handleAddRowBefore = (e: React.MouseEvent) => {
        e.preventDefault()
        editor.chain().focus().addRowBefore().run()
    }

    const handleAddRowAfter = (e: React.MouseEvent) => {
        e.preventDefault()
        editor.chain().focus().addRowAfter().run()
    }

    const handleDeleteRow = (e: React.MouseEvent) => {
        e.preventDefault()
        editor.chain().focus().deleteRow().run()
    }

    const handleAddColumnBefore = (e: React.MouseEvent) => {
        e.preventDefault()
        editor.chain().focus().addColumnBefore().run()
    }
    const handleAddColumnAfter = (e: React.MouseEvent) => {
        e.preventDefault()
        editor.chain().focus().addColumnAfter().run()
    }

    const handleDeleteColumn = (e: React.MouseEvent) => {
        e.preventDefault()
        editor.chain().focus().deleteColumn().run()
    }

    return (
        <TooltipProvider>
            <BubbleMenu
                className="flex space-x-2 overflow-hidden rounded-lg border border-border bg-background shadow-md"
                editor={editor}
                shouldShow={shouldShow}
                tippyOptions={{ duration: 100 }}
            >
                {/* Header Toggle */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={handleToggleHeaderRow}
                        >
                            <ArrowUpFromLine className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Toggle Header Row</TooltipContent>
                </Tooltip>

                <Separator orientation="vertical" className="h-8" />
                {/*add a row*/}
                <div className="flex flex-col">
                    <Button
                        disabled
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                    >
                        <RowsIcon className="h-4 w-4" />
                    </Button>
                </div>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button onClick={handleAddRowBefore} type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ChevronUp className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add a Row Up</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button onClick={handleAddRowAfter} type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add a Row Down</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button onClick={handleDeleteRow} type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <X className="h-4 w-4" />
                        </Button>

                    </TooltipTrigger>
                </Tooltip>
                <Separator orientation="vertical" className="h-8" />
                {/*add a column*/}
                <div className="flex flex-col">
                    <Button
                        disabled
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                    >
                        <ColumnsIcon className="h-4 w-4" />
                    </Button>
                </div>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button onClick={handleAddColumnBefore} type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add a Column Left</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button onClick={handleAddColumnAfter} type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                        <TooltipContent>Add a Column Right</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button onClick={handleDeleteColumn} type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <X className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                </Tooltip>
                {/* Delete Table */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive"
                            onClick={handleDeleteTable}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete Table</TooltipContent>
                </Tooltip>
            </BubbleMenu>
        </TooltipProvider>
    )
} 