"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { Trip, Blog, NewTripInput } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

interface ActionResult {
  success: boolean;
  message?: string;
}

type AuthModalMode = "login" | "register";

interface TravelContextValue {
  trips: Trip[];
  blogs: Blog[];
  isLoadingTrips: boolean;
  isLoadingBlogs: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredTrips: Trip[];
  createTrip: (input: NewTripInput) => Promise<ActionResult>;
  joinTrip: (id: number) => Promise<void>;
  toggleLikeBlog: (id: number) => Promise<void>;
  isAuthModalOpen: boolean;
  authModalMode: AuthModalMode;
  openAuthModal: (mode?: AuthModalMode) => void;
  closeAuthModal: () => void;
  isCreateModalOpen: boolean;
  openCreateModal: () => void;
  closeCreateModal: () => void;
}

const TravelContext = createContext<TravelContextValue | undefined>(undefined);

export function TravelProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoadingTrips, setIsLoadingTrips] = useState(true);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>("login");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const openAuthModal = useCallback((mode: AuthModalMode = "login") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  }, []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  const openCreateModal = useCallback(() => {
    if (!user) {
      showToast("Log in to host a trip.", "info");
      openAuthModal("login");
      return;
    }
    setIsCreateModalOpen(true);
  }, [user, showToast, openAuthModal]);
  const closeCreateModal = useCallback(() => setIsCreateModalOpen(false), []);

  const fetchTrips = useCallback(async () => {
    setIsLoadingTrips(true);
    try {
      const res = await fetch("/api/trips", { cache: "no-store" });
      const data = await res.json();
      if (data.success) setTrips(data.trips);
    } catch {
      showToast("Couldn't load trips. Try refreshing.", "error");
    } finally {
      setIsLoadingTrips(false);
    }
  }, [showToast]);

  const fetchBlogs = useCallback(async () => {
    setIsLoadingBlogs(true);
    try {
      const res = await fetch("/api/blogs", { cache: "no-store" });
      const data = await res.json();
      if (data.success) setBlogs(data.blogs);
    } catch {
      showToast("Couldn't load stories. Try refreshing.", "error");
    } finally {
      setIsLoadingBlogs(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchTrips();
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createTrip = useCallback(
    async (input: NewTripInput): Promise<ActionResult> => {
      try {
        const res = await fetch("/api/trips", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(input),
        });
        const data = await res.json();
        if (data.success) {
          setTrips((prev) => [data.trip, ...prev]);
          showToast("Trip published!", "success");
        } else {
          showToast(data.message || "Couldn't create trip.", "error");
        }
        return { success: data.success, message: data.message };
      } catch {
        showToast("Couldn't create trip. Try again.", "error");
        return { success: false, message: "Network error." };
      }
    },
    [showToast]
  );

  const joinTrip = useCallback(
    async (id: number) => {
      if (!user) {
        showToast("Log in to join a trip.", "info");
        openAuthModal("login");
        return;
      }

      // Optimistic update — roll back if the server disagrees.
      const previous = trips;
      setTrips((prev) =>
        prev.map((t) =>
          t.id === id && t.spotsLeft > 0
            ? {
                ...t,
                spotsLeft: t.spotsLeft - 1,
                joinedUsers: [...t.joinedUsers, user.id],
              }
            : t
        )
      );

      try {
        const res = await fetch(`/api/trips/${id}/join`, {
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setTrips((prev) => prev.map((t) => (t.id === id ? data.trip : t)));
          showToast("You're in! Request sent to the host.", "success");
        } else {
          setTrips(previous);
          showToast(data.message || "Couldn't join trip.", "error");
        }
      } catch {
        setTrips(previous);
        showToast("Couldn't join trip. Try again.", "error");
      }
    },
    [trips, user, showToast, openAuthModal]
  );

  const toggleLikeBlog = useCallback(
    async (id: number) => {
      if (!user) {
        showToast("Log in to like a story.", "info");
        openAuthModal("login");
        return;
      }

      const previous = blogs;
      setBlogs((prev) =>
        prev.map((b) => {
          if (b.id !== id) return b;
          const liked = b.likedBy.includes(user.id);
          return {
            ...b,
            likes: liked ? b.likes - 1 : b.likes + 1,
            likedBy: liked
              ? b.likedBy.filter((uid) => uid !== user.id)
              : [...b.likedBy, user.id],
          };
        })
      );

      try {
        const res = await fetch(`/api/blogs/${id}/like`, {
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setBlogs((prev) => prev.map((b) => (b.id === id ? data.blog : b)));
        } else {
          setBlogs(previous);
          showToast(data.message || "Couldn't update like.", "error");
        }
      } catch {
        setBlogs(previous);
        showToast("Couldn't update like. Try again.", "error");
      }
    },
    [blogs, user, showToast, openAuthModal]
  );

  const filteredTrips = trips.filter((t) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      t.destination.toLowerCase().includes(q) || t.title.toLowerCase().includes(q)
    );
  });

  return (
    <TravelContext.Provider
      value={{
        trips,
        blogs,
        isLoadingTrips,
        isLoadingBlogs,
        searchQuery,
        setSearchQuery,
        filteredTrips,
        createTrip,
        joinTrip,
        toggleLikeBlog,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        isCreateModalOpen,
        openCreateModal,
        closeCreateModal,
      }}
    >
      {children}
    </TravelContext.Provider>
  );
}

export function useTravel(): TravelContextValue {
  const ctx = useContext(TravelContext);
  if (!ctx) throw new Error("useTravel must be used within a TravelProvider");
  return ctx;
}
