import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore";

const BASE_URL = import.meta.env.VITE_API_URL;

import {
  articleCardClass,
  articleTitle,
  articleExcerpt,
  articleMeta,
  ghostBtn,
  loadingClass,
  errorClass,
  emptyStateClass,
  tagClass
} from "../styles/common";

function AuthorArticle() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.currentUser);
  const token = useAuthStore((state) => state.token);

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    const getAuthorArticles = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/author-api/articles`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
        setArticles(res.data.payload);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch articles");
      } finally {
        setLoading(false);
      }
    };

    getAuthorArticles();
  }, [token]);

  const openArticle = (article) => {
    navigate(`/article/${article._id}`, {
      state: article,
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
    });
  };

  if (loading) return <p className={loadingClass}>Loading your collection...</p>;
  if (error) return <p className={errorClass}>{error}</p>;

  if (articles.length === 0) {
    return <div className={emptyStateClass}>You haven't shared any stories yet. Start writing today!</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
      {articles.map((article) => (
        <div 
          key={article._id} 
          className={`${articleCardClass} flex flex-col group p-6! bg-white/50 backdrop-blur-sm border border-[#e8e8ed] rounded-3xl hover:shadow-xl transition-all duration-500`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <span className={tagClass + " bg-[#f5f5f7] text-[#1d1d1f] font-medium"}>
                {article.category}
              </span>
              <span className="text-[0.7rem] text-[#86868b] uppercase tracking-widest font-semibold">
                {article.isArticleActive === false ? "🚫 Deleted" : "✅ Active"}
              </span>
            </div>
            
            <h3 className={articleTitle + " text-xl group-hover:text-[#0071e3] transition-colors"}>
              {article.title}
            </h3>
            
            <p className={articleExcerpt + " text-[#424245] line-clamp-3 leading-relaxed"}>
              {article.content}
            </p>
            
            <div className="mt-2 flex items-center justify-between border-t border-[#f5f5f7] pt-4">
               <p className={articleMeta + " text-[0.75rem]"}>{formatDate(article.updatedAt)}</p>
               <button 
                  className="text-[#0071e3] font-semibold text-sm hover:underline flex items-center gap-1"
                  onClick={() => openArticle(article)}
                >
                Manage <span className="group-hover:translate-x-1 transition-transform">→</span>
               </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AuthorArticle;