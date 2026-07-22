"use client";

import { useEffect, useRef, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { IconCamera } from "@/components/icons";

export default function ProfilePage() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [name, setName] = useState("Amara Osei");
  const [email, setEmail] = useState("amara@meridianstudio.com");
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAvatar(localStorage.getItem("nex-avatar"));
  }, []);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAvatar(dataUrl);
      localStorage.setItem("nex-avatar", dataUrl);
      window.dispatchEvent(new Event("nex-avatar-updated"));
    };
    reader.readAsDataURL(file);
  }

  function removeAvatar() {
    setAvatar(null);
    localStorage.removeItem("nex-avatar");
    window.dispatchEvent(new Event("nex-avatar-updated"));
  }

  function saveProfile() {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <Sidebar active="Profile" />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="p-4 pt-16 sm:p-[24px_28px_28px] flex flex-col gap-5 min-w-0 max-w-[640px]">
          <div>
            <h3 className="m-0 text-[22px]">Profile</h3>
            <div className="text-muted text-[12.5px] mt-[3px]">Your account and preferences</div>
          </div>

          <div className="card elev-sm p-5 gap-4">
            <div className="card-title text-sm">Avatar</div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div
                  className="w-20 h-20 rounded-full grid place-items-center text-xl font-medium overflow-hidden"
                  style={
                    avatar
                      ? { backgroundImage: `url(${avatar})`, backgroundSize: "cover", backgroundPosition: "center" }
                      : { background: "linear-gradient(135deg, var(--color-accent-2-600), var(--color-accent-900))", color: "var(--color-accent-100)" }
                  }
                >
                  {!avatar && "AO"}
                </div>
                <button
                  className="absolute -bottom-1 -right-1 btn btn-icon btn-primary"
                  style={{ width: 30, height: 30, background: "var(--color-bg)" }}
                  aria-label="Upload avatar"
                  onClick={() => fileRef.current?.click()}
                >
                  <IconCamera size={14} />
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button className="btn btn-secondary text-[12.5px]" onClick={() => fileRef.current?.click()}>
                    Upload photo
                  </button>
                  {avatar && (
                    <button className="btn btn-ghost text-[12.5px]" onClick={removeAvatar}>
                      Remove
                    </button>
                  )}
                </div>
                <div className="text-[11px] text-[var(--color-neutral-500)]">JPG or PNG, saved to this browser</div>
              </div>
            </div>
          </div>

          <div className="card elev-sm p-5 gap-3.5">
            <div className="card-title text-sm">Account</div>
            <div className="field">
              <label>Full name</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="field">
              <label>Email</label>
              <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button className="btn btn-primary text-[12.5px] self-start" onClick={saveProfile}>
              {saved ? "Saved!" : "Save changes"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
