'use client'

import { saveResponse } from '../actions/saveResponse'
import { getSaveState, SAVE_LABELS } from '../components/saveState'
import { useActionMutation } from '@/hooks/useActionMutation'
import { useUnsavedChangesGuard } from '@/hooks/useUnsavedChangesGuard'
import { type Dispatch, type SetStateAction, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

const REDIRECT_DELAY_MS = 600

type UseRespondFormOptions = {
    meetingShortId: string
    /** Set when editing an existing response. */
    editOriginalName?: string
    /** Selection keys of the response being edited; must be referentially stable (memoize it). */
    originalKeys?: string[]
    isOriginalLoading: boolean
    selected: Set<string>
    setSelected: Dispatch<SetStateAction<Set<string>>>
    /** Update the client cache after a successful save. */
    onSaved: (saved: { name: string; keys: string[] }) => void
}

/** Name, edit-mode setup, save and unsaved-changes handling shared by the respond pages. */
export const useRespondForm = ({
    meetingShortId,
    editOriginalName,
    originalKeys,
    isOriginalLoading,
    selected,
    setSelected,
    onSaved,
}: UseRespondFormOptions) => {
    const router = useRouter()
    const [name, setName] = useState<string>('')
    const [editInitialized, setEditInitialized] = useState<boolean>(false)
    const isEdit = !!editOriginalName

    if (!editInitialized && editOriginalName && !isOriginalLoading && originalKeys) {
        setEditInitialized(true)
        setName(editOriginalName)
        setSelected(new Set(originalKeys))
    }

    const saveMutation = useActionMutation({
        mutationFn: () =>
            saveResponse({
                meetingShortId,
                name,
                selection: Array.from(selected),
                edit: isEdit,
                newName: isEdit && name !== editOriginalName ? name : undefined,
            }),
        onSuccess: () => {
            onSaved({ name, keys: Array.from(selected) })
            setTimeout(() => router.push(`/m/${meetingShortId}`), REDIRECT_DELAY_MS)
        },
    })

    const hasName = name.trim().length > 0
    const isSaveLocked = saveMutation.isPending || saveMutation.isSuccess

    const isDirty = useMemo(() => {
        if (isSaveLocked) return false
        if (!editOriginalName) return hasName || selected.size > 0
        if (!editInitialized || !originalKeys) return false
        if (name !== editOriginalName) return true
        if (originalKeys.length !== selected.size) return true
        return originalKeys.some((key) => !selected.has(key))
    }, [name, hasName, selected, editOriginalName, originalKeys, editInitialized, isSaveLocked])

    useUnsavedChangesGuard(isDirty)

    // isDirty is already false while saving or after success, so this also blocks double saves.
    const canSave = hasName && isDirty && selected.size > 0

    const handleSave = () => {
        if (!canSave) return
        saveMutation.mutate()
    }

    const saveState = getSaveState(saveMutation)

    return {
        name,
        setName,
        handleSave,
        saveState,
        saveLabel: SAVE_LABELS[saveState],
        canSave,
    }
}

export type RespondForm = ReturnType<typeof useRespondForm>
