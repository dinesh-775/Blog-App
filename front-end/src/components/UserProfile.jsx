import { useAuthStore } from '../store/authStore'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as styles from '../styles/common.js'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL


function UserProfile() {
    const logout = useAuthStore(state => state.logout)
    const token = useAuthStore(state => state.token)
    const navigate = useNavigate()
    const [articles, setArticles] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState("")

    const categories = ["technology", "programming", "ai", "web-development"]
    const onLogout = async () => {
        await logout()
        navigate("/login")
    }

    useEffect(() => {
        const getArticles = async () => {
            setLoading(true)
            try {
                const url = selectedCategory 
                    ? `${BASE_URL}/user-api/articles?category=${selectedCategory}`
                    : `${BASE_URL}/user-api/articles`
                
                let res = await axios.get(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                })
                setArticles(res.data.payload || [])
            } catch (err) {
                setError(err.response?.data.error || "failed to fetch articles")
            } finally {
                setLoading(false)
            }
        }
        getArticles()
    }, [selectedCategory, token])

    const readMore = (article) => {
        navigate(`/article/${article._id}`, { state: article })
    }

    return (
        <div className="py-10">
            <div className="flex justify-between items-end mb-12 border-b border-[#e8e8ed] pb-8">
                <div>
                    <h1 className={styles.pageTitleClass}>Explore</h1>
                    <p className={styles.bodyText}>Discover the latest insights from our community.</p>
                </div>
                <button
                    onClick={onLogout}
                    className={styles.secondaryBtn}
                >
                    Sign Out
                </button>
            </div>

            <div className="mb-10 flex flex-wrap gap-3">
                <button 
                    onClick={() => setSelectedCategory("")}
                    className={selectedCategory === "" ? styles.primaryBtn : styles.secondaryBtn}
                >
                    All
                </button>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={selectedCategory === cat ? styles.primaryBtn : styles.secondaryBtn + " capitalize"}
                    >
                        {cat.replace('-', ' ')}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className={styles.loadingClass}>Searching for excellence...</div>
            ) : error ? (
                <div className={styles.errorClass}>{error}</div>
            ) : (
                <div className={styles.articleGrid}>
                    {articles.map(article => (
                        <div
                            key={article._id}
                            className={styles.articleCardClass}
                            onClick={() => readMore(article)}
                        >
                            <span className={styles.tagClass}>
                                {article.category}
                            </span>
                            <h2 className={styles.articleTitle}>
                                {article.title}
                            </h2>
                            <p className={styles.articleExcerpt}>
                                {article.content}
                            </p>
                            <div className="mt-auto pt-4 flex items-center justify-between">
                                <span className={styles.linkClass + " text-xs font-medium"}>Read Article</span>
                                <span className={styles.mutedText}>→</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && articles.length === 0 && !error && (
                <div className={styles.emptyStateClass}>
                    No articles found matching your criteria.
                </div>
            )}
        </div>
    )
}

export default UserProfile