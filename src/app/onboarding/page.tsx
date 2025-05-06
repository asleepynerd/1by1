"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OnboardingPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [name, setName] = useState(session?.user?.name || "");
  const [image, setImage] = useState(session?.user?.image || "");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setFile(file);
    setImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError("");
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
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image: imageUrl }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      await update();
      router.push("/home");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleSubmit}
        className="bg-black border-2 border-white rounded-2xl p-8 flex flex-col items-center gap-6 w-full max-w-md shadow-2xl relative"
        style={{ boxShadow: "0 0 32px 4px #fff4" }}
      >
        <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">Welcome!</h1>
        <p className="text-gray-400 mb-4 text-center font-mono">Set up your profile to get started.</p>
        <label className="flex flex-col items-center cursor-pointer">
          <span className="mb-2 text-white font-mono">Profile Picture</span>
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center overflow-hidden mb-2 border-2 border-white shadow-lg">
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
        </label>
        <input
          type="text"
          placeholder="Display Name"
          className="w-full p-3 rounded-lg bg-black text-white border-2 border-white font-mono focus:outline-none focus:ring-2 focus:ring-white"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        {error && <div className="text-red-500 font-mono text-sm">{error}</div>}
        <button
          type="submit"
          disabled={uploading}
          className="w-full p-3 rounded-lg bg-white text-black font-black hover:bg-gray-200 transition-all duration-200 shadow-md text-lg tracking-tight"
        >
          {uploading ? "Saving..." : "Continue"}
        </button>
      </form>
    </div>
  );
} 