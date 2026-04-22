"use client";

/**
 * SHOWCASE — test lokal, MOS e komito në GitHub
 * Teston TË GJITHA komponentet e library-së për t'u siguruar që funksionojnë.
 */

import * as React from "react";

// ─── UI Primitives ────────────────────────────────────────────────────────────
import {
  Button,
  Input,
  Textarea,
  Label,
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  Badge,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
  Tabs, TabsList, TabsTrigger, TabsContent,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter, DialogClose,
  Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription,
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter,
  AlertDialogAction, AlertDialogCancel,
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
  Checkbox,
  Switch,
  Avatar, AvatarFallback,
  Tooltip, TooltipTrigger, TooltipContent, TooltipProvider,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator,
  Pagination,
  Separator,
  Spinner,
  Skeleton,
  Progress,
  ProgressBar,
  Breadcrumb,
  FileUpload,
  IconButton,
  RadioGroup, RadioItem,
  SocialButton,
  Stepper,
  TagBadge,
  UserAvatarWithBadge,
} from "@/components/ui";

// ─── Icons ────────────────────────────────────────────────────────────────────
import {
  ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, ChevronUpIcon,
  ArrowRightIcon, ArrowLeftIcon, MenuIcon, CloseIcon,
  CheckIcon, CheckCircleIcon, AlertCircleIcon, InfoIcon, XCircleIcon,
  HeartIcon, BookmarkIcon, ShareIcon, SearchIcon, FilterIcon,
  UserIcon, UsersIcon, LogInIcon, LogOutIcon, LockIcon, EyeIcon, EyeOffIcon,
  MailIcon, PhoneIcon, MapPinIcon, CalendarIcon, ClockIcon,
  FileIcon, ImageIcon, UploadIcon, DownloadIcon,
  HomeIcon, LayoutDashboardIcon, SettingsIcon, BellIcon, InboxIcon,
  TrendingUpIcon, TrendingDownIcon, DollarSignIcon, CreditCardIcon,
  StarIcon, FlagIcon, PauseIcon, TrashIcon, EditIcon, PlusIcon,
  GlobeIcon, LinkIcon, MoreHorizontalIcon,
  ShieldIcon, BadgeCheckIcon, SparklesIcon,
  FacebookIcon, TwitterIcon, WhatsappIcon,
  MessageCircleIcon, GiftIcon, TargetIcon, SendIcon, TagIcon,
  AlertTriangleIcon, MegaphoneIcon, WalletIcon, GoogleIcon,
  BoldIcon, ItalicIcon, ListIcon, HeadingIcon,
  InstagramIcon, LinkedinIcon, GithubIcon,
  LoaderIcon, ExternalLinkIcon, MinusIcon,
} from "@/components/icons";

// ─── Layout ───────────────────────────────────────────────────────────────────
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { EmptyState } from "@/components/layout/EmptyState";

// ─── Public ───────────────────────────────────────────────────────────────────
import { CampaignCard } from "@/components/public/CampaignCard";
import { VolunteerCard } from "@/components/public/VolunteerCard";
import { BlogCard } from "@/components/public/BlogCard";
import { StatisticCard } from "@/components/public/StatisticCard";
import { CategoryCard } from "@/components/public/CategoryCard";
import { ValueCard } from "@/components/public/ValueCard";
import { SearchBar } from "@/components/public/SearchBar";
import { FilterChips } from "@/components/public/FilterChips";
import { DonationAmountPicker } from "@/components/public/DonationAmountPicker";
import { StatsBar } from "@/components/public/StatsBar";
import { FAQAccordion } from "@/components/public/FAQAccordion";
import { ShareButtons } from "@/components/public/ShareButtons";
import { DonorList } from "@/components/public/DonorList";
import { BookmarkButton } from "@/components/public/BookmarkButton";
import { ContactInfoCard } from "@/components/public/ContactInfoCard";
import { NewsletterSignup } from "@/components/public/NewsletterSignup";

// ─── Dashboard ────────────────────────────────────────────────────────────────
import { StatCard } from "@/components/dashboard/StatCard";
import { CampaignGoalCard } from "@/components/dashboard/CampaignGoalCard";
import { CreatorCTA } from "@/components/dashboard/CreatorCTA";
import { PublicProfileHero } from "@/components/dashboard/PublicProfileHero";
import { StripeVerificationCard } from "@/components/dashboard/StripeVerificationCard";
import { ActivityLogItem } from "@/components/dashboard/ActivityLogItem";
import { ApplicationCard } from "@/components/dashboard/ApplicationCard";
import { MessageBubble } from "@/components/dashboard/MessageBubble";
import { OnboardingStepper } from "@/components/dashboard/OnboardingStepper";

// ─── Auth ─────────────────────────────────────────────────────────────────────
import { ProfileSetupForm } from "@/components/auth/ProfileSetupForm";
import { RoleSelectionCard } from "@/components/auth/RoleSelectionCard";
import { InterestPicker } from "@/components/auth/InterestPicker";

// ─── Admin ────────────────────────────────────────────────────────────────────
import { ModerationActions } from "@/components/admin/ModerationActions";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { AdminFilterBar } from "@/components/admin/AdminFilterBar";
import { ActionButtonGroup } from "@/components/admin/ActionButtonGroup";
import { AdminSettingsCard } from "@/components/admin/AdminSettingsCard";
import { AdminToggleSwitch } from "@/components/admin/AdminToggleSwitch";

// ─────────────────────────────────────────────────────────────────────────────

const DESIGN_COLORS = [
  { name: "unify-blue",  hex: "#009eff" },
  { name: "unify-brown", hex: "#3b2f2f" },
  { name: "unify-cream", hex: "#faf7f2" },
  { name: "unify-green", hex: "#22c55e" },
  { name: "background",  hex: "#faf7f2" },
  { name: "card",        hex: "#ffffff" },
  { name: "border",      hex: "#e5e0d8" },
  { name: "muted",       hex: "#f1ede6" },
  { name: "foreground",  hex: "#1a1a1a" },
  { name: "muted-fg",    hex: "#6b7280" },
  { name: "destructive", hex: "#ef4444" },
  { name: "ring",        hex: "#009eff" },
];

const ALL_ICONS = [
  ["ChevronLeft",    ChevronLeftIcon],   ["ChevronRight",  ChevronRightIcon],
  ["ChevronDown",    ChevronDownIcon],   ["ChevronUp",     ChevronUpIcon],
  ["ArrowRight",     ArrowRightIcon],    ["ArrowLeft",     ArrowLeftIcon],
  ["Menu",           MenuIcon],          ["Close",         CloseIcon],
  ["Check",          CheckIcon],         ["CheckCircle",   CheckCircleIcon],
  ["AlertCircle",    AlertCircleIcon],   ["Info",          InfoIcon],
  ["XCircle",        XCircleIcon],       ["Heart",         HeartIcon],
  ["Bookmark",       BookmarkIcon],      ["Share",         ShareIcon],
  ["Search",         SearchIcon],        ["Filter",        FilterIcon],
  ["User",           UserIcon],          ["Users",         UsersIcon],
  ["LogIn",          LogInIcon],         ["LogOut",        LogOutIcon],
  ["Lock",           LockIcon],          ["Eye",           EyeIcon],
  ["EyeOff",        EyeOffIcon],         ["Mail",          MailIcon],
  ["Phone",          PhoneIcon],         ["MapPin",        MapPinIcon],
  ["Calendar",       CalendarIcon],      ["Clock",         ClockIcon],
  ["File",           FileIcon],          ["Image",         ImageIcon],
  ["Upload",         UploadIcon],        ["Download",      DownloadIcon],
  ["Home",           HomeIcon],          ["Dashboard",     LayoutDashboardIcon],
  ["Settings",       SettingsIcon],      ["Bell",          BellIcon],
  ["Inbox",          InboxIcon],         ["TrendingUp",    TrendingUpIcon],
  ["TrendingDown",   TrendingDownIcon],  ["DollarSign",    DollarSignIcon],
  ["CreditCard",     CreditCardIcon],    ["Star",          StarIcon],
  ["Flag",           FlagIcon],          ["Pause",         PauseIcon],
  ["Trash",          TrashIcon],         ["Edit",          EditIcon],
  ["Plus",           PlusIcon],          ["Globe",         GlobeIcon],
  ["Link",           LinkIcon],          ["MoreHorizontal",MoreHorizontalIcon],
  ["Shield",         ShieldIcon],        ["BadgeCheck",    BadgeCheckIcon],
  ["Sparkles",       SparklesIcon],      ["Facebook",      FacebookIcon],
  ["Twitter",        TwitterIcon],       ["Whatsapp",      WhatsappIcon],
  ["Instagram",      InstagramIcon],     ["Linkedin",      LinkedinIcon],
  ["Github",         GithubIcon],        ["Google",        GoogleIcon],
  ["MessageCircle",  MessageCircleIcon], ["Gift",          GiftIcon],
  ["Target",         TargetIcon],        ["Send",          SendIcon],
  ["Tag",            TagIcon],           ["AlertTriangle", AlertTriangleIcon],
  ["Megaphone",      MegaphoneIcon],     ["Wallet",        WalletIcon],
  ["Bold",           BoldIcon],          ["Italic",        ItalicIcon],
  ["List",           ListIcon],          ["Heading",       HeadingIcon],
  ["Loader",         LoaderIcon],        ["ExternalLink",  ExternalLinkIcon],
  ["Minus",          MinusIcon],
] as const;

// ─────────────────────────────────────────────────────────────────────────────

export default function ShowcasePage() {
  const [bookmarked, setBookmarked]   = React.useState(false);
  const [switchOn, setSwitchOn]       = React.useState(false);
  const [radioVal, setRadioVal]       = React.useState("a");
  const [roleVal, setRoleVal]         = React.useState("donor");
  const [donationAmt, setDonationAmt] = React.useState(25);
  const [filterChip, setFilterChip]   = React.useState("all");
  const [page, setPage]               = React.useState(3);
  const [toggleAdmin, setToggleAdmin] = React.useState(true);
  const [interests, setInterests]     = React.useState<string[]>(["health", "education"]);

  return (
    <TooltipProvider>
      <main className="min-h-screen bg-background text-foreground">

        {/* HEADER */}
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
          <div className="container flex items-center justify-between py-4">
            <div>
              <p className="font-display text-sm uppercase tracking-widest text-unify-blue">Unify</p>
              <h1 className="font-display text-2xl text-unify-brown">Component Showcase — Test Lokal</h1>
            </div>
            <Badge variant="success">MOS komito në GitHub</Badge>
          </div>
        </header>

        <div className="container space-y-20 py-14">

          {/* ═══ 1. NGJYRAT ═══ */}
          <Section id="colors" title="🎨 Design Tokens — Ngjyrat">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
              {DESIGN_COLORS.map(({ name, hex }) => (
                <div key={name} className="rounded-xl overflow-hidden border border-border">
                  <div className="h-14" style={{ background: hex }} />
                  <div className="p-2 bg-card">
                    <div className="text-xs font-bold text-unify-brown">{name}</div>
                    <div className="font-mono text-[10px] text-muted-foreground">{hex}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* ═══ 2. TIPOGRAFIA ═══ */}
          <Section id="typography" title="🔤 Tipografia">
            <div className="space-y-3 bg-card rounded-2xl border border-border p-8">
              <p className="font-display text-5xl text-unify-brown">Display 5xl — Rowdies Bold</p>
              <p className="font-display text-4xl text-unify-brown">Display 4xl — Rowdies Bold</p>
              <p className="font-display text-3xl text-unify-brown">Display 3xl — Rowdies Bold</p>
              <p className="font-display text-2xl text-unify-brown">Display 2xl — Rowdies Bold</p>
              <p className="font-display text-xl  text-unify-brown">Display xl  — Rowdies Bold</p>
              <Separator />
              <p className="font-sans text-base text-foreground">Body base — Arimo Regular. Lorem ipsum dolor sit amet consectetur.</p>
              <p className="font-sans text-sm  text-foreground">Body sm — Arimo Regular. Lorem ipsum dolor sit amet.</p>
              <p className="font-sans text-xs  text-muted-foreground">Body xs muted — Arimo Regular. Lorem ipsum dolor sit amet.</p>
              <p className="font-sans text-sm  font-bold text-foreground">Body sm Bold — Arimo Bold.</p>
              <code className="rounded bg-muted px-2 py-0.5 font-mono text-sm">@/components/ui  ← barrel import i vetëm i lejuar</code>
            </div>
          </Section>

          {/* ═══ 3. BUTTONS ═══ */}
          <Section id="buttons" title="🔘 Buttons">
            <div className="space-y-5 bg-card rounded-2xl border border-border p-8">
              <Row label="Variante">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
              </Row>
              <Row label="Madhësia">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </Row>
              <Row label="IconButton">
                <IconButton aria-label="settings" size="sm"><SettingsIcon className="h-4 w-4" /></IconButton>
                <IconButton aria-label="heart"><HeartIcon className="h-5 w-5" /></IconButton>
                <IconButton aria-label="share" size="lg"><ShareIcon className="h-6 w-6" /></IconButton>
              </Row>
              <Row label="Me ikonë">
                <Button><HeartIcon className="h-4 w-4" /> Dono</Button>
                <Button variant="outline"><PlusIcon className="h-4 w-4" /> Krijo</Button>
                <Button variant="ghost"><ShareIcon className="h-4 w-4" /> Ndaj</Button>
              </Row>
              <Row label="Disabled">
                <Button disabled>Primary dis.</Button>
                <Button variant="outline" disabled>Outline dis.</Button>
              </Row>
              <Row label="Social">
                <div className="w-56"><SocialButton provider="google" /></div>
                <div className="w-56"><SocialButton provider="facebook" /></div>
              </Row>
            </div>
          </Section>

          {/* ═══ 4. INPUTS / FORMA ═══ */}
          <Section id="forms" title="📝 Forma — Inputs">
            <div className="grid max-w-2xl gap-5 bg-card rounded-2xl border border-border p-8">
              <div>
                <Label htmlFor="inp-name">Emri i plotë</Label>
                <Input id="inp-name" placeholder="Arta Hoxha" />
              </div>
              <div>
                <Label htmlFor="inp-email">Email</Label>
                <Input id="inp-email" type="email" placeholder="arta@shembull.al" />
              </div>
              <div>
                <Label htmlFor="inp-tel">Telefoni</Label>
                <Input id="inp-tel" type="tel" placeholder="+383 44 123 456" />
              </div>
              <div>
                <Label htmlFor="inp-bio">Bio</Label>
                <Textarea id="inp-bio" rows={3} placeholder="Trego pak për veten..." />
              </div>
              <div>
                <Label htmlFor="inp-select">Qyteti</Label>
                <Select>
                  <SelectTrigger id="inp-select"><SelectValue placeholder="Zgjedh qytetin..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pristina">Prishtinë</SelectItem>
                    <SelectItem value="prizren">Prizren</SelectItem>
                    <SelectItem value="peja">Pejë</SelectItem>
                    <SelectItem value="gjakova">Gjakovë</SelectItem>
                    <SelectItem value="mitrovica">Mitrovicë</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="chk1" />
                <Label htmlFor="chk1">Pranoj Kushtet e Përdorimit</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch id="sw1" checked={switchOn} onCheckedChange={setSwitchOn} />
                <Label htmlFor="sw1">Njoftime email — {switchOn ? "Aktive ✓" : "Joaktive"}</Label>
              </div>
              <div>
                <Label>Roli</Label>
                <RadioGroup value={radioVal} onValueChange={setRadioVal} className="flex gap-4 mt-2">
                  <RadioItem value="a" label="Dhuroj ndihmë" />
                  <RadioItem value="b" label="Kërkoj ndihmë" />
                  <RadioItem value="c" label="Të dyja" />
                </RadioGroup>
              </div>
              <div>
                <Label>Ngarko dokument</Label>
                <FileUpload
                  accept="image/*"
                  maxSize={5 * 1024 * 1024}
                  onFilesChange={(files) => console.log("Skedarët:", files.map(f => f.name))}
                  label="Kliko ose tërhiq foton këtu"
                  hint="PNG, JPG deri 5MB"
                />
              </div>
            </div>
          </Section>

          {/* ═══ 5. BADGES & TAGS ═══ */}
          <Section id="badges" title="🏷️ Badges & Tags">
            <div className="space-y-4 bg-card rounded-2xl border border-border p-8">
              <Row label="Badge variante">
                <Badge variant="primary">Donacion</Badge>
                <Badge variant="success">Vullnetare</Badge>
                <Badge variant="warning">Në Pritje</Badge>
                <Badge variant="destructive">Refuzuar</Badge>
                <Badge variant="secondary">Draft</Badge>
                <Badge variant="outline">Outline</Badge>
              </Row>
              <Row label="TagBadge ngjyra">
                <TagBadge label="Shëndetësi" color="default" />
                <TagBadge label="Arsim" color="blue" />
                <TagBadge label="Emergjencë" color="green" />
                <TagBadge label="Komunitet" color="brown" />
                <TagBadge label="✕ Hiq" color="blue" removable onRemove={() => alert("Hequr!")} />
              </Row>
            </div>
          </Section>

          {/* ═══ 6. PROGRESS & FEEDBACK ═══ */}
          <Section id="progress" title="📊 Progress & Feedback">
            <div className="space-y-6 bg-card rounded-2xl border border-border p-8">
              <div className="max-w-md space-y-4">
                <p className="text-xs font-bold text-muted-foreground">Progress (Radix) — 62%</p>
                <Progress value={62} />
                <p className="text-xs font-bold text-muted-foreground">ProgressBar blue — 7200 / 12000</p>
                <ProgressBar value={7200} max={12000} color="blue" showLabel />
                <p className="text-xs font-bold text-muted-foreground">ProgressBar green — 45 / 100</p>
                <ProgressBar value={45} max={100} color="green" showLabel />
                <p className="text-xs font-bold text-muted-foreground">ProgressBar brown — 88 / 100</p>
                <ProgressBar value={88} max={100} color="brown" showLabel />
              </div>
              <Row label="Spinner">
                <Spinner size="sm" />
                <Spinner size="md" />
                <Spinner size="lg" />
                <span className="text-sm text-muted-foreground flex items-center gap-2"><Spinner size="sm" /> Duke ngarkuar...</span>
              </Row>
              <Row label="Skeleton">
                <div className="w-full space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-32 w-full rounded-xl" />
                </div>
              </Row>
            </div>
          </Section>

          {/* ═══ 7. AVATAR & IDENTITY ═══ */}
          <Section id="avatars" title="👤 Avatar & Identity">
            <div className="space-y-5 bg-card rounded-2xl border border-border p-8">
              <Row label="Avatar (Radix)">
                <Avatar className="h-10 w-10"><AvatarFallback>AB</AvatarFallback></Avatar>
                <Avatar className="h-14 w-14"><AvatarFallback>EL</AvatarFallback></Avatar>
                <Avatar className="h-20 w-20"><AvatarFallback>RK</AvatarFallback></Avatar>
              </Row>
              <Row label="UserAvatarWithBadge (sm/md/lg/xl + verified)">
                <UserAvatarWithBadge fallback="AR" size="sm" />
                <UserAvatarWithBadge fallback="BL" size="md" verified />
                <UserAvatarWithBadge fallback="EL" size="lg" verified />
                <UserAvatarWithBadge fallback="ZK" size="xl" verified />
              </Row>
            </div>
          </Section>

          {/* ═══ 8. STEPPER ═══ */}
          <Section id="stepper" title="🪜 Stepper">
            <div className="space-y-8 bg-card rounded-2xl border border-border p-8">
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-4">UI Stepper — hapi 2 aktiv</p>
                <Stepper steps={["Llogaria", "Profili", "Interesat", "Përfundo"]} current={1} />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-4">OnboardingStepper (dashboard)</p>
                <OnboardingStepper
                  steps={[
                    { label: "Lokacioni",  description: "Ku ndodhesh?" },
                    { label: "Interesat",  description: "Çfarë të intereson?" },
                    { label: "Roli",       description: "Si dëshiron të ndihmosh?" },
                    { label: "Profili",    description: "Plotëso të dhënat" },
                  ]}
                  currentStep={2}
                />
              </div>
            </div>
          </Section>

          {/* ═══ 9. IKONAT ═══ */}
          <Section id="icons" title="🖼️ Icons — Të gjitha">
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-10 bg-card rounded-2xl border border-border p-6">
              {ALL_ICONS.map(([name, Icon]: any) => (
                <Tooltip key={name}>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center gap-1.5 rounded-lg border border-border p-3 hover:bg-unify-cream cursor-default transition-colors">
                      <Icon className="h-5 w-5 text-unify-brown" />
                      <span className="text-[9px] text-muted-foreground text-center leading-tight">{name}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent><code className="text-xs">{name}Icon</code></TooltipContent>
                </Tooltip>
              ))}
            </div>
          </Section>

          {/* ═══ 10. CARDS UI ═══ */}
          <Section id="cards" title="🃏 Cards (UI)">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Card Title</CardTitle>
                  <CardDescription>Një përshkrim i shkurtër i kartës.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Përmbajtja kryesore shkon këtu.</p>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button size="sm">Veprim</Button>
                  <Button size="sm" variant="ghost">Anulo</Button>
                </CardFooter>
              </Card>

              <StatCard
                label="Donacione Gjithsej"
                value="€12,480"
                change={{ value: "+8.2% nga muaji i kaluar", direction: "up" }}
                icon={<DollarSignIcon className="h-5 w-5" />}
              />

              <CampaignGoalCard
                title="Shkolla në Gjakovë"
                status="active"
                raised={7200}
                goal={12000}
                daysLeft={18}
                donorCount={94}
                onMenuClick={() => alert("Menu!")}
              />
            </div>
          </Section>

          {/* ═══ 11. PUBLIC CARDS ═══ */}
          <Section id="public-cards" title="🌐 Public Cards">
            <div className="grid gap-4 md:grid-cols-3">
              <CampaignCard
                id="c1"
                title="Ndihmo familjet nga përmbytjet"
                description="Qindra familje kanë nevojë urgjente për ushqim, veshje dhe strehim."
                category="Emergjencë"
                location="Shkodër"
                raised={8400}
                goal={15000}
                daysLeft={12}
                donorCount={210}
                creatorName="Arta Hoxha"
                verified
                bookmarked={bookmarked}
                onBookmark={() => setBookmarked(!bookmarked)}
                onShare={() => alert("Share!")}
                onDonate={() => alert("Dono!")}
              />

              <VolunteerCard
                title="Mësimdënie falas për fëmijë"
                organization="NGO Edukimi"
                category="Arsim"
                location="Prishtinë"
                hoursPerWeek="4 orë/javë"
                startDate="1 Maj 2026"
                applicantCount={7}
                skills={["Matematikë", "Shqipe"]}
                onApply={() => alert("Apliko!")}
              />

              <BlogCard
                title="Si Arjeta mblodhi €5,000 për spitalin"
                excerpt="Historia e një nëne që nuk u dha dorë kurrë dhe fitoi betejën me komunitetin."
                category="Histori Suksesi"
                author="Redaksia Unify"
                publishedAt="20 Prill 2026"
                readTime="3 min"
                onClick={() => alert("Blog!")}
              />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <StatisticCard label="Mbledhur"  value="€248K" icon={<DollarSignIcon className="h-6 w-6" />} />
              <StatisticCard label="Kampanja"  value="1,240" icon={<HeartIcon className="h-6 w-6" />} />
              <StatisticCard label="Donatorë"  value="18,500" icon={<UsersIcon className="h-6 w-6" />} />
              <StatisticCard label="Komuna"    value="38" icon={<MapPinIcon className="h-6 w-6" />} />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <CategoryCard title="Shëndetësi" icon={<HeartIcon className="h-6 w-6" />} count={320} onClick={() => alert("Shëndetësi")} />
              <CategoryCard title="Arsim"      icon={<StarIcon className="h-6 w-6" />}  count={180} onClick={() => alert("Arsim")} />
              <CategoryCard title="Emergjencë" icon={<AlertCircleIcon className="h-6 w-6" />} count={95} onClick={() => alert("Emergjencë")} />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <ValueCard title="Transparencë" description="Çdo donacion i gjursueshëm hap-pas-hapi." icon={<ShieldIcon className="h-6 w-6" />} />
              <ValueCard title="Siguri"        description="Pagesat i menaxhon Stripe — standard global."  icon={<LockIcon className="h-6 w-6" />} />
              <ValueCard title="Komunitet"     description="Bashkë jemi më të fortë."                      icon={<UsersIcon className="h-6 w-6" />} />
            </div>
          </Section>

          {/* ═══ 12. SEARCH, FILTER, DONATION ═══ */}
          <Section id="public-ui" title="🔍 Search, Filter, Donation, Share">
            <div className="space-y-8 bg-card rounded-2xl border border-border p-8">
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-3">SearchBar</p>
                <SearchBar
                  placeholder="Kërko kampanja..."
                  onSubmit={(v) => alert(`Kërko: ${v}`)}
                />
              </div>

              <div>
                <p className="text-xs font-bold text-muted-foreground mb-3">FilterChips</p>
                <FilterChips
                  options={[
                    { label: "Të Gjitha",  value: "all" },
                    { label: "Donacione",  value: "donations" },
                    { label: "Vullnetare", value: "volunteer" },
                    { label: "Urgjente",   value: "urgent" },
                    { label: "Arsim",      value: "education" },
                    { label: "Shëndetësi", value: "health" },
                  ]}
                  value={filterChip}
                  onChange={setFilterChip}
                />
                <p className="text-xs text-muted-foreground mt-2">Zgjedhur: <strong>{filterChip}</strong></p>
              </div>

              <div>
                <p className="text-xs font-bold text-muted-foreground mb-3">DonationAmountPicker — shuma: €{donationAmt}</p>
                <DonationAmountPicker
                  presets={[5, 10, 25, 50, 100]}
                  value={donationAmt}
                  onChange={setDonationAmt}
                  currency="€"
                />
              </div>

              <div>
                <p className="text-xs font-bold text-muted-foreground mb-3">StatsBar</p>
                <StatsBar
                  stats={[
                    { label: "Mbledhur",  value: "€248K" },
                    { label: "Kampanja",  value: "1,240" },
                    { label: "Donatorë",  value: "18.5K" },
                    { label: "Komuna",    value: "38" },
                  ]}
                />
              </div>

              <div>
                <p className="text-xs font-bold text-muted-foreground mb-3">BookmarkButton</p>
                <div className="flex gap-3">
                  <BookmarkButton bookmarked={bookmarked} onToggle={setBookmarked} variant="icon" />
                  <BookmarkButton bookmarked={bookmarked} onToggle={setBookmarked} variant="text" />
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-muted-foreground mb-3">ShareButtons</p>
                <ShareButtons url="https://unify.ks/kampanjat/shkolla-gjakove" title="Ndihmo shkollën në Gjakovë" />
              </div>

              <div>
                <p className="text-xs font-bold text-muted-foreground mb-3">DonorList</p>
                <DonorList
                  donors={[
                    { name: "Arta H.",      amount: "€100", anonymous: false },
                    { name: "Anonim 🌟",    amount: "€50",  anonymous: true  },
                    { name: "Blerim K.",    amount: "€25",  anonymous: false, message: "Shumë fat! 🙏" },
                    { name: "Anonim 🌟",    amount: "€200", anonymous: true  },
                    { name: "Fiona Dema",   amount: "€75",  anonymous: false, date: "20 Pri" },
                  ]}
                />
              </div>

              <div>
                <p className="text-xs font-bold text-muted-foreground mb-3">NewsletterSignup</p>
                <NewsletterSignup onSubmit={(email) => alert(`Abonuar: ${email}`)} />
              </div>

              <div>
                <p className="text-xs font-bold text-muted-foreground mb-3">ContactInfoCard</p>
                <div className="grid gap-3 md:grid-cols-3">
                  <ContactInfoCard icon={<MailIcon className="h-5 w-5" />}  title="Email"    value="info@unify.ks" href="mailto:info@unify.ks" />
                  <ContactInfoCard icon={<PhoneIcon className="h-5 w-5" />} title="Telefoni" value="+383 44 000 000" />
                  <ContactInfoCard icon={<MapPinIcon className="h-5 w-5" />} title="Adresa"  value="Prishtinë, Kosovë" />
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-muted-foreground mb-3">FAQAccordion</p>
                <FAQAccordion
                  items={[
                    { question: "Si funksionon Unify?",           answer: "Krijon kampanjë, njerëzit dhurojnë direkt te ti." },
                    { question: "A është i sigurt donacioni?",     answer: "Po — Stripe, standard ndërkombëtar PCI DSS." },
                    { question: "Sa komisioner merr Unify?",       answer: "0% komision. Opsional tip 5% ose 10%." },
                  ]}
                />
              </div>
            </div>
          </Section>

          {/* ═══ 13. DASHBOARD CARDS ═══ */}
          <Section id="dashboard" title="📊 Dashboard Components">
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <CreatorCTA
                  title="Bëhu Krijues"
                  description="Krijo kampanjën tënde të parë dhe mblidh mbështetje."
                  ctaLabel="Fillo tani"
                  onCta={() => alert("CTA!")}
                />
                <StripeVerificationCard status="not-started" onStart={() => alert("Fillo verifikimin!")} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <StripeVerificationCard status="pending" />
                <StripeVerificationCard status="verified" />
              </div>

              <PublicProfileHero
                name="Arta Hoxha"
                location="Prishtinë"
                joined="Janar 2026"
                bio="Aktiviste sociale dhe organizatore e komunitetit."
                verified
                stats={[
                  { label: "Kampanja", value: "12" },
                  { label: "Donatorë", value: "340" },
                  { label: "Mbledhur", value: "€8.4K" },
                ]}
                primaryAction={{ label: "Dërgo Mesazh", onClick: () => alert("Mesazh!") }}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-card rounded-2xl border border-border p-5 space-y-1 divide-y divide-border">
                  <p className="text-xs font-bold text-muted-foreground pb-3">ActivityLogItem</p>
                  <ActivityLogItem
                    actor={{ name: "Arta Hoxha" }}
                    action="dhuron €25 për kampanjën"
                    target="Shkolla në Gjakovë"
                    timestamp="2 orë më parë"
                    icon={<HeartIcon className="h-5 w-5" />}
                  />
                  <ActivityLogItem
                    actor={{ name: "Blerim Krasniqi" }}
                    action="krijoi kampanjën"
                    target="Operacioni i Berit"
                    timestamp="1 ditë më parë"
                  />
                  <ActivityLogItem
                    actor={{ name: "Fiona Dema" }}
                    action="aplikoi për"
                    target="Libra falas"
                    timestamp="3 ditë më parë"
                    icon={<BookmarkIcon className="h-5 w-5" />}
                  />
                </div>

                <div className="bg-card rounded-2xl border border-border p-5 space-y-3">
                  <p className="text-xs font-bold text-muted-foreground">MessageBubble</p>
                  <MessageBubble
                    content="Përshëndetje! A mund të ma tregoni më shumë?"
                    time="10:24"
                    self={false}
                  />
                  <MessageBubble
                    content="Sigurisht! Fondet shkojnë direkt për materialet shkollore."
                    time="10:26"
                    self
                  />
                  <MessageBubble
                    content="Shumë mirë, do dhurojmë sot! 🙏"
                    time="10:28"
                    self={false}
                  />
                </div>
              </div>

              <div className="bg-card rounded-2xl border border-border p-5">
                <p className="text-xs font-bold text-muted-foreground mb-4">ApplicationCard</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <ApplicationCard
                    title="Libra falas për studentë"
                    organization="NGO Arsimi"
                    status="pending"
                    location="Prishtinë"
                    date="18 Prill 2026"
                    onClick={() => alert("Shiko aplikimin")}
                  />
                  <ApplicationCard
                    title="Vegla pune falas"
                    organization="Anonim"
                    status="accepted"
                    location="Prizren"
                    date="15 Prill 2026"
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* ═══ 14. AUTH COMPONENTS ═══ */}
          <Section id="auth" title="🔐 Auth Components">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-card rounded-2xl border border-border p-6">
                <p className="text-xs font-bold text-muted-foreground mb-4">ProfileSetupForm</p>
                <ProfileSetupForm
                  onSubmit={(d) => alert(JSON.stringify(d, null, 2))}
                  submitLabel="Ruaj Profilin"
                />
              </div>

              <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
                <p className="text-xs font-bold text-muted-foreground">RoleSelectionCard</p>
                <RoleSelectionCard
                  title="Dhuroj Ndihmë"
                  description="Dëshiroj të ndihmoj kampanjat dhe njerëzit në nevojë."
                  icon={<HeartIcon className="h-8 w-8" />}
                  selected={roleVal === "donor"}
                  onClick={() => setRoleVal("donor")}
                />
                <RoleSelectionCard
                  title="Kërkoj Ndihmë"
                  description="Dëshiroj të krijoj kampanjë dhe të mblidh mbështetje."
                  icon={<StarIcon className="h-8 w-8" />}
                  selected={roleVal === "creator"}
                  onClick={() => setRoleVal("creator")}
                />
              </div>

              <div className="bg-card rounded-2xl border border-border p-6 md:col-span-2">
                <p className="text-xs font-bold text-muted-foreground mb-4">InterestPicker — zgjedhur: [{interests.join(", ")}]</p>
                <InterestPicker
                  interests={[
                    { id: "health",    label: "Shëndetësi",  icon: <HeartIcon className="h-4 w-4" /> },
                    { id: "education", label: "Arsim",       icon: <StarIcon className="h-4 w-4" /> },
                    { id: "emergency", label: "Emergjencë",  icon: <AlertCircleIcon className="h-4 w-4" /> },
                    { id: "community", label: "Komunitet",   icon: <UsersIcon className="h-4 w-4" /> },
                    { id: "sports",    label: "Sport",       icon: <TargetIcon className="h-4 w-4" /> },
                    { id: "animals",   label: "Kafshë",      icon: <HeartIcon className="h-4 w-4" /> },
                  ]}
                  value={interests}
                  onChange={setInterests}
                  max={4}
                />
              </div>
            </div>
          </Section>

          {/* ═══ 15. ADMIN COMPONENTS ═══ */}
          <Section id="admin" title="🛡️ Admin Components">
            <div className="space-y-6 bg-card rounded-2xl border border-border p-8">
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-3">ModerationActions</p>
                <ModerationActions
                  onApprove={() => alert("Aprovuar!")}
                  onReject={() => alert("Refuzuar!")}
                  onFlag={() => alert("Flaguar!")}
                  onPause={() => alert("Pauzuar!")}
                />
              </div>

              <div>
                <p className="text-xs font-bold text-muted-foreground mb-3">AdminStatCard</p>
                <div className="grid gap-4 md:grid-cols-4">
                  <AdminStatCard
                    label="Kampanja Aktive"
                    value="142"
                    icon={<HeartIcon className="h-5 w-5" />}
                    change={{ value: "+12%", trend: "up" }}
                  />
                  <AdminStatCard
                    label="Në Pritje"
                    value="8"
                    icon={<ClockIcon className="h-5 w-5" />}
                    change={{ value: "-2", trend: "down" }}
                  />
                  <AdminStatCard
                    label="Donacione Sot"
                    value="€3,240"
                    icon={<DollarSignIcon className="h-5 w-5" />}
                  />
                  <AdminStatCard
                    label="Raportime"
                    value="3"
                    icon={<FlagIcon className="h-5 w-5" />}
                    change={{ value: "+1", trend: "up" }}
                  />
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-muted-foreground mb-3">AdminStatusBadge — të gjitha statuset</p>
                <Row label="">
                  <AdminStatusBadge status="active" />
                  <AdminStatusBadge status="pending" />
                  <AdminStatusBadge status="approved" />
                  <AdminStatusBadge status="rejected" />
                  <AdminStatusBadge status="suspended" />
                  <AdminStatusBadge status="banned" />
                  <AdminStatusBadge status="under-review" />
                  <AdminStatusBadge status="verified" />
                  <AdminStatusBadge status="flagged" />
                  <AdminStatusBadge status="resolved" />
                </Row>
              </div>

              <div>
                <p className="text-xs font-bold text-muted-foreground mb-3">AdminFilterBar</p>
                <AdminFilterBar
                  searchPlaceholder="Kërko kampanjë..."
                  onSearchChange={(v) => console.log("Kërko:", v)}
                  filters={[
                    {
                      key: "status",
                      label: "Statusi",
                      options: [
                        { label: "Të Gjitha", value: "all" },
                        { label: "Në Pritje",  value: "pending" },
                        { label: "Aktive",     value: "active" },
                      ],
                      onChange: (v) => console.log("Status:", v),
                    },
                  ]}
                />
              </div>

              <div>
                <p className="text-xs font-bold text-muted-foreground mb-3">ActionButtonGroup</p>
                <ActionButtonGroup
                  actions={[
                    { label: "Aprovo",    variant: "default",     onClick: () => alert("Aprovuar!"), icon: <CheckIcon className="h-4 w-4" /> },
                    { label: "Refuzo",    variant: "destructive", onClick: () => alert("Refuzuar!"), icon: <CloseIcon className="h-4 w-4" /> },
                    { label: "Featured ⭐", variant: "default",   onClick: () => alert("Featured!") },
                  ]}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-bold text-muted-foreground mb-3">AdminSettingsCard</p>
                  <AdminSettingsCard
                    title="Komisioni i Platformës"
                    description="Cakto % default të komisionit."
                    action={
                      <Select>
                        <SelectTrigger className="w-24"><SelectValue placeholder="0%" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0%</SelectItem>
                          <SelectItem value="5">5%</SelectItem>
                          <SelectItem value="10">10%</SelectItem>
                        </SelectContent>
                      </Select>
                    }
                  >
                    <p className="text-sm text-muted-foreground">Ndryshimi aplikohet vetëm për kampanjat e reja pas kësaj date.</p>
                  </AdminSettingsCard>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground mb-3">AdminToggleSwitch</p>
                  <AdminToggleSwitch
                    label="Regjistrimet e reja"
                    description="Lejo regjistrime të reja në platformë"
                    checked={toggleAdmin}
                    onCheckedChange={setToggleAdmin}
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* ═══ 16. LAYOUT HELPERS ═══ */}
          <Section id="layout" title="📐 Layout Helpers">
            <div className="space-y-6 bg-card rounded-2xl border border-border p-8">
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-3">Breadcrumbs (layout)</p>
                <Breadcrumbs
                  items={[
                    { label: "Kreu",       href: "/" },
                    { label: "Kampanjat",  href: "/kampanjat" },
                    { label: "Shkolla në Gjakovë" },
                  ]}
                />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-3">Breadcrumb (ui) — me home icon</p>
                <Breadcrumb
                  items={[
                    { label: "Dashboard",        href: "/dashboard" },
                    { label: "Kampanjat e Mia",  href: "/dashboard/kampanjat" },
                    { label: "Statistikat" },
                  ]}
                />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-3">EmptyState</p>
                <EmptyState
                  icon={<HeartIcon className="h-8 w-8" />}
                  title="Asnjë kampanjë ende"
                  description="Fillo kampanjën tënde të parë dhe mblidh mbështetje."
                  action={{ label: "Krijo Kampanjë", onClick: () => alert("Krijo!") }}
                />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-3">
                  Pagination — faqja {page} / 4 (total 48, 12/faqe)
                </p>
                <Pagination currentPage={page} totalPages={4} onPageChange={setPage} />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-3">Separator</p>
                <div className="flex items-center gap-4">
                  <span className="text-sm">Majtas</span>
                  <Separator orientation="vertical" className="h-6" />
                  <span className="text-sm">Djathtas</span>
                </div>
                <Separator className="mt-3" />
              </div>
            </div>
          </Section>

          {/* ═══ 17. TABS ═══ */}
          <Section id="tabs" title="📑 Tabs">
            <div className="bg-card rounded-2xl border border-border p-8">
              <Tabs defaultValue="donacione">
                <TabsList>
                  <TabsTrigger value="donacione">Donacione</TabsTrigger>
                  <TabsTrigger value="vullnetare">Vullnetare</TabsTrigger>
                  <TabsTrigger value="blog">Blog</TabsTrigger>
                </TabsList>
                <TabsContent value="donacione" className="mt-4">
                  <p className="text-sm text-muted-foreground">Lista e kampanjave — 1,240 gjithsej.</p>
                </TabsContent>
                <TabsContent value="vullnetare" className="mt-4">
                  <p className="text-sm text-muted-foreground">Asetet vullnetare — 320 aktive.</p>
                </TabsContent>
                <TabsContent value="blog" className="mt-4">
                  <p className="text-sm text-muted-foreground">Artikujt blog — 48 publik.</p>
                </TabsContent>
              </Tabs>
            </div>
          </Section>

          {/* ═══ 18. TABLE ═══ */}
          <Section id="table" title="📋 Table">
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Donatori</TableHead>
                    <TableHead>Kampanja</TableHead>
                    <TableHead>Shuma</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Statusi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { donor: "Arta Hoxha",  campaign: "Shkolla Gjakovë",    amount: "€100", date: "20 Pri", status: "active"    },
                    { donor: "Anonim 🌟",   campaign: "Operacioni Berit",   amount: "€50",  date: "19 Pri", status: "approved"  },
                    { donor: "Blerim K.",   campaign: "Libra për Studentë", amount: "€25",  date: "18 Pri", status: "pending"   },
                    { donor: "Fiona Dema",  campaign: "Shkolla Gjakovë",    amount: "€200", date: "17 Pri", status: "verified"  },
                    { donor: "Anonim 🌟",   campaign: "Spitali Pejë",       amount: "€500", date: "16 Pri", status: "flagged"   },
                  ].map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{row.donor}</TableCell>
                      <TableCell>{row.campaign}</TableCell>
                      <TableCell className="font-bold text-unify-brown">{row.amount}</TableCell>
                      <TableCell className="text-muted-foreground">{row.date}</TableCell>
                      <TableCell><AdminStatusBadge status={row.status as any} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Section>

          {/* ═══ 19. ACCORDION ═══ */}
          <Section id="accordion" title="📖 Accordion">
            <div className="bg-card rounded-2xl border border-border p-8 max-w-2xl">
              <Accordion type="single" collapsible>
                <AccordionItem value="q1">
                  <AccordionTrigger>Si funksionon donacioni?</AccordionTrigger>
                  <AccordionContent>Klikon "Dono Tani", zgjedh shumën dhe paguan me kartë. Stripe e dërgon direkt te krijuesi.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="q2">
                  <AccordionTrigger>A mund të dhurojë dikush pa llogari?</AccordionTrigger>
                  <AccordionContent>Po — vizitorët mund të dhurojnë duke shkruar vetëm emrin. Nuk kërkohet regjistrim.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="q3">
                  <AccordionTrigger>Sa kohë zgjat verifikimi Stripe Identity?</AccordionTrigger>
                  <AccordionContent>Zakonisht 1-5 minuta. Ndonjëherë deri 24 orë nëse rishikohet manualisht.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </Section>

          {/* ═══ 20. OVERLAYS ═══ */}
          <Section id="overlays" title="💬 Overlays — Dialog, Sheet, AlertDialog, Tooltip, Dropdown">
            <div className="flex flex-wrap gap-3 bg-card rounded-2xl border border-border p-8">

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Hap Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Konfirmo Donacionin</DialogTitle>
                    <DialogDescription>A dëshiron të dhurojë €25 për "Shkolla në Gjakovë"?</DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild><Button variant="ghost">Anulo</Button></DialogClose>
                    <Button onClick={() => alert("Konfirmuar!")}>Konfirmo €25</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">Hap Sheet</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Detajet e Donacionit</SheetTitle>
                    <SheetDescription>Historiku i plotë i donacioneve.</SheetDescription>
                  </SheetHeader>
                  <div className="mt-4 space-y-3 text-sm">
                    <p className="flex justify-between"><span>Shkolla Gjakovë</span><strong>€100</strong></p>
                    <p className="flex justify-between"><span>Operacioni Berit</span><strong>€50</strong></p>
                    <p className="flex justify-between"><span>Libra studentë</span><strong>€25</strong></p>
                  </div>
                </SheetContent>
              </Sheet>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Fshi Kampanjën</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Jeni të sigurt?</AlertDialogTitle>
                    <AlertDialogDescription>Ky veprim nuk mund të kthehet. Kampanja fshihet përfundimisht.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Anulo</AlertDialogCancel>
                    <AlertDialogAction onClick={() => alert("Fshirë!")}>Po, fshi</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost"><InfoIcon className="h-5 w-5" /> Hover mbi mua</Button>
                </TooltipTrigger>
                <TooltipContent>Ky është një tooltip informues!</TooltipContent>
              </Tooltip>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline"><MoreHorizontalIcon className="h-4 w-4" /> Veprime</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Veprimet</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => alert("Edito!")}><EditIcon className="h-4 w-4 mr-2" />Edito</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => alert("Ndaj!")}><ShareIcon className="h-4 w-4 mr-2" />Ndaj</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={() => alert("Fshi!")}><TrashIcon className="h-4 w-4 mr-2" />Fshi</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Section>

          {/* ═══ 21. CHECKLIST ═══ */}
          <Section id="checklist" title="✅ Checklist — Gjithçka e testuar">
            <div className="bg-card rounded-2xl border border-border p-8">
              <p className="text-sm text-muted-foreground mb-4">
                Nëse kjo faqe hapet pa gabime në browser, të gjitha komponentet funksionojnë.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3 md:grid-cols-4">
                {[
                  "Button ✅","Input ✅","Textarea ✅","Label ✅",
                  "Badge ✅","TagBadge ✅","Select ✅","Checkbox ✅",
                  "Switch ✅","RadioGroup ✅","FileUpload ✅","Progress ✅",
                  "ProgressBar ✅","Spinner ✅","Skeleton ✅","Avatar ✅",
                  "UserAvatarWithBadge ✅","SocialButton ✅","Stepper ✅","IconButton ✅",
                  "Card ✅","Tabs ✅","Table ✅","Accordion ✅",
                  "Dialog ✅","Sheet ✅","AlertDialog ✅","Tooltip ✅",
                  "DropdownMenu ✅","Pagination ✅","Separator ✅","Breadcrumb (ui) ✅",
                  "Breadcrumbs (layout) ✅","EmptyState ✅","CampaignCard ✅","VolunteerCard ✅",
                  "BlogCard ✅","StatisticCard ✅","CategoryCard ✅","ValueCard ✅",
                  "SearchBar ✅","FilterChips ✅","DonationAmountPicker ✅","StatsBar ✅",
                  "ShareButtons ✅","BookmarkButton ✅","DonorList ✅","FAQAccordion ✅",
                  "NewsletterSignup ✅","ContactInfoCard ✅","StatCard ✅","CampaignGoalCard ✅",
                  "CreatorCTA ✅","PublicProfileHero ✅","StripeVerificationCard ✅","ActivityLogItem ✅",
                  "ApplicationCard ✅","MessageBubble ✅","OnboardingStepper ✅","ProfileSetupForm ✅",
                  "RoleSelectionCard ✅","InterestPicker ✅","ModerationActions ✅","AdminStatCard ✅",
                  "AdminStatusBadge ✅","AdminFilterBar ✅","ActionButtonGroup ✅","AdminSettingsCard ✅",
                  "AdminToggleSwitch ✅","Icons (70+) ✅",
                ].map((c) => (
                  <div key={c} className="rounded-lg bg-unify-cream px-3 py-1.5 font-mono text-unify-brown">{c}</div>
                ))}
              </div>
            </div>
          </Section>

        </div>

        <footer className="border-t border-border bg-card mt-20 py-6 text-center text-xs text-muted-foreground">
          Unify Component Showcase — vetëm test lokal · nuk komitet në GitHub
        </footer>

      </main>
    </TooltipProvider>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="mb-2 font-display text-2xl text-unify-brown">{title}</h2>
      <Separator className="mb-6" />
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      {label && <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>}
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}
