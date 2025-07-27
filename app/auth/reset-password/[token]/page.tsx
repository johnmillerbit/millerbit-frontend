"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lock, Loader2, CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from 'next/link';

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Password reset token is missing.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password.');
      }

      setMessage(data.message || 'Your password has been reset successfully. You can now log in with your new password.');
      setTimeout(() => {
        router.push('/admin/login');
      }, 3000); // Redirect to login after 3 seconds
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-60 h-60 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <Card className="w-full max-w-md bg-white/5 backdrop-blur-xl border-white/10 text-white rounded-2xl shadow-2xl relative z-10">
        <CardHeader className="text-center border-b border-white/10 pb-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
              <Lock className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            Reset Password
          </CardTitle>
          <CardDescription className="text-slate-400 mt-2">
            Enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="password" className="text-slate-300 flex items-center gap-2 font-medium">
                <Lock className="h-4 w-4 text-blue-400" />
                New Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 rounded-xl h-12"
                placeholder="Enter your new password"
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="confirmPassword" className="text-slate-300 flex items-center gap-2 font-medium">
                <Lock className="h-4 w-4 text-blue-400" />
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 rounded-xl h-12"
                placeholder="Confirm your new password"
                required
              />
            </div>

            {message && (
              <Alert className="bg-green-900/20 border-green-500/30 text-green-200 animate-in slide-in-from-top duration-300">
                <CheckCircle className="h-4 w-4 text-green-300" />
                <AlertTitle className="text-green-100">Success</AlertTitle>
                <AlertDescription className="text-green-200">{message}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive" className="bg-red-900/20 border-red-500/30 text-red-200 animate-in slide-in-from-top duration-300">
                <AlertTriangle className="h-4 w-4 text-red-300" />
                <AlertTitle className="text-red-100">Error</AlertTitle>
                <AlertDescription className="text-red-200">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={loading || !token}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 rounded-xl h-12 font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5 mr-2" />
                  Reset Password
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/admin/login" passHref>
              <Button variant="link" className="text-blue-300 hover:text-white transition-colors duration-300">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
