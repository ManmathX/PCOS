import React from "react";

const TOPICS = [
  {
    title: "Weight Loss Support",
    members: 1240,
    color: "bg-pink-100 text-pink-700",
  },
  {
    title: "TTC & Fertility",
    members: 890,
    color: "bg-purple-100 text-purple-700",
  },
  {
    title: "Skincare Advice",
    members: 560,
    color: "bg-green-100 text-green-700",
  },
  {
    title: "Mental Wellness",
    members: 430,
    color: "bg-blue-100 text-blue-700",
  },
];

export default function UserCommunity() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          PCOS Sisters Community 🤝
        </h2>
        <p className="text-gray-500">
          Connect, share, and grow with women who understand.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {TOPICS.map((topic) => (
          <div
            key={topic.title}
            className="p-4 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition cursor-pointer border border-transparent hover:border-gray-100 group"
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${topic.color}`}
            >
              #
            </div>
            <h3 className="font-bold text-gray-800 mb-1 group-hover:text-pink-600 transition">
              {topic.title}
            </h3>
            <p className="text-xs text-gray-400">{topic.members} members</p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-gray-800 mb-4">
          Trending Discussions 🔥
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition cursor-pointer"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">
                  Has anyone tried spearmint tea for acne?
                </h4>
                <p className="text-sm text-gray-500 line-clamp-2">
                  I've been reading a lot about spearmint tea helping with
                  hormonal acne specifically for PCOS. Just ordered some but
                  wanted to know if...
                </p>
                <div className="flex gap-4 mt-2 text-xs text-gray-400">
                  <span>24 replies</span>
                  <span>•</span>
                  <span>2 hours ago</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full py-3 bg-pink-100 text-pink-700 font-semibold rounded-xl hover:bg-pink-200 transition">
        View All Discussions
      </button>
    </div>
  );
}
