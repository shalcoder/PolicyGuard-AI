"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { AlertTriangle, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { toast } from 'sonner'

interface SelfHealingModalProps {
    open: boolean
    onClose: () => void
    violation: {
        type: string
        agent: string
        details: string
    }
    patchedPrompt: string
    onConfirm: () => Promise<void>
}

export function SelfHealingModal({
    open,
    onClose,
    violation,
    patchedPrompt,
    onConfirm
}: SelfHealingModalProps) {
    const [understood, setUnderstood] = useState(false)
    const [isHealing, setIsHealing] = useState(false)
    const [healingComplete, setHealingComplete] = useState(false)
    const [healingFailed, setHealingFailed] = useState(false)

    const handleConfirm = async () => {
        if (!understood) {
            toast.error('Please confirm you understand the changes')
            return
        }

        setIsHealing(true)
        try {
            await onConfirm()
            setHealingComplete(true)
            toast.success('Self-healing completed successfully!')

            // Auto-close after 2 seconds
            setTimeout(() => {
                onClose()
                resetState()
            }, 2000)
        } catch (error) {
            setHealingFailed(true)
            toast.error('Self-healing failed: ' + (error as Error).message)
        } finally {
            setIsHealing(false)
        }
    }

    const resetState = () => {
        setUnderstood(false)
        setIsHealing(false)
        setHealingComplete(false)
        setHealingFailed(false)
    }

    const handleClose = () => {
        if (!isHealing) {
            onClose()
            resetState()
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {healingComplete ? (
                            <>
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                Self-Healing Complete
                            </>
                        ) : healingFailed ? (
                            <>
                                <XCircle className="w-5 h-5 text-red-600" />
                                Self-Healing Failed
                            </>
                        ) : (
                            <>
                                <AlertTriangle className="w-5 h-5 text-orange-600" />
                                Confirm Self-Healing
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        {healingComplete
                            ? 'The agent has been successfully patched with new guardrails.'
                            : healingFailed
                                ? 'Failed to deploy the patch. Please try again or contact support.'
                                : 'Review the proposed patch before deploying to your agent.'}
                    </DialogDescription>
                </DialogHeader>

                {!healingComplete && !healingFailed && (
                    <div className="space-y-4">
                        {/* Violation Details */}
                        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <h4 className="font-semibold text-red-900 dark:text-red-300 mb-2">
                                Vulnerability Detected
                            </h4>
                            <div className="text-sm text-red-800 dark:text-red-400 space-y-1">
                                <p><strong>Type:</strong> {violation.type}</p>
                                <p><strong>Agent:</strong> {violation.agent}</p>
                                <p><strong>Details:</strong> {violation.details}</p>
                            </div>
                        </div>

                        {/* Proposed Patch */}
                        <div className="space-y-2">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                Proposed Patch:
                            </h4>
                            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg max-h-64 overflow-y-auto">
                                <pre className="text-sm whitespace-pre-wrap">
                                    <code>{patchedPrompt}</code>
                                </pre>
                            </div>
                        </div>

                        {/* Confirmation Checkbox */}
                        <div className="flex items-start space-x-2 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <Checkbox
                                id="understand"
                                checked={understood}
                                onCheckedChange={(checked) => setUnderstood(checked as boolean)}
                                disabled={isHealing}
                            />
                            <label
                                htmlFor="understand"
                                className="text-sm text-yellow-900 dark:text-yellow-300 cursor-pointer leading-relaxed"
                            >
                                I understand this will modify the agent's system prompt and deploy the patch immediately.
                                This action cannot be undone automatically.
                            </label>
                        </div>
                    </div>
                )}

                {healingComplete && (
                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
                        <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                        <p className="text-green-900 dark:text-green-300 font-medium">
                            Patch deployed successfully!
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-400 mt-2">
                            Your agent is now protected against this vulnerability.
                        </p>
                    </div>
                )}

                {healingFailed && (
                    <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
                        <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                        <p className="text-red-900 dark:text-red-300 font-medium">
                            Failed to deploy patch
                        </p>
                        <p className="text-sm text-red-700 dark:text-red-400 mt-2">
                            Please check your agent's connection and try again.
                        </p>
                    </div>
                )}

                <DialogFooter>
                    {!healingComplete && !healingFailed && (
                        <>
                            <Button
                                variant="outline"
                                onClick={handleClose}
                                disabled={isHealing}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirm}
                                disabled={!understood || isHealing}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                                {isHealing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Deploying Patch...
                                    </>
                                ) : (
                                    'Confirm & Heal'
                                )}
                            </Button>
                        </>
                    )}
                    {(healingComplete || healingFailed) && (
                        <Button onClick={handleClose}>
                            Close
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
