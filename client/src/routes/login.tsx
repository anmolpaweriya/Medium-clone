import { Link, useNavigate } from "react-router-dom";
import { Feather } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { getMe, login } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";

export default function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const { data } = await login(form);

      // Store only the JWT
      localStorage.setItem("token", data.token);

      // Fetch the current user and cache it
      await queryClient.fetchQuery({
        queryKey: ["me"],
        queryFn: async () => {
          const { data } = await getMe();
          return data;
        },
      });

      navigate("/feed");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="hidden bg-accent/60 md:flex md:flex-col md:justify-between md:p-12">
        <Link to="/" className="inline-flex items-center gap-2 text-lg">
          <Feather className="h-5 w-5 text-primary" />
          <span className="font-serif text-xl">Prosely</span>
        </Link>

        <div>
          <p className="font-serif text-4xl leading-tight">
            "Writing is the geometry of the soul. Read carefully. Write
            clearly."
          </p>

          <p className="mt-4 text-sm text-muted-foreground">
            — A quiet corner of the internet
          </p>
        </div>

        <span className="text-xs text-muted-foreground">
          © 2026 Prosely
        </span>
      </div>

      <div className="flex items-center justify-center p-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm space-y-6"
        >
          <div>
            <h1 className="font-serif text-3xl font-semibold">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to continue reading and writing.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>

            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>

            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full"
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link
              to="/register"
              className="text-foreground underline underline-offset-4"
            >
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
