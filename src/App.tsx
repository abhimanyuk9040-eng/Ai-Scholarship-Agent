import { useState, useEffect, FormEvent } from "react";
import {
  GraduationCap,
  User,
  Mail,
  Phone,
  MapPin,
  Wallet,
  BookOpen,
  Calendar,
  FileText,
  Award,
  Sparkles,
  Loader2,
  AlertCircle,
  Search,
  ArrowRight,
  CheckCircle2,
  Clock,
  IndianRupee,
  Send,
} from "lucide-react";

// Single constant for the webhook URL — swap Test for Production here.
const WEBHOOK_URL = "https://workflow.ccbp.in/webhook-test/scholarship-assistant";

type Scholarship = {
  name?: string;
  scholarship_name?: string;
  amount?: string;
  scholarship_amount?: string;
  eligibility?: string;
  deadline?: string;
  documents?: string | string[];
  required_documents?: string | string[];
  apply_url?: string;
  applyUrl?: string;
  url?: string;
  link?: string;
  [key: string]: unknown;
};

type FormState = {
  full_name: string;
  age: string;
  gender: string;
  state: string;
  category: string;
  annual_income: string;
  education_level: string;
  course_name: string;
  email: string;
  phone: string;
};

const INITIAL_FORM: FormState = {
  full_name: "",
  age: "",
  gender: "",
  state: "",
  category: "",
  annual_income: "",
  education_level: "",
  course_name: "",
  email: "",
  phone: "",
};

const LOADING_MESSAGES = [
  "Analyzing your profile...",
  "Finding matching scholarships...",
  "Checking eligibility...",
  "Preparing recommendations...",
];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir",
];

const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS", "Minority", "PWD"];

const EDUCATION_LEVELS = [
  "Class 10",
  "Class 11-12",
  "Diploma",
  "UG",
  "PG",
  "Doctoral",
  "Postdoctoral",
];

const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];

function App() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "empty">("idle");
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);

  // Cycle through loading messages
  useEffect(() => {
    if (status !== "loading") return;
    setMessageIndex(0);
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [status]);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setScholarships([]);
    setErrorMessage("");

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      const list = extractScholarships(data);

      if (list.length === 0) {
        setStatus("empty");
      } else {
        setScholarships(list);
        setStatus("success");
      }
    } catch (err) {
      console.error("Scholarship webhook error:", err);
      setErrorMessage("Unable to connect to the Scholarship AI service. Please try again.");
      setStatus("error");
    }
  };

  const reset = () => {
    setStatus("idle");
    setScholarships([]);
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-emerald-50/30">
      {/* Decorative background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute top-1/3 -left-40 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 h-96 w-96 rounded-full bg-amber-200/20 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 shadow-lg shadow-blue-600/20">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-900">ScholarPath AI</h1>
                <p className="text-xs text-slate-500">Find scholarships tailored to you</p>
              </div>
            </div>
            <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 sm:flex">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Matching
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
          {/* Hero */}
          {status === "idle" && (
            <section className="mb-10 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
                <Award className="h-4 w-4" />
                Over 1000+ scholarships matched instantly
              </div>
              <h2 className="mx-auto max-w-3xl text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
                Discover Scholarships Built for{" "}
                <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                  Your Profile
                </span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
                Fill in your details below and let our AI find the best scholarship opportunities matched to your background, education, and needs.
              </p>
            </section>
          )}

          {/* Form */}
          {status === "idle" && (
            <form
              onSubmit={handleSubmit}
              className="mx-auto max-w-3xl rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-sm sm:p-8"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Full Name" icon={<User className="h-4 w-4" />} required>
                  <input
                    type="text"
                    required
                    value={form.full_name}
                    onChange={(e) => handleChange("full_name", e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="input-base"
                  />
                </Field>

                <Field label="Age" icon={<Calendar className="h-4 w-4" />} required>
                  <input
                    type="number"
                    required
                    min={1}
                    max={120}
                    value={form.age}
                    onChange={(e) => handleChange("age", e.target.value)}
                    placeholder="e.g. 19"
                    className="input-base"
                  />
                </Field>

                <Field label="Gender" icon={<User className="h-4 w-4" />} required>
                  <select
                    required
                    value={form.gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                    className="input-base"
                  >
                    <option value="">Select gender</option>
                    {GENDERS.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </Field>

                <Field label="State" icon={<MapPin className="h-4 w-4" />} required>
                  <select
                    required
                    value={form.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                    className="input-base"
                  >
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Category" icon={<User className="h-4 w-4" />} required>
                  <select
                    required
                    value={form.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                    className="input-base"
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Annual Income (INR)" icon={<Wallet className="h-4 w-4" />} required>
                  <div className="relative">
                    <IndianRupee className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number"
                      required
                      min={0}
                      value={form.annual_income}
                      onChange={(e) => handleChange("annual_income", e.target.value)}
                      placeholder="e.g. 250000"
                      className="input-base pl-9"
                    />
                  </div>
                </Field>

                <Field label="Education Level" icon={<BookOpen className="h-4 w-4" />} required>
                  <select
                    required
                    value={form.education_level}
                    onChange={(e) => handleChange("education_level", e.target.value)}
                    className="input-base"
                  >
                    <option value="">Select level</option>
                    {EDUCATION_LEVELS.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Course Name" icon={<BookOpen className="h-4 w-4" />} required>
                  <input
                    type="text"
                    required
                    value={form.course_name}
                    onChange={(e) => handleChange("course_name", e.target.value)}
                    placeholder="e.g. B.Tech Computer Science"
                    className="input-base"
                  />
                </Field>

                <Field label="Email" icon={<Mail className="h-4 w-4" />} required>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="e.g. you@example.com"
                    className="input-base"
                  />
                </Field>

                <Field label="Phone" icon={<Phone className="h-4 w-4" />} required>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="input-base"
                  />
                </Field>
              </div>

              <button
                type="submit"
                className="group mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:shadow-xl hover:shadow-blue-600/30 hover:brightness-105 active:scale-[0.99]"
              >
                <Search className="h-5 w-5 transition-transform group-hover:scale-110" />
                Find Scholarships
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>

              <p className="mt-3 text-center text-xs text-slate-400">
                Your information is sent securely to our AI matching service.
              </p>
            </form>
          )}

          {/* Loading */}
          {status === "loading" && (
            <LoadingState message={LOADING_MESSAGES[messageIndex]} messageIndex={messageIndex} />
          )}

          {/* Error */}
          {status === "error" && (
            <ResultShell
              icon={<AlertCircle className="h-10 w-10 text-red-500" />}
              title="Something went wrong"
              message={errorMessage || "Unable to connect to the Scholarship AI service. Please try again."}
              onReset={reset}
              resetLabel="Try Again"
            />
          )}

          {/* Empty */}
          {status === "empty" && (
            <ResultShell
              icon={<Search className="h-10 w-10 text-amber-500" />}
              title="Please check your mailbox"
              message="Kindly, we share all information at your mail."
              onReset={reset}
              resetLabel="Refine Search"
            />
          )}

          {/* Success */}
          {status === "success" && (
            <section>
              <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    {scholarships.length} scholarship{scholarships.length === 1 ? "" : "s"} found
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Your Scholarship Recommendations
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Tailored to {form.full_name || "your profile"} — review eligibility and apply.
                  </p>
                </div>
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  <Search className="h-4 w-4" />
                  New Search
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {scholarships.map((s, i) => (
                  <ScholarshipCard key={i} scholarship={s} index={i} />
                ))}
              </div>
            </section>
          )}
        </main>

        <footer className="relative z-10 border-t border-slate-200/60 py-6 text-center text-xs text-slate-400">
          ScholarPath AI — Connecting students to opportunity.
        </footer>
      </div>
    </div>
  );
}

/* ---------- Helpers ---------- */

function extractScholarships(data: unknown): Scholarship[] {
  if (Array.isArray(data)) return data as Scholarship[];
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    for (const key of ["scholarships", "results", "data", "recommendations", "items", "output"]) {
      const val = obj[key];
      if (Array.isArray(val)) return val as Scholarship[];
    }
  }
  return [];
}

function normalizeList(value: string | string[] | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean) as string[];
  return value
    .split(/[,;\n]|•|\u2022/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/* ---------- Small components ---------- */

function Field({
  label,
  icon,
  required,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
        <span className="text-slate-400">{icon}</span>
        {label}
        {required && <span className="text-red-400">*</span>}
      </span>
      {children}
    </label>
  );
}

function LoadingState({ message, messageIndex }: { message: string; messageIndex: number }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center py-20 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-ping rounded-full bg-blue-400/30" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-emerald-500 shadow-xl shadow-blue-600/30">
          <Loader2 className="h-10 w-10 animate-spin text-white" />
        </div>
      </div>
      <div className="mb-2 flex items-center gap-2 text-lg font-semibold text-slate-800">
        <Sparkles className="h-5 w-5 text-blue-500" />
        {message}
      </div>
      <div className="mt-5 flex w-full max-w-xs gap-1.5">
        {LOADING_MESSAGES.map((_, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200"
          >
            <div
              className={`h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-500 ${
                i <= messageIndex ? "w-full" : "w-0"
              }`}
            />
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-slate-500">This usually takes a few seconds.</p>
    </div>
  );
}

function ResultShell({
  icon,
  title,
  message,
  onReset,
  resetLabel,
}: {
  icon: React.ReactNode;
  title: string;
  message: string;
  onReset: () => void;
  resetLabel: string;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center py-20 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg shadow-slate-200">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold text-slate-900">{title}</h3>
      <p className="mb-6 text-sm text-slate-600">{message}</p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:brightness-105"
      >
        <Send className="h-4 w-4" />
        {resetLabel}
      </button>
    </div>
  );
}

function ScholarshipCard({ scholarship, index }: { scholarship: Scholarship; index: number }) {
  const name = scholarship.name || scholarship.scholarship_name || "Scholarship Opportunity";
  const amount = scholarship.amount || scholarship.scholarship_amount || "Varies";
  const eligibility = scholarship.eligibility || "Contact provider for eligibility details";
  const deadline = scholarship.deadline || "Not specified";
  const docs = normalizeList(scholarship.documents || scholarship.required_documents);
  const applyUrl = scholarship.apply_url || scholarship.applyUrl || scholarship.url || scholarship.link || "#";

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-lg shadow-slate-200/40 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-300/50"
      style={{ animation: `cardFadeIn 0.5s ease-out ${index * 0.08}s both` }}
    >
      {/* Top accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600" />

      <div className="flex flex-1 flex-col p-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-emerald-50 text-blue-600">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-snug text-slate-900">{name}</h3>
              <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                <IndianRupee className="h-3 w-3" />
                {amount}
              </div>
            </div>
          </div>
        </div>

        {/* Eligibility */}
        <div className="mb-4">
          <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Eligibility
          </h4>
          <p className="text-sm leading-relaxed text-slate-700">{eligibility}</p>
        </div>

        {/* Deadline */}
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-amber-50/70 px-3 py-2">
          <Clock className="h-4 w-4 text-amber-600" />
          <span className="text-xs font-medium text-amber-700">Deadline:</span>
          <span className="text-sm font-semibold text-amber-900">{deadline}</span>
        </div>

        {/* Documents */}
        {docs.length > 0 && (
          <div className="mb-5">
            <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <FileText className="h-3.5 w-3.5" />
              Required Documents
            </h4>
            <ul className="flex flex-wrap gap-1.5">
              {docs.map((doc, i) => (
                <li
                  key={i}
                  className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                >
                  {doc}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Apply button */}
        <div className="mt-auto pt-2">
          <a
            href={applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:shadow-lg hover:shadow-blue-600/30 hover:brightness-105 active:scale-[0.99]"
          >
            Apply Now
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </a>
        </div>
      </div>
    </article>
  );
}

export default App;
