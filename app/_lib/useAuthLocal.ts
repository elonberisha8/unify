"use client";
// Stub lokal për @clerk/nextjs — përdoret gjatë zhvillimit
export function useAuth() {
  const isSignedIn =
    typeof window !== "undefined" && Boolean(localStorage.getItem("authToken"));
  return {
    isSignedIn,
    userId: isSignedIn ? "demo-user" : null,
    getToken: async () =>
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null,
  };
}

export function useUser() {
  const isSignedIn =
    typeof window !== "undefined" && Boolean(localStorage.getItem("authToken"));
  return {
    isSignedIn,
    isLoaded: true,
    user: isSignedIn ? { id: "demo-user", fullName: "Demo User" } : null,
  };
}

