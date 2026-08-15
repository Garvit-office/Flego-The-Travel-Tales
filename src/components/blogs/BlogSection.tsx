"use client";

import React from "react";
import { BookOpen, Heart, MessageCircle, Share2, Clock } from "lucide-react";
import { useTravel } from "@/context/TravelContext";
import { useAuth } from "@/context/AuthContext";
import { BlogCardSkeleton } from "@/components/common/Skeletons";

const AVATAR_HUES = [
  "bg-cyan-500",
  "bg-slate-700",
  "bg-amber-500",
  "bg-emerald-600",
  "bg-violet-600",
  "bg-rose-500",
];

function hashCode(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i);
  return h;
}
function hueFor(seed: string): string {
  return AVATAR_HUES[Math.abs(hashCode(seed)) % AVATAR_HUES.length];
}
function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function BlogSection() {
  const { blogs, isLoadingBlogs, toggleLikeBlog } = useTravel();
  const { user } = useAuth();

  return (
    <section id="stories" className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2B2D2F]">
            <BookOpen className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-[#2B2D2F]">
              Travel stories
            </h2>
            <p className="text-sm text-slate-500">
              Field notes from the Flego community
            </p>
          </div>
        </div>

        {isLoadingBlogs ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {blogs.map((story) => {
              const liked = user ? story.likedBy.includes(user.id) : false;
              return (
                <div
                  key={story.id}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold text-white ${hueFor(
                        story.author
                      )}`}
                    >
                      {initials(story.author)}
                    </div>
                    <div className="leading-tight">
                      <p className="text-sm font-semibold text-[#2B2D2F]">
                        {story.author}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="h-3 w-3" /> {story.readTime}
                      </div>
                    </div>
                  </div>

                  <h3 className="mt-4 font-display text-lg font-bold leading-snug text-[#2B2D2F]">
                    {story.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-500">
                    {story.excerpt}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleLikeBlog(story.id)}
                        className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                          liked
                            ? "text-rose-500"
                            : "text-slate-500 hover:text-rose-500"
                        }`}
                      >
                        <Heart
                          className="h-4 w-4"
                          fill={liked ? "currentColor" : "none"}
                        />
                        {story.likes}
                      </button>
                      <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                        <MessageCircle className="h-4 w-4" /> {story.comments}
                      </span>
                    </div>
                    <button className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-cyan-600">
                      <Share2 className="h-4 w-4" /> Share
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
