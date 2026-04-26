"use client";

import {
  // primitives
  Button, Input, Textarea, Label, Badge, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  Checkbox, Switch, Avatar, AvatarFallback, Separator, Spinner, Skeleton, Progress, ProgressBar,
  TagBadge, IconButton, SocialButton, Stepper,
  // layout
  EmptyState, Breadcrumbs,
  // public
  CampaignCard, VolunteerCard, BlogCard, StatisticCard, CategoryCard, ValueCard,
  // dashboard
  StatCard, CampaignGoalCard, CreatorCTA,
  // icons (sample)
  HeartIcon, SearchIcon, BellIcon, UserIcon, ShareIcon, BookmarkIcon, CalendarIcon, MapPinIcon,
  CheckCircleIcon, AlertCircleIcon, TrendingUpIcon, DollarSignIcon, SettingsIcon, HomeIcon,
  InboxIcon, LogInIcon, UploadIcon, StarIcon, FlagIcon, GlobeIcon,
  // tokens
  colors,
} from "@/components";

export default function Showcase() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="container py-10">
          <p className="font-display text-sm uppercase tracking-widest text-unify-blue">Unify</p>
          <h1 className="font-display text-5xl">Component Library Showcase</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Të gjitha komponentet janë të disponueshme nga <code className="rounded bg-muted px-1.5 py-0.5">@/components</code>.
            Frontend-zhvilluesit kompozojnë faqe nga këto komponente dhe nuk shkruajnë stile jashtë library-së.
          </p>
        </div>
      </header>

      <div className="container space-y-16 py-12">
        <Section title="Color tokens">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {Object.entries(colors).slice(0, 12).map(([name, hex]) => (
              <div key={name} className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="h-16" style={{ background: hex }} />
                <div className="p-3 text-sm">
                  <div className="font-medium">{name}</div>
                  <div className="font-mono text-xs text-muted-foreground">{hex}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Typography">
          <div className="space-y-2">
            <h1 className="font-display text-5xl">Rowdies — Display 5xl</h1>
            <h2 className="font-display text-3xl">Rowdies — Display 3xl</h2>
            <h3 className="font-display text-xl">Rowdies — Display xl</h3>
            <p className="text-base">Arimo — Body base. Lorem ipsum dolor sit amet.</p>
            <p className="text-sm text-muted-foreground">Arimo — Body small muted.</p>
          </div>
        </Section>

        <Section title="Buttons">
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button disabled>Disabled</Button>
            <IconButton aria-label="heart"><HeartIcon size={18} /></IconButton>
          </div>
        </Section>

        <Section title="Form primitives">
          <div className="grid max-w-xl gap-4">
            <div><Label>Email</Label><Input placeholder="emer@shembull.al" /></div>
            <div><Label>Mesazh</Label><Textarea placeholder="Shkruaj mesazhin..." /></div>
            <div className="flex items-center gap-3"><Checkbox id="c1" /><Label htmlFor="c1">Pajtohem me kushtet</Label></div>
            <div className="flex items-center gap-3"><Switch id="s1" /><Label htmlFor="s1">Njoftime email</Label></div>
          </div>
        </Section>

        <Section title="Badges & tags">
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <TagBadge label="Shëndetësi" />
            <TagBadge label="Arsim" />
          </div>
        </Section>

        <Section title="Progress & feedback">
          <div className="max-w-md space-y-4">
            <Progress value={62} />
            <ProgressBar value={62} showLabel />
            <div className="flex items-center gap-3"><Spinner /> Duke ngarkuar…</div>
            <Skeleton className="h-6 w-full" />
          </div>
        </Section>

        <Section title="Avatar / Social / Stepper">
          <div className="flex flex-wrap items-center gap-6">
            <Avatar><AvatarFallback>AB</AvatarFallback></Avatar>
            <SocialButton provider="google">Vazhdo me Google</SocialButton>
            <div className="w-80"><Stepper steps={["Llogaria", "Profili", "Interesat", "Përfundo"]} current={1} /></div>
          </div>
        </Section>

        <Section title="Icons (sample)">
          <div className="grid grid-cols-6 gap-4 md:grid-cols-10">
            {[
              ["HeartIcon", HeartIcon], ["SearchIcon", SearchIcon], ["BellIcon", BellIcon],
              ["UserIcon", UserIcon], ["ShareIcon", ShareIcon], ["BookmarkIcon", BookmarkIcon],
              ["CalendarIcon", CalendarIcon], ["MapPinIcon", MapPinIcon], ["CheckCircleIcon", CheckCircleIcon],
              ["AlertCircleIcon", AlertCircleIcon], ["TrendingUpIcon", TrendingUpIcon], ["DollarSignIcon", DollarSignIcon],
              ["SettingsIcon", SettingsIcon], ["HomeIcon", HomeIcon], ["InboxIcon", InboxIcon],
              ["LogInIcon", LogInIcon], ["UploadIcon", UploadIcon], ["StarIcon", StarIcon],
              ["FlagIcon", FlagIcon], ["GlobeIcon", GlobeIcon],
            ].map(([name, I]: any) => (
              <div key={name} className="flex flex-col items-center gap-1 rounded-lg border border-border bg-card p-3">
                <I size={22} className="text-unify-brown" />
                <span className="text-[10px] text-muted-foreground">{name.replace("Icon", "")}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Cards">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Card title</CardTitle>
                <CardDescription>Një përshkrim i shkurtër.</CardDescription>
              </CardHeader>
              <CardContent>Përmbajtja kryesore e kartës.</CardContent>
              <CardFooter><Button size="sm">Veprim</Button></CardFooter>
            </Card>
            <StatCard label="Donacione" value="€12,480" />
            <CampaignGoalCard title="Shkolla në Gjakovë" raised={7200} goal={12000} />
          </div>
        </Section>

        <Section title="Layout helpers">
          <div className="space-y-4">
            <Breadcrumbs items={[{ label: "Kreu", href: "/" }, { label: "Kampanjat", href: "/kampanjat" }, { label: "Detajet" }]} />
            <EmptyState title="Asgjë këtu ende" description="Provo të shtosh një kampanjë të re." />
          </div>
        </Section>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 font-display text-2xl text-unify-brown">{title}</h2>
      <Separator className="mb-6" />
      {children}
    </section>
  );
}
