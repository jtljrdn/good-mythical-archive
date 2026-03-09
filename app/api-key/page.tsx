"use client";

import { useState } from "react";
import { Key, Copy, Check, Terminal, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ApiKeyPage() {
  const [name, setName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCreate() {
    if (!name.trim()) return;

    setLoading(true);
    setError(null);
    setGeneratedKey(null);

    try {
      const res = await fetch("/api/api-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to create API key");
        return;
      }

      setGeneratedKey(data.key);
      setName("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!generatedKey) return;
    navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-2xl flex-col justify-center px-4 py-12">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
            <Key className="size-4.5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">API Access</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Generate an API key to access the Good Mythical Archive REST API. Keys
          are free and don't require an account.
        </p>
      </div>

      {/* Key creation */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create a new key</CardTitle>
          <CardDescription>
            Give your key a name so you can identify it later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreate();
            }}
            className="flex gap-2"
          >
            <Input
              placeholder="e.g. my-app"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? "Creating..." : "Generate"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Card className="mb-6 border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-center gap-2 text-sm text-destructive">
            <AlertTriangle className="size-4 shrink-0" />
            {error}
          </CardContent>
        </Card>
      )}

      {/* Generated key */}
      {generatedKey && (
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Check className="size-4" />
              Key created
            </CardTitle>
            <CardDescription>
              Copy your key now. You won&apos;t be able to see it again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <code className="flex-1 overflow-x-auto rounded-md bg-muted px-3 py-2 font-mono text-xs select-all">
                {generatedKey}
              </code>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                aria-label="Copy API key"
              >
                {copied ? (
                  <Check className="size-4 text-primary" />
                ) : (
                  <Copy className="size-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage example */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="size-4" />
            Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-md bg-muted px-4 py-3 font-mono text-xs leading-relaxed">
            <span className="text-muted-foreground">
              {"# Fetch episodes\n"}
            </span>
            {"curl -H "}
            <span className="text-primary">
              {'"Authorization: Bearer YOUR_API_KEY"'}
            </span>
            {" \\\n  "}
            <span className="text-muted-foreground">
              {`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"}/api/gmm/videos`}
            </span>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
