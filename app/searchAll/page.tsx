"use client";

import { useState } from "react";
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

type Author = {
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

const AuthorCard: React.FC<AuthorCardProps> = ({ author, index }) => {
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
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Card container */}
      <div
        onClick={() => handleAuthorClick(author.name)}
        className="relative bg-[#0b0b0b] rounded-2xl sm:rounded-3xl overflow-hidden border border-neutral-800 hover:border-neutral-600 transition-all duration-300 shadow-md hover:shadow-lg"
      >
        {/* Header area */}
        <div className="relative h-24 sm:h-28 bg-gradient-to-r from-neutral-900 via-black to-neutral-900">
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
            <div className="relative bg-neutral-900 rounded-full p-1.5">
              <img
                src={author.avatar}
                alt={author.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-neutral-800"
              />
            </div>
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-neutral-900"></div>
          </div>
        </div>

        {/* Author info */}
        <div className="px-4 sm:px-6 pb-5">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-1 group-hover:text-gray-200 transition-all">
            {author.name}
          </h3>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-gray-400">{author.role}</span>
            <span className="text-gray-600">•</span>
            <span className="text-xs text-gray-500 bg-gray-800/60 px-2 py-0.5 rounded-full">
              {author.stage}
            </span>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-4 mb-4 border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-200">{author.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-200">{author.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-200">{author.comments}</span>
            </div>
          </div>

          {/* Grid Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              {
                icon: <BookOpen className="w-5 h-5 text-gray-400" />,
                value: author.works,
                label: "Total Works",
              },
              {
                icon: <Users className="w-5 h-5 text-gray-400" />,
                value: author.reading,
                label: "Reading",
              },
              {
                icon: <Award className="w-5 h-5 text-gray-400" />,
                value: author.finished,
                label: "Completed",
              },
              {
                icon: <TrendingUp className="w-5 h-5 text-gray-400" />,
                value: author.followers,
                label: "Followers",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 hover:border-neutral-600 transition-all duration-300"
              >
                {stat.icon}
                <p className="text-xl font-bold text-white mt-1">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className="py-2 rounded-lg bg-white text-black font-semibold text-sm hover:bg-gray-300 transition-all">
              Follow
            </button>
            <button className="py-2 rounded-lg border border-neutral-700 text-gray-300 hover:border-gray-500 transition-all">
              View
            </button>
          </div>
        </div>

        {/* Subtle overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-white/5 via-transparent to-transparent transition-opacity duration-500 ${
            isHovered ? "opacity-10" : "opacity-0"
          }`}
        ></div>
      </div>
    </div>
  );
};

const AuthorsGrid: React.FC = () => {
  const authors: Author[] = [
    {
      name: "Marcus McGee",
      role: "Senior Author",
      stage: "Main Stage",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
      works: 7,
      reading: 4,
      finished: 13,
      followers: "1.2K",
      views: "45K",
      likes: "3.2K",
      comments: 892,
    },
    {
      name: "Manu Kumar",
      role: "Story Teller",
      stage: "Reading Stage",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Manu",
      works: 2,
      reading: 4,
      finished: 8,
      followers: 567,
      views: "15K",
      likes: 934,
      comments: 312,
    },
    {
      name: "Tony Sousa",
      role: "Creative Writer",
      stage: "Art Stage",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tony",
      works: 0,
      reading: 0,
      finished: 1,
      followers: 445,
      views: "12K",
      likes: 890,
      comments: 234,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="relative max-w-6xl mx-auto text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-black mb-3 text-white mt-20">
          Featured Authors
        </h1>
        <p className="text-gray-400 text-base md:text-lg">
          Discover talented creators and their inspiring works.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.map((author, index) => (
          <AuthorCard key={index} author={author} index={index} />
        ))}
      </div>
    </div>
  );
};

export default AuthorsGrid;
