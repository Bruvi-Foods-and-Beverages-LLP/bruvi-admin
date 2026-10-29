"use client";

import { useState } from "react";
import { useAppStore } from "@/stores/use-app-store";
import { useAuthStore } from "@/stores/use-auth-store";
import { AdminAuthClient } from "@/features/auth/api/auth-client";
import { Lock, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Figma AS05: Session Timeout with Form Preservation
 * Prompts user to re-authenticate without reloading the page or clearing uncommitted form state.
 */
export function SessionTimeoutModal() {
  const isSessionExpired = useAppStore((s) => s.isSessionExpired);
  const setSessionExpired = useAppStore((s) => s.setSessionExpired);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const setAuth = useAuthStore((s) => s.setAuth);

  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isSessionExpired) return null;

  const userEmail = user?.email || "admin@bruvi.coffee";

  const handleReauth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const auth = await AdminAuthClient.login(userEmail, password, true);
      setAuth(auth);
      setSessionExpired(false);
      setPassword("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid password. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    setSessionExpired(false);
    await logout();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-800">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text">Session Timed Out</h3>
            <p className="text-xs text-text-muted">Idle timeout · Form drafts preserved</p>
          </div>
        </div>

        <div className="rounded-lg bg-bg-subtle p-3 mb-4 text-xs text-text-secondary flex items-start space-x-2">
          <ShieldAlert className="h-4 w-4 text-brand-navy shrink-0 mt-0.5" />
          <div>
            <p>
              Your active inputs and draft modifications will not be lost. Re-authenticate as{" "}
              <strong className="text-text font-semibold">{userEmail}</strong> to resume your session.
            </p>
          </div>
        </div>

        <form onSubmit={handleReauth} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text mb-1" htmlFor="reauth-pass">
              Corporate Password
            </label>
            <Input
              id="reauth-pass"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
            />
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting || !password}>
              {isSubmitting ? "Verifying..." : "Unlock & Continue"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

