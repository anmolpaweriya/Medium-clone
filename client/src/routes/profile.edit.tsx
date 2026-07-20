import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ArrowLeft, Camera } from "lucide-react";

import { PageShell } from "@/components/site-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth, useUpdateProfile } from "@/hooks/use-auth";

export const Route = createFileRoute("/profile/edit")({
  head: () => ({ meta: [{ title: "Edit profile — Prosely" }] }),
  component: EditProfile,
});

function EditProfile() {
  const navigate = useNavigate();
  const { data: user, isLoading } = useAuth();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

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
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [twitter, setTwitter] = useState("");

  function save(e: React.FormEvent) {
    e.preventDefault();
    updateProfile({
      name,
      username: handle,
      bio,
      avatar,
      email,
    }, {
      onSuccess: () => navigate({ to: "/profile" }),
    });
  }

  if (isLoading) {
    return (
      <PageShell>
        <div className="container-prose py-20 text-center">
          Loading...
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="container-prose py-10">
        <button
          onClick={() => navigate({ to: "/profile" })}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to profile
        </button>

        <h1 className="font-serif text-4xl font-semibold">Edit profile</h1>
        <p className="mt-2 text-muted-foreground">Update how you appear across Prosely.</p>

        <form onSubmit={save} className="mt-10 space-y-8">
          {/* Avatar */}
          <section className="flex items-center gap-6 rounded-xl border border-border/60 bg-card p-6">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback>{name[0] || "U"}</AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => {
                  const url = window.prompt("New avatar image URL", avatar);
                  if (url) setAvatar(url);
                }}
                className="absolute -bottom-1 -right-1 rounded-full bg-foreground p-1.5 text-background shadow"
                aria-label="Change avatar"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div>
              <div className="font-semibold">Profile photo</div>
              <p className="text-sm text-muted-foreground">A square image works best. PNG or JPG.</p>
            </div>
          </section>

          {/* Basics */}
          <section className="space-y-4 rounded-xl border border-border/60 bg-card p-6">
            <h2 className="font-serif text-xl font-semibold">Basics</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Display name">
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </Field>
              <Field label="Username" hint="prosely.dev/@handle">
                <div className="flex items-center rounded-md border border-input bg-background focus-within:ring-1 focus-within:ring-ring">
                  <span className="pl-3 text-sm text-muted-foreground">@</span>
                  <Input
                    value={handle}
                    onChange={(e) => setHandle(e.target.value.replace(/[^a-z0-9_]/gi, "").toLowerCase())}
                    className="border-0 focus-visible:ring-0"
                    required
                  />
                </div>
              </Field>
            </div>
            <Field label="Bio" hint={`${bio.length}/280`}>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value.slice(0, 280))} rows={4} />
            </Field>
          </section>

          {/* Contact & links */}
          <section className="space-y-4 rounded-xl border border-border/60 bg-card p-6">
            <h2 className="font-serif text-xl font-semibold">Contact & links</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
              <Field label="Location"><Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Berlin, DE" /></Field>
              <Field label="Website"><Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" /></Field>
              <Field label="Twitter / X"><Input value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="@handle" /></Field>
            </div>
          </section>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => navigate({ to: "/profile" })}>Cancel</Button>
            <Button type="submit" className="rounded-full">Save changes</Button>
          </div>
        </form>
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
