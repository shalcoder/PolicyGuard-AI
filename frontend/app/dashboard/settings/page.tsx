"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Settings</h3>
                <p className="text-sm text-gray-500">
                    Manage your account settings and email preferences.
                </p>
            </div>
            <Separator />

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>API Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="gemini-key">Gemini API Key</Label>
                            <Input id="gemini-key" type="password" placeholder="******************" disabled defaultValue="AIzaSy...Configured" />
                            <p className="text-xs text-gray-500">Managed via environment variables (.env)</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Notification Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="email-alerts">Email Alerts on Policy Violation</Label>
                            <Button variant="outline" size="sm">Enabled</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
