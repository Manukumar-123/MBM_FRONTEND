"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Users,
  Award,
  TrendingUp,
  Star,
  Eye,
  Heart,
  MessageCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getCreators, ICreator } from "@/api/api";

type Author = {
  _id: string;
  name: string;
  role: string;
  stage: string;
  avatar: string;
  works: number;
  reading: number;
  finished: number;
  followers: number | string;
  views: number | string;
  likes: number | string;
  comments: number;
};

interface AuthorCardProps {
  author: Author;
  index: number;
}

const AuthorCard: React.FC<AuthorCardProps> = ({
  author,
  index,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleAuthorClick = (id: string) => {
    router.push(`/profile/${id}`);
  };

  return (
    <div
      className="relative group cursor-pointer w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animation: "fadeIn 0.6s ease-out forwards",
        animationDelay: `${index * 0.1}s`,
        opacity: 0,
      }}
    >
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Card */}
      <div
        onClick={() => handleAuthorClick(author._id)}
        className="relative bg-gray-100 dark:bg-[#0b0b0b] rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200 dark:border-neutral-800 hover:border-gray-400 dark:hover:border-neutral-600 transition-all duration-300 shadow-md hover:shadow-lg"
      >
        {/* Header */}
        <div className="relative h-24 sm:h-28 bg-gradient-to-r from-gray-200 dark:from-neutral-900 via-gray-300 dark:via-black to-gray-200 dark:to-neutral-900">
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black/40 backdrop-blur-md px-2 py-1 sm:px-3 rounded-full border border-white/10">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500" />

              <span className="text-xs text-gray-200 font-medium">
                Featured
              </span>
            </div>
          </div>
        </div>

        {/* Avatar */}
        <div className="relative px-4 sm:px-6 -mt-10 sm:-mt-12 pb-4">
          <div className="relative inline-block">
            <div className="relative bg-gray-200 dark:bg-neutral-900 rounded-full p-1.5">
              <img
                src={author.avatar}
                alt={author.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-gray-300 dark:border-neutral-800"
              />
            </div>

            <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-200 dark:border-neutral-900" />
          </div>
        </div>

        {/* Author Info */}
        <div className="px-4 sm:px-6 pb-5">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-all">
            {author.name}
          </h3>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {author.role}
            </span>

            <span className="text-gray-400 dark:text-gray-600">
              •
            </span>

            <span className="text-xs text-gray-500 bg-gray-200/80 dark:bg-gray-800/60 px-2 py-0.5 rounded-full">
              {author.stage}
            </span>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-4 mb-4 border-b border-gray-200 dark:border-neutral-800 pb-3">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4 text-gray-400" />

              <span className="text-sm text-gray-700 dark:text-gray-200">
                {author.views}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4 text-gray-400" />

              <span className="text-sm text-gray-700 dark:text-gray-200">
                {author.likes}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4 text-gray-400" />

              <span className="text-sm text-gray-700 dark:text-gray-200">
                {author.comments}
              </span>
            </div>
          </div>

          {/* Grid Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Total Works */}
            <div className="bg-gray-200 dark:bg-neutral-900 border border-gray-300 dark:border-neutral-800 rounded-xl p-3 hover:border-gray-400 dark:hover:border-neutral-600 transition-all duration-300">
              <BookOpen className="w-5 h-5 text-gray-400" />

              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {author.works}
              </p>

              <p className="text-xs text-gray-500">
                Total Works
              </p>
            </div>

            {/* Reading */}
            <div className="bg-gray-200 dark:bg-neutral-900 border border-gray-300 dark:border-neutral-800 rounded-xl p-3 hover:border-gray-400 dark:hover:border-neutral-600 transition-all duration-300">
              <Users className="w-5 h-5 text-gray-400" />

              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {author.reading}
              </p>

              <p className="text-xs text-gray-500">
                Reading
              </p>
            </div>

            {/* Completed */}
            <div className="bg-gray-200 dark:bg-neutral-900 border border-gray-300 dark:border-neutral-800 rounded-xl p-3 hover:border-gray-400 dark:hover:border-neutral-600 transition-all duration-300">
              <Award className="w-5 h-5 text-gray-400" />

              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {author.finished}
              </p>

              <p className="text-xs text-gray-500">
                Completed
              </p>
            </div>

            {/* Followers */}
            <div className="bg-gray-200 dark:bg-neutral-900 border border-gray-300 dark:border-neutral-800 rounded-xl p-3 hover:border-gray-400 dark:hover:border-neutral-600 transition-all duration-300">
              <TrendingUp className="w-5 h-5 text-gray-400" />

              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {author.followers}
              </p>

              <p className="text-xs text-gray-500">
                Followers
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {/* Follow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="py-2 rounded-lg bg-white text-black font-semibold text-sm hover:bg-gray-300 transition-all"
            >
              Follow
            </button>

            {/* View */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAuthorClick(author._id);
              }}
              className="py-2 rounded-lg border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-gray-300 hover:border-gray-500 dark:hover:border-gray-500 transition-all"
            >
              View
            </button>
          </div>
        </div>

        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-white/5 via-transparent to-transparent transition-opacity duration-500 ${
            isHovered ? "opacity-10" : "opacity-0"
          }`}
        />
      </div>
    </div>
  );
};

/* =====================================================
   AUTHORS GRID
===================================================== */

const AuthorsGrid: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getCreators({
          page: 1,
          limit: 12,
        });

        console.log("Creators API response:", response);

        /*
         * Backend response:
         *
         * {
         *   success: true,
         *   message: "Authors retrieved successfully",
         *   data: [...],
         *   pagination: {...}
         * }
         *
         * Therefore creators are inside response.data
         */

        const creators: ICreator[] = response.data || [];

        console.log("Creators:", creators);

        /* =====================================================
           FORMAT API DATA
        ===================================================== */

        const formattedAuthors: Author[] = creators.map(
          (creator) => ({
            _id: creator._id,

            name: creator.name || "Unknown Creator",

            role: creator.role || "Author",

            stage: "Featured Creator",

            /*
             * Currently backend doesn't return avatar.
             * Using DiceBear as temporary avatar.
             */
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
              creator.name || creator._id
            )}`,

            /*
             * Real backend value
             */
            works: creator.bookCount || 0,

            /*
             * These values are not currently
             * returned by your API.
             */
            reading: 0,
            finished: 0,
            followers: 0,
            views: 0,
            likes: 0,
            comments: 0,
          })
        );

        console.log(
          "Formatted authors:",
          formattedAuthors
        );

        setAuthors(formattedAuthors);
      } catch (err) {
        console.error(
          "Failed to fetch creators:",
          err
        );

        setError(
          "Failed to load creators. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, []);

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white p-6 md:p-10">
        <div className="relative max-w-6xl mx-auto text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-black mb-3 mt-20">
            Featured Authors
          </h1>

          <p className="text-gray-400 text-base md:text-lg">
            Discover talented creators and their inspiring
            works.
          </p>
        </div>

        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-black dark:border-neutral-700 dark:border-t-white rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* =====================================================
     MAIN
  ===================================================== */

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white p-6 md:p-10">
      {/* Header */}
      <div className="relative max-w-6xl mx-auto text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-black mb-3 mt-20">
          Featured Authors
        </h1>

        <p className="text-gray-400 text-base md:text-lg">
          Discover talented creators and their inspiring
          works.
        </p>
      </div>

      {/* No creators */}
      {authors.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500">
            No creators found.
          </p>
        </div>
      ) : (
        /* Authors */
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {authors.map((author, index) => (
            <AuthorCard
              key={author._id}
              author={author}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AuthorsGrid;