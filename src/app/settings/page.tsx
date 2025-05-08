"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setImage(session.user.image || "");
    }
  }, [session]);

  // check if anything changed
  useEffect(() => {
    if (!session?.user) return;
    setChanged(
      name !== (session.user.name || "") ||
      (file !== null) ||
      (!!session.user.image && image === "")
    );
  }, [name, file, image, session]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setFile(file);
    setImage(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setFile(null);
    setImage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changed) return;
    setUploading(true);
    setError("");
    setSuccess(false);
    let imageUrl = image;
    try {
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || 'Failed to upload image');
        imageUrl = uploadData.url;
      }
      if (image === "" && session?.user?.image) {
        imageUrl = ""; // remove image ( i think, knowing me i probably did this wrong )
      }
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image: imageUrl }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      await update();
      setSuccess(true);
      setFile(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-2">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <div className="flex flex-col md:flex-row items-center gap-6 bg-black border-2 border-white rounded-2xl p-8 shadow-xl" style={{ boxShadow: "0 0 32px 4px #fff4" }}>
          <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white shadow-lg">
            {session?.user?.image ? (
              <img src={session.user.image} alt={session.user.name || 'Profile'} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl text-gray-400 font-black">?</span>
            )}
          </div>
          <div className="flex-1 flex flex-col items-center md:items-start">
            <div className="text-2xl font-black text-white tracking-tighter mb-1">{session?.user?.name || 'No Name'}</div>
            <div className="text-gray-400 font-mono text-sm">{session?.user?.email}</div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-black border-2 border-white rounded-2xl p-8 flex flex-col items-center gap-6 shadow-2xl relative"
          style={{ boxShadow: "0 0 16px 2px #fff2" }}
        >
          <h2 className="text-2xl font-black text-white mb-2 tracking-tighter">Edit Profile</h2>
          <div className="flex flex-col md:flex-row gap-6 w-full items-center justify-center">
            <label className="flex flex-col items-center cursor-pointer">
              <span className="mb-2 text-white font-mono">New Picture</span>
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center overflow-hidden mb-2 border-2 border-white shadow-lg">
                {image ? (
                  <img src={image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl text-gray-400">?</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <span className="text-xs text-gray-500">Click to upload</span>
              {session?.user?.image && (
                <button type="button" onClick={handleRemoveImage} className="mt-2 px-3 py-1 rounded bg-black border border-white text-white text-xs font-mono hover:bg-white hover:text-black transition-all">Remove</button>
              )}
            </label>
            <div className="flex flex-col gap-2 w-full md:w-2/3">
              <label className="text-white font-mono mb-1">Display Name</label>
              <input
                type="text"
                placeholder="Display Name"
                className="w-full p-3 rounded-lg bg-black text-white border-2 border-white font-mono focus:outline-none focus:ring-2 focus:ring-white"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          </div>
          {error && <div className="text-red-500 font-mono text-sm">{error}</div>}
          {success && <div className="text-green-500 font-mono text-sm">Profile updated!</div>}
          <div className="flex gap-4 w-full">
            <button
              type="submit"
              disabled={uploading || !changed}
              className="flex-1 p-3 rounded-lg bg-white text-black font-black hover:bg-gray-200 transition-all duration-200 shadow-md text-lg tracking-tight disabled:opacity-50"
            >
              {uploading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              className="flex-1 p-3 rounded-lg bg-black border-2 border-white text-white font-black hover:bg-white hover:text-black transition-all duration-200 shadow-md text-lg tracking-tight"
              onClick={() => {
                setName(session?.user?.name || "");
                setImage(session?.user?.image || "");
                setFile(null);
                setError("");
                setSuccess(false);
              }}
              disabled={uploading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 