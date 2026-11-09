"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ExternalLink,
  Globe2,
  ImagePlus,
  Loader2,
  Plus,
  Save,
  Trash2,
  UserRound,
} from "lucide-react";
import { AxiosError } from "axios";

import { getFileUrl, getMyProfile, updateMyProfile, type IMyProfile, type IProfileSocialLink, type IProfileUpdatePayload, type ProfileSocialPlatform } from "../../api/api";
import useAuthStore from "../store/authStore";

type ProfileDraft = Pick<IMyProfile, "name" | "dob" | "gender" | "bio" | "avatarUrl" | "craft" | "location"> & {
  socialLinks: IProfileSocialLink[];
};

const SOCIAL_PLATFORMS: Array<{ value: ProfileSocialPlatform; label: string }> = [
  { value: "website", label: "Website" },
  { value: "instagram", label: "Instagram" },
  { value: "x", label: "X / Twitter" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "goodreads", label: "Goodreads" },
];

const GENDERS = [
  { value: "male", label: "Man" },
  { value: "female", label: "Woman" },
  { value: "nonbinary", label: "Non-binary" },
  { value: "other", label: "Something else" },
  { value: "prefer-not", label: "Prefer not to say" },
];

const emptyDraft: ProfileDraft = {
  name: "",
  dob: "",
  gender: "",
  bio: "",
  avatarUrl: "",
  craft: "",
  location: "",
  socialLinks: [],
};

function dateForInput(value?: string) {
  if (!value) return "";
  const match = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (match) return `${match[1]}-${match[2].padStart(2, "0")}-${match[3].padStart(2, "0")}`;
  return "";
}

function validHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function validAvatarReference(value: string) {
  return validHttpUrl(value) || /^\/uploads\/profile-photos\/[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$/.test(value);
}

function getAge(dateValue: string) {
  const parts = dateValue.split("-").map(Number);
  if (parts.length !== 3 || parts.some((part) => !Number.isInteger(part))) return -1;
  const [year, month, day] = parts;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.toISOString().slice(0, 10) !== dateValue) return -1;
  const now = new Date();
  let age = now.getUTCFullYear() - date.getUTCFullYear();
  if (now.getUTCMonth() < date.getUTCMonth() || (now.getUTCMonth() === date.getUTCMonth() && now.getUTCDate() < date.getUTCDate())) age -= 1;
  return age;
}

function latestAllowedBirthDate() {
  const date = new Date();
  date.setUTCFullYear(date.getUTCFullYear() - 13);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "U";
}

export default function EditProfilePage() {
  const router = useRouter();
  const { user, accessToken, hasHydrated, setUser } = useAuthStore();
  const userId = user?._id;
  const [profile, setProfile] = useState<IMyProfile | null>(null);
  const [draft, setDraft] = useState<ProfileDraft>(emptyDraft);
  const [loading, setLoading] = useState(true);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [newPlatform, setNewPlatform] = useState<ProfileSocialPlatform>("website");
  const [newUrl, setNewUrl] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoPreviewFailed, setPhotoPreviewFailed] = useState(false);

  useEffect(() => {
    if (!photoFile) {
      setPhotoPreview("");
      return;
    }
    const previewUrl = URL.createObjectURL(photoFile);
    setPhotoPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [photoFile]);

  const profileHref = profile?._id || userId ? `/profile/${profile?._id ?? userId}` : "/";
  const avatarPreviewSrc = photoPreview || (draft.avatarUrl ? getFileUrl(draft.avatarUrl) ?? "" : "");
  const hasChanges = useMemo(() => {
    if (!profile) return false;
    return Boolean(photoFile) || JSON.stringify(draft) !== JSON.stringify({
      name: profile.name ?? "",
      dob: dateForInput(profile.dob),
      gender: profile.gender ?? "",
      bio: profile.bio ?? "",
      avatarUrl: profile.avatarUrl ?? "",
      craft: profile.craft ?? "",
      location: profile.location ?? "",
      socialLinks: (profile.socialLinks ?? []).map(({ platform, url }) => ({ platform, url })),
    });
  }, [draft, photoFile, profile]);

  const applyProfile = useCallback((data: IMyProfile) => {
    setProfile(data);
    setPhotoFile(null);
    setPhotoPreviewFailed(false);
    setDraft({
      name: data.name ?? "",
      dob: dateForInput(data.dob),
      gender: data.gender ?? "",
      bio: data.bio ?? "",
      avatarUrl: data.avatarUrl ?? "",
      craft: data.craft ?? "",
      location: data.location ?? "",
      socialLinks: (data.socialLinks ?? []).map(({ platform, url }) => ({ platform, url })),
    });
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!accessToken || !userId) {
      router.replace("/login");
      return;
    }

    let active = true;
    setLoading(true);
    setError("");
    getMyProfile()
      .then((response) => {
        if (active) applyProfile(response.data);
      })
      .catch((err: unknown) => {
        if (!active) return;
        const message = (err as AxiosError<{ message?: string }>)?.response?.data?.message;
        setError(message || "Could not load your profile. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [accessToken, applyProfile, hasHydrated, loadAttempt, router, userId]);

  const setField = <K extends keyof Omit<ProfileDraft, "socialLinks">>(key: K, value: ProfileDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    if (key === "avatarUrl") setPhotoFile(null);
    setPhotoPreviewFailed(false);
    setError("");
    setSaved(false);
  };

  const validate = () => {
    if (draft.name.trim().length < 3 || draft.name.trim().length > 80) return "Name must be between 3 and 80 characters.";
    if (!draft.dob || getAge(draft.dob) < 13 || getAge(draft.dob) > 120) return "Enter a valid date of birth. You must be at least 13 years old.";
    if (!GENDERS.some((item) => item.value === draft.gender)) return "Choose a gender option.";
    if ((draft.bio ?? "").trim().length > 500) return "Bio cannot exceed 500 characters.";
    if ((draft.craft ?? "").trim().length > 80) return "Craft cannot exceed 80 characters.";
    if ((draft.location ?? "").trim().length > 100) return "Location cannot exceed 100 characters.";
    if (draft.avatarUrl && !validAvatarReference(draft.avatarUrl)) return "Choose a valid HTTP or HTTPS image URL.";
    if (draft.socialLinks.length > 8) return "You can add up to 8 social links.";
    if (draft.socialLinks.some((link) => !validHttpUrl(link.url))) return "Every social link needs a valid HTTP or HTTPS URL.";
    if (new Set(draft.socialLinks.map((link) => link.url.trim().toLowerCase())).size !== draft.socialLinks.length) return "Remove duplicate social links before saving.";
    return "";
  };

  const updateSocialLink = (index: number, changes: Partial<IProfileSocialLink>) => {
    setDraft((current) => ({
      ...current,
      socialLinks: current.socialLinks.map((link, itemIndex) => itemIndex === index ? { ...link, ...changes } : link),
    }));
    setError("");
    setSaved(false);
  };

  const removeSocialLink = (index: number) => {
    setDraft((current) => ({ ...current, socialLinks: current.socialLinks.filter((_, itemIndex) => itemIndex !== index) }));
    setError("");
    setSaved(false);
  };

  const handleAddLink = () => {
    const url = newUrl.trim();
    if (!validHttpUrl(url)) {
      setError("Enter a full link beginning with http:// or https://.");
      return;
    }
    if (draft.socialLinks.length >= 8) {
      setError("You can add up to 8 social links.");
      return;
    }
    if (draft.socialLinks.some((link) => link.url.toLowerCase() === url.toLowerCase())) {
      setError("That link is already on your profile.");
      return;
    }
    setDraft((current) => ({ ...current, socialLinks: [...current.socialLinks, { platform: newPlatform, url }] }));
    setNewUrl("");
    setError("");
    setSaved(false);
  };

  const handlePhotoSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Choose a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Profile photos must be 5 MB or smaller.");
      return;
    }
    setPhotoFile(file);
    setPhotoPreviewFailed(false);
    setError("");
    setSaved(false);
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setSaved(false);
      return;
    }

    setSaving(true);
    setError("");
    try {
      const profilePayload: IProfileUpdatePayload = {
        ...draft,
        name: draft.name.trim(),
        bio: draft.bio?.trim() ?? "",
        avatarUrl: draft.avatarUrl?.trim() ?? "",
        craft: draft.craft?.trim() ?? "",
        location: draft.location?.trim() ?? "",
        socialLinks: draft.socialLinks.map((link) => ({ ...link, url: link.url.trim() })),
      };
      let payload: IProfileUpdatePayload | FormData = profilePayload;
      if (photoFile) {
        const formData = new FormData();
        formData.append("name", profilePayload.name);
        formData.append("dob", profilePayload.dob);
        formData.append("gender", profilePayload.gender);
        formData.append("bio", profilePayload.bio ?? "");
        formData.append("avatarUrl", profilePayload.avatarUrl ?? "");
        formData.append("craft", profilePayload.craft ?? "");
        formData.append("location", profilePayload.location ?? "");
        formData.append("socialLinks", JSON.stringify(profilePayload.socialLinks));
        formData.append("avatar", photoFile);
        payload = formData;
      }
      const response = await updateMyProfile(payload);
      applyProfile(response.data);
      setUser(response.data);
      setSaved(true);
    } catch (err: unknown) {
      const response = (err as AxiosError<{ message?: string; errors?: string[] }>)?.response?.data;
      setError(response?.errors?.join(" ") || response?.message || "Could not save your profile. Please try again.");
      setSaved(false);
    } finally {
      setSaving(false);
    }
  };

  const discardChanges = () => {
    if (profile) applyProfile(profile);
    setError("");
    setSaved(false);
  };

  if (!hasHydrated || !accessToken || !user) return null;

  return (
    <div className="edit-profile-page min-h-screen bg-slate-50 px-4 pb-20 pt-24 text-slate-900 dark:bg-[#050507] dark:text-white">
      <div className="edit-profile-wrap mx-auto max-w-4xl">
        <Link href={profileHref} className="edit-profile-back"><ArrowLeft className="h-4 w-4" />Back to profile</Link>

        <header className="edit-profile-header">
          <div>
            <p className="edit-profile-eyebrow">YOUR ACCOUNT</p>
            <h1>Edit your profile</h1>
            <p>Update the details people see on your creator profile and keep your account information current.</p>
          </div>
          <Link href={profileHref} className="edit-profile-public-link"><ExternalLink className="h-4 w-4" />View profile</Link>
        </header>

        {loading ? (
          <div className="edit-profile-state"><Loader2 className="h-6 w-6 animate-spin" />Loading profile…</div>
        ) : error && !profile ? (
          <div className="edit-profile-state is-error">{error}<button type="button" onClick={() => setLoadAttempt((attempt) => attempt + 1)}>Try again</button></div>
        ) : (
          <form onSubmit={handleSave} className="edit-profile-form">
            <section className="edit-profile-card">
              <div className="edit-profile-section-heading">
                <span className="edit-profile-section-icon"><UserRound className="h-5 w-5" /></span>
                <div><h2>Public profile</h2><p>These details appear on your public profile.</p></div>
              </div>

              <div className="edit-profile-photo-row">
                <div className="edit-profile-avatar">
                  {avatarPreviewSrc && !photoPreviewFailed ? <Image src={avatarPreviewSrc} alt="Profile photo preview" width={84} height={84} unoptimized onError={() => setPhotoPreviewFailed(true)} /> : <span>{initials(draft.name)}</span>}
                  <span className="edit-profile-avatar-badge"><ImagePlus className="h-4 w-4" /></span>
                </div>
                <div className="edit-profile-photo-copy">
                  <strong>Profile photo</strong>
                  <p>Upload a JPG, PNG, or WebP up to 5 MB, or use an image URL.</p>
                  <div className="edit-profile-photo-controls">
                    <label className="edit-profile-upload-button"><ImagePlus className="h-4 w-4" />Choose photo<input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoSelection} /></label>
                    {photoFile && <span className="edit-profile-photo-filename">{photoFile.name}</span>}
                    {draft.avatarUrl && <button type="button" onClick={() => setField("avatarUrl", "")}>Remove photo</button>}
                  </div>
                </div>
              </div>

              <div className="edit-profile-fields">
                <label className="edit-profile-field edit-field-wide">
                  <span>Photo URL</span>
                  <input type="text" value={draft.avatarUrl ?? ""} onChange={(event) => setField("avatarUrl", event.target.value)} placeholder="https://example.com/your-photo.jpg" />
                </label>
                <label className="edit-profile-field">
                  <span>Display name</span>
                  <input type="text" required minLength={3} maxLength={80} value={draft.name} onChange={(event) => setField("name", event.target.value)} placeholder="Your name" />
                </label>
                <label className="edit-profile-field">
                  <span>What you create</span>
                  <input type="text" maxLength={80} value={draft.craft ?? ""} onChange={(event) => setField("craft", event.target.value)} placeholder="Writer, poet, illustrator…" />
                </label>
                <label className="edit-profile-field edit-field-wide">
                  <span>Bio <small>{(draft.bio ?? "").length}/500</small></span>
                  <textarea value={draft.bio ?? ""} onChange={(event) => setField("bio", event.target.value)} maxLength={500} rows={4} placeholder="Tell readers a little about yourself and your work." />
                </label>
                <label className="edit-profile-field edit-field-wide">
                  <span>Location <small>Optional</small></span>
                  <input type="text" maxLength={100} value={draft.location ?? ""} onChange={(event) => setField("location", event.target.value)} placeholder="City, country" />
                </label>
              </div>

              <div className="edit-profile-social">
                <div className="edit-profile-subheading"><Globe2 className="h-4 w-4" /><h3>Social links</h3><span>{draft.socialLinks.length}/8</span></div>
                {draft.socialLinks.length > 0 ? (
                  <div className="edit-profile-link-list">
                    {draft.socialLinks.map((link, index) => (
                      <div className="edit-profile-link-row" key={`${link.platform}-${index}`}>
                        <select aria-label="Social platform" value={link.platform} onChange={(event) => updateSocialLink(index, { platform: event.target.value as ProfileSocialPlatform })}>
                          {SOCIAL_PLATFORMS.map((platform) => <option key={platform.value} value={platform.value}>{platform.label}</option>)}
                        </select>
                        <input type="url" aria-label={`${link.platform} URL`} value={link.url} onChange={(event) => updateSocialLink(index, { url: event.target.value })} />
                        <button type="button" onClick={() => removeSocialLink(index)} aria-label="Remove social link"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    ))}
                  </div>
                ) : <p className="edit-profile-empty-links">No social links yet. Add your website or a social account below.</p>}

                <div className="edit-profile-add-link">
                  <select aria-label="New link platform" value={newPlatform} onChange={(event) => setNewPlatform(event.target.value as ProfileSocialPlatform)}>
                    {SOCIAL_PLATFORMS.map((platform) => <option key={platform.value} value={platform.value}>{platform.label}</option>)}
                  </select>
                  <input type="url" value={newUrl} onChange={(event) => setNewUrl(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); handleAddLink(); } }} placeholder="https://example.com" aria-label="New social link URL" />
                  <button type="button" onClick={handleAddLink} disabled={draft.socialLinks.length >= 8}><Plus className="h-4 w-4" />Add link</button>
                </div>
              </div>
            </section>

            <section className="edit-profile-card">
              <div className="edit-profile-section-heading">
                <span className="edit-profile-section-icon"><UserRound className="h-5 w-5" /></span>
                <div><h2>Personal details</h2><p>These details are private and only visible to you.</p></div>
              </div>

              <div className="edit-profile-fields">
                <label className="edit-profile-field">
                  <span>Email or phone</span>
                  <input type="text" value={profile?.identifier ?? user.identifier ?? ""} disabled />
                </label>
                <label className="edit-profile-field">
                  <span>Account type</span>
                  <input type="text" value={profile?.role ?? user.role ?? "user"} disabled className="capitalize" />
                </label>
                <label className="edit-profile-field">
                  <span>Date of birth</span>
                  <input type="date" required value={draft.dob} max={latestAllowedBirthDate()} onChange={(event) => setField("dob", event.target.value)} />
                </label>
                <label className="edit-profile-field">
                  <span>Gender</span>
                  <select required value={draft.gender} onChange={(event) => setField("gender", event.target.value)}>
                    <option value="">Select an option</option>
                    {GENDERS.map((gender) => <option key={gender.value} value={gender.value}>{gender.label}</option>)}
                  </select>
                </label>
              </div>
            </section>

            {error && <div className="edit-profile-error" role="alert">{error}</div>}
            {saved && <div className="edit-profile-success"><Check className="h-4 w-4" />Your profile has been saved.</div>}

            <div className="edit-profile-actions">
              <button type="button" className="edit-profile-discard" onClick={discardChanges} disabled={!hasChanges || saving}>Discard changes</button>
              <button type="submit" className="edit-profile-save" disabled={saving || !hasChanges}>
                {saving ? <><Loader2 className="h-4 w-4 animate-spin" />Saving…</> : <><Save className="h-4 w-4" />Save changes</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
