import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Bell, Lock, User, Palette, Shield, Trash2, Mail, Globe } from "lucide-react";

import { PageShell } from "@/components/site-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth, useUpdateProfile } from "@/hooks/use-auth";

export default function Settings() {
  const navigate = useNavigate();
  const { data: user, isLoading } = useAuth();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  // Account
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setHandle(user.username || "");
      setBio(user.bio || "");
      setAvatar(user.avatar || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // Password
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  // Notifications
  const [notif, setNotif] = useState({
    emailDigest: true,
    newFollower: true,
    responses: true,
    claps: false,
    mentions: true,
    marketing: false,
  });

  // Preferences
  const [prefs, setPrefs] = useState({
    darkMode: false,
    publicProfile: true,
    showReadingHistory: false,
    allowIndexing: true,
  });

  function saveAccount(e: React.FormEvent) {
    e.preventDefault();
    updateProfile({
      name,
      username: handle,
      bio,
      avatar,
      email,
    });
  }

  function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPw.length < 8) return toast.error("Password must be at least 8 characters");
    if (newPw !== confirmPw) return toast.error("Passwords don't match");
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
    toast.success("Password updated");
  }

  if (isLoading) {
    return (
      <PageShell>
        <div className="container-wide py-12 text-center">
          Loading settings...
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="container-wide max-w-5xl py-10">
        <h1 className="font-serif text-4xl font-semibold">Settings</h1>
        <p className="mt-2 text-muted-foreground">Manage your account, security, and preferences.</p>

        <Tabs defaultValue="account" className="mt-8">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="account"><User className="mr-1.5 h-4 w-4" />Account</TabsTrigger>
            <TabsTrigger value="security"><Lock className="mr-1.5 h-4 w-4" />Security</TabsTrigger>
            <TabsTrigger value="notifications"><Bell className="mr-1.5 h-4 w-4" />Notifications</TabsTrigger>
            <TabsTrigger value="preferences"><Palette className="mr-1.5 h-4 w-4" />Preferences</TabsTrigger>
            <TabsTrigger value="danger"><Shield className="mr-1.5 h-4 w-4" />Danger zone</TabsTrigger>
          </TabsList>

          {/* Account */}
          <TabsContent value="account" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Public profile</CardTitle>
                <CardDescription>How you appear across Prosely.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={saveAccount} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={avatar} alt={name} />
                      <AvatarFallback>{name[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => {
                        const url = window.prompt("New avatar image URL", avatar);
                        if (url) setAvatar(url);
                      }}>Change photo</Button>
                      <Button type="button" variant="ghost" size="sm" onClick={() => setAvatar(user?.avatar || "")}>Reset</Button>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Display name">
                      <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </Field>
                    <Field label="Username">
                      <div className="flex items-center rounded-md border border-input bg-background focus-within:ring-1 focus-within:ring-ring">
                        <span className="pl-3 text-sm text-muted-foreground">@</span>
                        <Input value={handle} onChange={(e) => setHandle(e.target.value.replace(/[^a-z0-9_]/gi, "").toLowerCase())} className="border-0 focus-visible:ring-0" />
                      </div>
                    </Field>
                    <Field label="Email">
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" />
                      </div>
                    </Field>
                    <Field label="Website">
                      <div className="relative">
                        <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="https://" className="pl-9" />
                      </div>
                    </Field>
                  </div>

                  <Field label="Bio" hint={`${bio.length}/280`}>
                    <Textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value.slice(0, 280))} />
                  </Field>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={() => navigate({ to: "/profile" })}>Cancel</Button>
                    <Button type="submit" className="rounded-full">Save changes</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Change password</CardTitle>
                <CardDescription>Use at least 8 characters with a mix of letters and numbers.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={savePassword} className="space-y-4 max-w-md">
                  <Field label="Current password">
                    <Input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} />
                  </Field>
                  <Field label="New password">
                    <Input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
                  </Field>
                  <Field label="Confirm new password">
                    <Input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} />
                  </Field>
                  <div className="flex justify-end">
                    <Button type="submit" className="rounded-full">Update password</Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-factor authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Authenticator app</div>
                  <p className="text-sm text-muted-foreground">Use an app like 1Password or Authy.</p>
                </div>
                <Button variant="outline" onClick={() => toast.success("2FA setup started")}>Enable</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active sessions</CardTitle>
                <CardDescription>Devices currently signed in to your account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { device: "MacBook Pro · Chrome", location: "Berlin, DE", current: true },
                  { device: "iPhone 15 · Safari", location: "Berlin, DE", current: false },
                ].map((s) => (
                  <div key={s.device} className="flex items-center justify-between rounded-md border border-border/60 p-3">
                    <div>
                      <div className="font-medium">{s.device} {s.current && <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">This device</span>}</div>
                      <div className="text-xs text-muted-foreground">{s.location}</div>
                    </div>
                    {!s.current && <Button variant="ghost" size="sm" onClick={() => toast.success("Session revoked")}>Revoke</Button>}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Email notifications</CardTitle>
                <CardDescription>Choose what you want to hear about.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                {[
                  { key: "emailDigest", label: "Weekly digest", desc: "Top stories from writers you follow." },
                  { key: "newFollower", label: "New followers", desc: "When someone follows you." },
                  { key: "responses", label: "Responses", desc: "Replies to your stories and comments." },
                  { key: "claps", label: "Claps", desc: "When readers clap for your stories." },
                  { key: "mentions", label: "Mentions", desc: "When you're @mentioned." },
                  { key: "marketing", label: "Product updates", desc: "News and tips from Prosely." },
                ].map((n) => (
                  <div key={n.key} className="flex items-center justify-between border-b border-border/60 py-3 last:border-0">
                    <div>
                      <div className="font-medium">{n.label}</div>
                      <div className="text-sm text-muted-foreground">{n.desc}</div>
                    </div>
                    <Switch
                      checked={notif[n.key as keyof typeof notif]}
                      onCheckedChange={(v) => setNotif({ ...notif, [n.key]: v })}
                    />
                  </div>
                ))}
                <div className="flex justify-end pt-4">
                  <Button className="rounded-full" onClick={() => toast.success("Preferences saved")}>Save preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences */}
          <TabsContent value="preferences" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Reading & privacy</CardTitle>
                <CardDescription>Personalize how Prosely works for you.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                {[
                  { key: "darkMode", label: "Dark mode", desc: "Use the dark theme across Prosely." },
                  { key: "publicProfile", label: "Public profile", desc: "Anyone can view your profile page." },
                  { key: "showReadingHistory", label: "Show reading history", desc: "Display recently read stories on your profile." },
                  { key: "allowIndexing", label: "Allow search engines", desc: "Let Google and others index your stories." },
                ].map((p) => (
                  <div key={p.key} className="flex items-center justify-between border-b border-border/60 py-3 last:border-0">
                    <div>
                      <div className="font-medium">{p.label}</div>
                      <div className="text-sm text-muted-foreground">{p.desc}</div>
                    </div>
                    <Switch
                      checked={prefs[p.key as keyof typeof prefs]}
                      onCheckedChange={(v) => setPrefs({ ...prefs, [p.key]: v })}
                    />
                  </div>
                ))}
                <div className="flex justify-end pt-4">
                  <Button className="rounded-full" onClick={() => toast.success("Preferences saved")}>Save preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Danger */}
          <TabsContent value="danger" className="mt-6 space-y-6">
            <Card className="border-destructive/40">
              <CardHeader>
                <CardTitle>Deactivate account</CardTitle>
                <CardDescription>Temporarily hide your profile and stories.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">You can reactivate at any time by signing back in.</p>
                <Button variant="outline" onClick={() => toast.success("Account deactivated")}>Deactivate</Button>
              </CardContent>
            </Card>

            <Card className="border-destructive/40">
              <CardHeader>
                <CardTitle className="text-destructive">Delete account</CardTitle>
                <CardDescription>Permanently delete your account and all your stories. This cannot be undone.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">All data will be removed within 30 days.</p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive"><Trash2 className="mr-1.5 h-4 w-4" />Delete account</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete your profile, stories, drafts, and followers. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => { toast.success("Account scheduled for deletion"); navigate({ to: "/login" }); }}
                      >
                        Yes, delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="mt-8 text-sm text-muted-foreground">
          Looking for something else? <Link to="/profile" className="underline">Go to your profile</Link>.
        </p>
      </div>
    </PageShell>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <Label>{label}</Label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
