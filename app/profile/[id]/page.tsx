"use client";
import React, { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Grid,
  QrCode,
  MapPin,
  GraduationCap,
  Home,
  School,
  Calendar,
  X,
} from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts");
  const [showQRModal, setShowQRModal] = useState(false);

  const images = [
    "photo-1503023345310-bd7c1de61c7d",
    "photo-1494790108377-be9c29b29330",
    "photo-1517841905240-472988babdf9",
    "photo-1529626455594-4ff0802cfb7e",
    "photo-1517841905240-472988babdf9",
    "photo-1503023345310-bd7c1de61c7d",
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navigation Bar */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold">MeBookMeta</div>
          </div>
          <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded text-sm transition">
            Go Back
          </button>
        </div>
      </div>

      {/* Cover Photo */}
      <div className="relative h-72 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=400&fit=crop"
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-800 sticky top-20">
              {/* Profile Picture */}
              <div className="flex justify-center -mt-20 mb-4">
                <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-gray-700 bg-gray-800">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Profile Info */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold mb-1">Arnold T Grisham</h1>
                <div className="text-xs text-gray-400 mb-1">
                  MEBOOKMETA FINGERPRINT
                </div>
                <div className="text-sm text-gray-500">
                  Main Stage, Creator, Author
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 mb-6">
                <button className="w-full bg-[#cccccc] text-black hover:bg-gray-700  font-semibold py-2 rounded transition">
                  Message
                </button>
                <button className="w-full bg-[#cccccc] text-black hover:bg-gray-700  font-semibold py-2 rounded transition">
                  Follow
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-800 text-center text-gray-400 text-sm">
                <div className="p-2 hover:bg-gray-800 rounded transition">
                  <div className="font-bold text-white">4</div>Following
                </div>
                <div className="p-2 hover:bg-gray-800 rounded transition">
                  <div className="font-bold text-white">5</div>Followers
                </div>
                <div className="p-2 hover:bg-gray-800 rounded transition">
                  <div className="font-bold text-white">5</div>Likes
                </div>
              </div>

              {/* Personal Info */}
              <div className="space-y-4 text-gray-400">
                {[
                  {
                    icon: Calendar,
                    label: "Place of Birth",
                    value: "XXXXXXXX",
                  },
                  { icon: MapPin, label: "Current Address", value: "XXXXXXXX" },
                  { icon: Home, label: "Home Town", value: "XXXXXXXX" },
                  { icon: GraduationCap, label: "College", value: "XXXXXXXX" },
                  { icon: School, label: "Schooling", value: "XXXXXXXX" },
                ].map((info, idx) => (
                  <div className="flex items-start gap-3" key={idx}>
                    <info.icon className="w-5 h-5 mt-0.5 flex-shrink-0 text-gray-400" />
                    <div>
                      <div className="text-xs uppercase font-semibold mb-1">
                        {info.label}
                      </div>
                      <div className="text-sm">{info.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* QR Code */}
              <button
                onClick={() => setShowQRModal(true)}
                className="w-full mt-6 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded p-2 transition"
              >
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 bg-gray-800 rounded flex items-center justify-center mb-2">
                    <QrCode className="w-16 h-16 text-white" />
                  </div>
                  <div className="text-xs text-gray-400 text-center">
                    Scan QR Code to discover my Profile
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Right Column - Content Area */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-800">
              {["posts", "work"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 text-sm font-semibold rounded transition ${
                    activeTab === tab
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  {tab === "posts" ? "Posts" : "Work Sample"}
                </button>
              ))}
            </div>

            {/* Content */}
            {activeTab === "posts" && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="relative aspect-square rounded overflow-hidden cursor-pointer bg-gray-900 border border-gray-800 hover:border-gray-600 transition"
                  >
                    <img
                      src={`https://images.unsplash.com/${
                        images[item % images.length]
                      }?w=400&h=400&fit=crop`}
                      alt={`Post ${item}`}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition flex items-end p-2">
                      <div className="flex justify-between w-full text-white text-xs">
                        <div className="flex gap-2">
                          <Heart className="w-4 h-4" />
                          234
                          <MessageCircle className="w-4 h-4" />
                          12
                        </div>
                        <Share2 className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "work" && (
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 text-center text-gray-400">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Grid className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-sm mb-3">No Work Samples Yet</div>
                  <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-white text-sm transition">
                    Add Work Sample
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Modal */}
      {showQRModal && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setShowQRModal(false)}
        >
          <div
            className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="font-bold text-white">Profile QR Code</div>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-gray-800 p-4 rounded mb-2 flex items-center justify-center">
              <QrCode className="w-24 h-24 text-white" />
            </div>
            <div className="text-xs text-gray-400 text-center">
              Scan this QR code to discover my profile
            </div>
          </div>
        </div>
      )}

      <div className="h-20"></div>
    </div>
  );
}
