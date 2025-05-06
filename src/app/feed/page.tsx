"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Post {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
  liked?: boolean;
  likeCount?: number;
  replies?: Post[];
}

export default function FeedPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<{ [postId: string]: string }>({});
  const [likeLoading, setLikeLoading] = useState<{ [postId: string]: boolean }>({});

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const res = await fetch("/api/feed");
    const data = await res.json();
    setPosts(data.posts);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("Failed to post");
      setContent("");
      await fetchPosts();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleReply(postId: string) {
    if (!replyContent[postId]?.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyContent[postId], parentId: postId }),
      });
      if (!res.ok) throw new Error("Failed to reply");
      setReplyContent(rc => ({ ...rc, [postId]: "" }));
      setReplyingTo(null);
      await fetchPosts();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLike(postId: string) {
    setLikeLoading(l => ({ ...l, [postId]: true }));
    await fetch("/api/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
    });
    await fetchPosts();
    setLikeLoading(l => ({ ...l, [postId]: false }));
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-2">
      <h1 className="text-4xl font-black text-white mb-8 tracking-tighter">Feed</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-black border-2 border-white rounded-2xl p-6 flex flex-col gap-4 shadow-xl mb-10"
        style={{ boxShadow: "0 0 24px 2px #fff3" }}
      >
        <textarea
          className="w-full p-3 rounded-lg bg-black text-white border-2 border-white font-mono focus:outline-none focus:ring-2 focus:ring-white resize-none min-h-[60px]"
          placeholder="What's on your mind?"
          value={content}
          onChange={e => setContent(e.target.value)}
          maxLength={500}
          required
        />
        {error && <div className="text-red-500 font-mono text-sm">{error}</div>}
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="w-full p-3 rounded-lg bg-white text-black font-black hover:bg-gray-200 transition-all duration-200 shadow-md text-lg tracking-tight disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </form>
      <div className="flex flex-col gap-6">
        {posts.map(post => (
          <div key={post.id} className="flex flex-col gap-1 bg-black border-2 border-white rounded-xl p-3 shadow-md" style={{ boxShadow: "0 0 8px 1px #fff2" }}>
            <div className="flex gap-3 items-start">
              <div className="w-10 h-10 rounded-full bg-white border-2 border-white shadow-lg overflow-hidden flex-shrink-0">
                {post.user.image ? (
                  <img src={post.user.image} alt={post.user.name || 'Profile'} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg text-gray-400 font-black flex items-center justify-center h-full">?</span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-black text-white text-base">{post.user.name || 'No Name'}</span>
                  <span className="text-xs text-gray-400 font-mono">{new Date(post.createdAt).toLocaleString()}</span>
                </div>
                <div className="text-white font-mono text-sm whitespace-pre-line break-words mb-1">{post.content}</div>
                <div className="flex gap-2 items-center mt-1">
                  <button
                    onClick={() => handleLike(post.id)}
                    disabled={likeLoading[post.id]}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded border-2 border-white font-black text-sm transition-all ${post.liked ? 'bg-red-500 text-white' : 'bg-black text-white hover:bg-white hover:text-black'} disabled:opacity-50`}
                  >
                    <span style={{fontSize: '1rem', lineHeight: 1}}>{post.liked ? '\u2665' : '\u2661'}</span>
                    <span>{post.likeCount || 0}</span>
                  </button>
                  <button
                    onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded border-2 border-white font-black text-sm bg-black text-white hover:bg-white hover:text-black transition-all"
                  >
                    <span>Reply</span>
                  </button>
                </div>
                {replyingTo === post.id && (
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      handleReply(post.id);
                    }}
                    className="mt-2 flex gap-2 items-end"
                  >
                    <textarea
                      className="flex-1 p-1 rounded bg-black text-white border-2 border-white font-mono focus:outline-none focus:ring-2 focus:ring-white resize-none min-h-[28px] text-sm"
                      placeholder="Write a reply..."
                      value={replyContent[post.id] || ""}
                      onChange={e => setReplyContent(rc => ({ ...rc, [post.id]: e.target.value }))}
                      maxLength={500}
                      required
                    />
                    <button
                      type="submit"
                      disabled={loading || !replyContent[post.id]?.trim()}
                      className="px-2 py-1 rounded bg-white text-black font-black hover:bg-gray-200 transition-all duration-200 shadow text-xs tracking-tight disabled:opacity-50"
                    >
                      Reply
                    </button>
                  </form>
                )}
                {post.replies && post.replies.length > 0 && (
                  <div className="mt-2 flex flex-col gap-2 pl-6 border-l-2 border-white">
                    {post.replies.map(reply => (
                      <div key={reply.id} className="flex gap-2 items-start">
                        <div className="w-8 h-8 rounded-full bg-white border-2 border-white shadow-lg overflow-hidden flex-shrink-0">
                          {reply.user.image ? (
                            <img src={reply.user.image} alt={reply.user.name || 'Profile'} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-base text-gray-400 font-black flex items-center justify-center h-full">?</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-black text-white text-sm">{reply.user.name || 'No Name'}</span>
                            <span className="text-xs text-gray-400 font-mono">{new Date(reply.createdAt).toLocaleString()}</span>
                          </div>
                          <div className="text-white font-mono text-sm whitespace-pre-line break-words mb-0.5">{reply.content}</div>
                          <button
                            onClick={() => handleLike(reply.id)}
                            disabled={likeLoading[reply.id]}
                            className={`flex items-center gap-1 px-1.5 py-0.5 rounded border-2 border-white font-black text-xs transition-all ${reply.liked ? 'bg-red-500 text-white' : 'bg-black text-white hover:bg-white hover:text-black'} disabled:opacity-50`}
                          >
                            <span style={{fontSize: '0.9rem', lineHeight: 1}}>{reply.liked ? '\u2665' : '\u2661'}</span>
                            <span>{reply.likeCount || 0}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="text-center text-gray-500 font-mono">No posts yet.</div>
        )}
      </div>
    </div>
  );
} 