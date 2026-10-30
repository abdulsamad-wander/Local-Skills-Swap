import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { IoCameraOutline, IoTrashOutline } from "react-icons/io5";
import { fileToAvatarDataUrl } from "../lib/image";
import UserAvatar from "./UserAvatar";

/** Picks an image from the device, crops it square and hands back a data URL. */
const AvatarUpload = ({ value, name, onChange, size = "xl" }) => {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setBusy(true);
    try {
      onChange(await fileToAvatarDataUrl(file));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative group rounded-full"
        aria-label="Choose a profile photo"
      >
        <UserAvatar src={value} name={name} size={size} />
        <span className="absolute inset-0 rounded-full bg-black/55 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity grid place-items-center text-white">
          {busy ? <span className="loading loading-spinner loading-sm" /> : <IoCameraOutline className="size-7" />}
        </span>
      </button>

      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="btn btn-sm btn-outline rounded-full gap-2"
          disabled={busy}
        >
          <IoCameraOutline className="size-4" />
          {value ? "Change photo" : "Upload photo"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="btn btn-sm btn-ghost btn-circle"
            title="Remove photo"
            aria-label="Remove photo"
          >
            <IoTrashOutline className="size-4" />
          </button>
        )}
      </div>
      <p className="text-xs text-base-content/50">JPG, PNG or WebP. Cropped to a square.</p>
    </div>
  );
};

export default AvatarUpload;
