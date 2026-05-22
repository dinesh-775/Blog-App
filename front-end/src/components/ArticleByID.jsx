import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import * as styles from '../styles/common.js'
import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import { toast } from 'react-hot-toast'

const BASE_URL = import.meta.env.VITE_API_URL

function ArticleByID() {
    const { articleId } = useParams()
    const { state } = useLocation()
    const navigate = useNavigate()
    
    const [article, setArticle] = useState(state || null)
    const [loading, setLoading] = useState(!state)
    const [error, setError] = useState(null)
    const [commentText, setCommentText] = useState("")
    const [postingComment, setPostingComment] = useState(false)
    const [editingCommentId, setEditingCommentId] = useState(null)
    const [editCommentText, setEditCommentText] = useState("")
    const [editingComment, setEditingComment] = useState(false)

    const currentUser = useAuthStore(state => state.currentUser)
    const token = useAuthStore(state => state.token)

    const fetchArticle = async () => {
        setLoading(true)
        try {
            // Determine which route to use based on role
            const apiRoute = currentUser?.role === 'AUTHOR' ? 'author-api' : 'user-api'
            const res = await axios.get(`${BASE_URL}/${apiRoute}/articles/${articleId}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            })
            setArticle(res.data.payload)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch article')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchArticle()
    }, [articleId])

    const handleAddComment = async (e) => {
        e.preventDefault()
        if (!commentText.trim()) return

        setPostingComment(true)
        try {
            const res = await axios.post(`${BASE_URL}/user-api/articles/comments`, {
                userId: currentUser._id,
                articleId: article._id,
                comment: commentText
            }, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            })
            
            toast.success("Comment added!")
            setCommentText("")
            // Refresh article to show new comment (populated)
            fetchArticle()
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add comment")
        } finally {
            setPostingComment(false)
        }
    }

    const handleEditCommentSubmit = async (e, commentId) => {
        e.preventDefault()
        if (!editCommentText.trim()) return

        setEditingComment(true)
        try {
            const res = await axios.put(`${BASE_URL}/user-api/articles/comments`, {
                articleId: article._id,
                commentId: commentId,
                comment: editCommentText
            }, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            })
            
            toast.success("Comment updated!")
            setEditingCommentId(null)
            setEditCommentText("")
            fetchArticle()
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to edit comment")
        } finally {
            setEditingComment(false)
        }
    }

    const formatIST = (dateString) => {
        if (!dateString) return ''
        return new Date(dateString).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            dateStyle: 'long',
            timeStyle: 'short'
        })
    }

    const isAuthor = currentUser && article &&
        (currentUser._id === article.author || currentUser._id === article.author?._id)

    const handleEdit = () => {
        navigate(`/edit-article/${article._id}`, { state: article })
    }

    const handleToggleStatus = async (activate) => {
        try {
            await axios.patch(
                `${BASE_URL}/author-api/articles/${article._id}/status`,
                { isArticleActive: activate },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                }
            )
            setArticle(prev => ({ ...prev, isArticleActive: activate }))
            toast.success(activate ? 'Article restored!' : 'Article deleted!')
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to update article status')
        }
    }

    if (loading) return <div className="text-center mt-20 text-xl font-medium text-[#86868b]">Loading excellence...</div>
    if (error) return <div className="text-center mt-20 text-red-500 text-xl font-medium">{error}</div>
    if (!article) return <div className="text-center mt-20 text-xl font-medium text-[#86868b]">Article not found</div>

    return (
        <div className={styles.pageBackground}>
            <div className={styles.pageWrapper + " py-12"}>
                <div className="max-w-3xl mx-auto">
                    {/* Header Section */}
                    <div className="flex justify-between items-center mb-8">
                        <span className={styles.tagClass}>
                            {article.category}
                        </span>
                        <span className={styles.timestampClass}>
                            {formatIST(article.updatedAt || article.createdAt)}
                        </span>
                    </div>

                    <h1 className={styles.pageTitleClass + " mb-10 leading-tight"}>
                        {article.title}
                    </h1>

                    <div className="flex items-center justify-between mb-12 border-b border-[#e8e8ed] pb-8">
                        <div className="flex items-center">
                            {article.author?.profileImageUrl ? (
                                <img 
                                    src={article.author.profileImageUrl} 
                                    alt={article.author.username}
                                    className="w-12 h-12 rounded-full object-cover mr-4 border border-[#d2d2d7]"
                                />
                            ) : (
                                <div className="w-12 h-12 bg-[#f5f5f7] rounded-full flex items-center justify-center text-[#1d1d1f] font-bold mr-4 border border-[#d2d2d7]">
                                    {article.author?.username?.charAt(0).toUpperCase() || 'A'}
                                </div>
                            )}
                            <div>
                                <p className="text-[#1d1d1f] font-semibold">{article.author?.username || 'Unknown Author'}</p>
                                <p className={styles.mutedText + " uppercase tracking-widest text-[0.6rem]"}>Verified Contributor</p>
                            </div>
                        </div>

                        {/* Author Controls */}
                        {isAuthor && (
                            <div className="flex gap-2">
                                <button onClick={handleEdit} className={styles.secondaryBtn}>✏️ Edit</button>
                                {article.isArticleActive !== false ? (
                                    <button
                                        onClick={() => handleToggleStatus(false)}
                                        className="border border-red-100 text-red-500 font-medium px-4 py-2 rounded-full hover:bg-red-50 transition-all text-xs"
                                    >
                                        🗑 Delete
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleToggleStatus(true)}
                                        className="border border-green-100 text-green-600 font-medium px-4 py-2 rounded-full hover:bg-green-50 transition-all text-xs"
                                    >
                                        ↩️ Restore
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {article.isArticleActive === false && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-8 text-sm font-medium border border-red-100">
                            Notice: This article has been deleted and is only visible to you.
                        </div>
                    )}

                    {/* Content Section */}
                    <div className={styles.articleBody + " whitespace-pre-line leading-relaxed text-lg"}>
                        {article.content}
                    </div>

                    <div className={styles.divider + " my-16"}></div>

                    {/* Comments Section */}
                    <div className="mt-12">
                        <h3 className="text-2xl font-bold text-[#1d1d1f] mb-8">Discussions ({article.comments?.length || 0})</h3>
                        
                        {/* Comment Form */}
                        {currentUser?.role === 'USER' && (
                            <form onSubmit={handleAddComment} className="mb-12 bg-[#f5f5f7] p-6 rounded-3xl border border-[#e8e8ed]">
                                <textarea
                                    className="w-full bg-white border border-[#d2d2d7] rounded-2xl p-4 text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3] transition-all resize-none"
                                    rows="3"
                                    placeholder="Add to the conversation..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                ></textarea>
                                <div className="flex justify-end mt-4">
                                    <button 
                                        type="submit" 
                                        disabled={postingComment || !commentText.trim()}
                                        className={styles.primaryBtn + " py-2! px-6!"}
                                    >
                                        {postingComment ? "Posting..." : "Post Comment"}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Comments List */}
                        <div className="space-y-6">
                            {article.comments?.length > 0 ? (
                                article.comments.map((comment, index) => (
                                    <div key={index} className="flex gap-4 p-4 rounded-2xl hover:bg-[#fafafa] transition-colors">
                                        <div className="w-10 h-10 bg-[#e8e8ed] rounded-full flex items-center justify-center text-[#86868b] font-bold text-sm">
                                            {comment.user?.username?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <div>
                                                    <span className="font-semibold text-[#1d1d1f] text-sm mr-2">{comment.user?.username || 'Guest'}</span>
                                                    {comment.updatedAt || comment.createdAt ? (
                                                        <span className="text-[0.7rem] text-[#86868b]">
                                                            {formatIST(comment.updatedAt || comment.createdAt)}
                                                            {comment.updatedAt && comment.createdAt && new Date(comment.updatedAt).getTime() !== new Date(comment.createdAt).getTime() ? " (edited)" : ""}
                                                        </span>
                                                    ) : null}
                                                </div>
                                                {currentUser?._id === comment.user?._id && (
                                                    <button 
                                                        onClick={() => {
                                                            setEditingCommentId(comment._id)
                                                            setEditCommentText(comment.comment)
                                                        }}
                                                        className="text-xs text-[#0066cc] hover:underline"
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                            </div>
                                            {editingCommentId === comment._id ? (
                                                <form onSubmit={(e) => handleEditCommentSubmit(e, comment._id)} className="mt-2">
                                                    <textarea
                                                        className="w-full bg-white border border-[#d2d2d7] rounded-xl p-3 text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3] text-sm resize-none"
                                                        rows="2"
                                                        value={editCommentText}
                                                        onChange={(e) => setEditCommentText(e.target.value)}
                                                    ></textarea>
                                                    <div className="flex justify-end gap-2 mt-2">
                                                        <button 
                                                            type="button" 
                                                            onClick={() => setEditingCommentId(null)}
                                                            className={styles.secondaryBtn + " py-1.5! px-4! text-xs!"}
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button 
                                                            type="submit" 
                                                            disabled={editingComment || !editCommentText.trim() || editCommentText === comment.comment}
                                                            className={styles.primaryBtn + " py-1.5! px-4! text-xs!"}
                                                        >
                                                            {editingComment ? "Saving..." : "Save"}
                                                        </button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <p className="text-[#424245] text-[0.95rem] leading-snug whitespace-pre-line">{comment.comment}</p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-[#86868b] text-center py-8 italic bg-[#fbfbfb] rounded-3xl border border-dashed border-[#d2d2d7]">No discussions yet. Be the first to chime in!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ArticleByID
