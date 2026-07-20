import { Link, createFileRoute } from "@tanstack/react-router";
import { Feather } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { signup } from "@/lib/auth";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — Prosely" }] }),
  component: Register,
});



function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const { data } = await signup(form);

      localStorage.setItem("token", data.token);

      navigate({ to: "/feed" });
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <form onSubmit={handleSubmit}  className="w-full max-w-sm space-y-6">
          <Link to="/" className="inline-flex items-center gap-2">
            <Feather className="h-5 w-5 text-primary" />
            <span className="font-serif text-xl">Prosely</span>
          </Link>
          <div>
            <h1 className="font-serif text-3xl font-semibold">Create your account</h1>
            <p className="mt-2 text-sm text-muted-foreground">Read the best writing on the internet. Publish yours.</p>
          </div>
        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}
          <div className="space-y-2"><Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ada Lovelace"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>

            <Input
              id="username"
              name="username"
              placeholder="adalovelace"
              value={form.username}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2"><Label htmlFor="e">Email</Label>
            <Input
              id="e"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2"><Label htmlFor="p">Password</Label>
            <Input
              id="p"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Choose a strong password"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full"
          >
            {loading ? "Creating..." : "Create account"}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Already a member? <Link to="/login" className="text-foreground underline underline-offset-4">Sign in</Link>
          </div>
        </form>
      </div>
      <div className="hidden bg-accent/60 p-12 md:block">
        <img src="https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80" alt="" className="h-full w-full rounded-xl object-cover" />
      </div>
    </div>
  );
}
