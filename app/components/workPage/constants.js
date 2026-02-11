// ─── GENRE TAGS ───
export const GENRES = [
  "Mystery",
  "Thriller",
  "Romance",
  "Science Fiction",
  "Fantasy",
  "Horror",
  "Historical",
  "Literary Fiction",
  "Drama",
  "Adventure",
  "Philosophy",
  "Technology",
  "Health & Wellness",
  "True Crime",
  "Humor",
  "Political",
];

// ─── BOOK CATEGORIES ───
export const CATEGORIES = [
  "Fiction",
  "Non-Fiction",
  "Academic / Textbook",
  "Children's Books",
  "Young Adult",
  "Poetry",
  "Comics / Graphic Novels",
  "Reference / Encyclopedia",
  "Religious / Spiritual",
  "Cookbook / Food",
  "Self-Help / Personal Development",
  "Business / Finance",
  "Biography / Memoir",
  "Travel",
  "Other",
];

// ─── LANGUAGES ───
export const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "bn", label: "Bengali" },
  { value: "ta", label: "Tamil" },
  { value: "te", label: "Telugu" },
  { value: "mr", label: "Marathi" },
  { value: "gu", label: "Gujarati" },
  { value: "kn", label: "Kannada" },
  { value: "ml", label: "Malayalam" },
  { value: "pa", label: "Punjabi" },
  { value: "ur", label: "Urdu" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
  { value: "ar", label: "Arabic" },
  { value: "other", label: "Other" },
];

// ─── AUDIENCE ───
export const AUDIENCES = [
  "General Audience",
  "Children (0–12)",
  "Teenagers (13–17)",
  "Young Adults (18–25)",
  "Adults (25+)",
  "Academic / Professional",
];

// ─── EDITIONS ───
export const EDITIONS = [
  "1st Edition",
  "2nd Edition",
  "3rd Edition",
  "Revised Edition",
  "Special Edition",
  "Limited Edition",
  "Collector's Edition",
];

// ─── COPYRIGHT OPTIONS ───
export const COPYRIGHT_OPTIONS = [
  {
    value: "standard",
    badge: "Standard",
    badgeType: "standard",
    title: "All Rights Reserved",
    desc: "Full protection — no reproduction without your written consent.",
  },
  {
    value: "cc-by",
    badge: "CC BY",
    badgeType: "cc",
    title: "Creative Commons — Attribution",
    desc: "Others may share and adapt with proper credit to you.",
  },
  {
    value: "cc-by-nc",
    badge: "CC BY-NC",
    badgeType: "cc",
    title: "Attribution — Non-Commercial",
    desc: "Sharing allowed with credit, but not for commercial gain.",
  },
  {
    value: "cc-by-sa",
    badge: "CC BY-SA",
    badgeType: "cc",
    title: "Attribution — ShareAlike",
    desc: "Others may remix if they credit you and license under same terms.",
  },
  {
    value: "cc-by-nc-nd",
    badge: "CC BY-NC-ND",
    badgeType: "cc",
    title: "Non-Commercial, No Derivatives",
    desc: "Sharing with credit only — no modifications or commercial use.",
  },
  {
    value: "public-domain",
    badge: "Public",
    badgeType: "public",
    title: "Public Domain",
    desc: "You waive all rights. Anyone may use your work freely.",
  },
];

// ─── TOGGLE OPTIONS ───
export const DISTRIBUTION_TOGGLES = [
  {
    key: "allowDownload",
    label: "Available for Download",
    desc: "Readers can download the PDF after purchase",
  },
  {
    key: "allowPreview",
    label: "Allow Previews",
    desc: "Let readers preview sample pages before buying",
  },
  {
    key: "isExclusive",
    label: "Exclusive to mebookmeta",
    desc: "Available only on our platform",
  },
  {
    key: "preOrderEnabled",
    label: "Pre-Order Enabled",
    desc: "Accept orders before publication date",
  },
];

// ─── INITIAL FORM STATE ───
export const INITIAL_FORM_STATE = {
  title: "",
  subtitle: "",
  description: "",
  author: "",
  coAuthors: "",
  language: "en",
  pageCount: "",
  publicationDate: "",
  isbn: "",
  edition: "1st Edition",
  publisher: "",
  category: "",
  targetAudience: "",
  customTags: "",
  copyrightType: "standard",
  copyrightYear: new Date().getFullYear().toString(),
  copyrightHolder: "",
  price: "",
  currency: "INR",
  allowDownload: true,
  allowPreview: true,
  isExclusive: false,
  preOrderEnabled: false,
  rightsConfirmed: false,
  termsAccepted: false,
  emailOptIn: false,
};
