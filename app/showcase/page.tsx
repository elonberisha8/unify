"use client";

/**
 * SHOWCASE — test lokal, MOS e komito në GitHub
 * Teston TË GJITHA komponentet e library-së për t'u siguruar që funksionojnë.
 */

import * as React from "react";

// ─── UI Primitives ────────────────────────────────────────────────────────────
import {
  Button, Input, Textarea, Label, Badge, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  Checkbox, Switch, Avatar, AvatarFallback, Separator, Spinner, Skeleton, Progress, ProgressBar,
  TagBadge, IconButton, SocialButton, Stepper,
  EmptyState, Breadcrumbs,
  CampaignCard, VolunteerCard, BlogCard, StatisticCard, CategoryCard, ValueCard,
  StatCard, CampaignGoalCard, CreatorCTA,
  HeartIcon, SearchIcon, BellIcon, UserIcon, ShareIcon, BookmarkIcon, CalendarIcon, MapPinIcon,
  CheckCircleIcon, AlertCircleIcon, TrendingUpIcon, DollarSignIcon, SettingsIcon, HomeIcon,
  InboxIcon, LogInIcon, UploadIcon, StarIcon, FlagIcon, GlobeIcon,
  colors,
} from "@/components";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="container py-10">
          <p className="font-display text-sm uppercase tracking-widest text-unify-blue">Unify</p>
          <h1 className="font-display text-5xl">Component Library Showcase</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Te gjitha komponentet jane te disponueshme nga <code className="rounded bg-muted px-1.5 py-0.5">@/components</code>.
            Frontend-zhvilluesit kompozojne faqe nga keto komponente dhe nuk shkruajne stile jashte library-se.
          </p>
        </div>
      </header>

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

        <Section title="Typography">
          <div className="space-y-2">
            <h1 className="font-display text-5xl">Rowdies - Display 5xl</h1>
            <h2 className="font-display text-3xl">Rowdies - Display 3xl</h2>
            <h3 className="font-display text-xl">Rowdies - Display xl</h3>
            <p className="text-base">Arimo - Body base. Lorem ipsum dolor sit amet.</p>
            <p className="text-sm text-muted-foreground">Arimo - Body small muted.</p>
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
            <TagBadge label="Shendetesi" />
            <TagBadge label="Arsim" />
          </div>
        </Section>

        <Section title="Progress & feedback">
          <div className="max-w-md space-y-4">
            <Progress value={62} />
            <ProgressBar value={62} showLabel />
            <div className="flex items-center gap-3"><Spinner /> Duke ngarkuar...</div>
            <Skeleton className="h-6 w-full" />
          </div>
        </Section>

        <Section title="Avatar / Social / Stepper">
          <div className="flex flex-wrap items-center gap-6">
            <Avatar><AvatarFallback>AB</AvatarFallback></Avatar>
            <SocialButton provider="google">Vazhdo me Google</SocialButton>
            <div className="w-80"><Stepper steps={["Llogaria", "Profili", "Interesat", "Perfundo"]} current={1} /></div>
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

        <Section title="Cards">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Card title</CardTitle>
                <CardDescription>Nje pershkrim i shkurter.</CardDescription>
              </CardHeader>
              <CardContent>Permbajtja kryesore e kartes.</CardContent>
              <CardFooter><Button size="sm">Veprim</Button></CardFooter>
            </Card>
            <StatCard label="Donacione" value="EUR 12,480" change={{ value: "+8.2%", direction: "up" }} />
            <CampaignGoalCard title="Shkolla ne Gjakove" raised={7200} goal={12000} />
          </div>
        </Section>

        <Section title="Layout helpers">
          <div className="space-y-4">
            <Breadcrumbs items={[{ label: "Kreu", href: "/" }, { label: "Kampanjat", href: "/kampanjat" }, { label: "Detajet" }]} />
            <EmptyState
              title="Asgje ketu ende"
              description="Provo te shtosh nje kampanje te re."
              action={{ label: "Krijo kampanje", onClick: () => {} }}
            />
          </div>
        </Section>
      </div>
    </main>
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
