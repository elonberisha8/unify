import Link from "next/link";
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from "@/components";
import { ArrowRightIcon, HomeIcon, UserIcon, ShieldIcon, LayoutDashboardIcon } from "@/components";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container py-16">
        <div className="mb-12">
          <p className="font-display text-sm uppercase tracking-widest text-unify-blue">Unify</p>
          <h1 className="mt-2 font-display text-5xl">Component Library</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Library e brendshme — 106 komponente, 60+ ikona, tokens, layouts. Frontend-i kompozon faqe nga{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">@/components</code> dhe asgjë nga jashtë.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge>106 komponente</Badge>
            <Badge variant="secondary">100% Figma coverage</Badge>
            <Badge variant="outline">Self-contained</Badge>
          </div>
        </div>

        <div className="mb-10">
          <Link href="/showcase">
            <Button size="lg">
              Shiko library showcase
              <ArrowRightIcon size={16} />
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <PlaceholderCard
            icon={<HomeIcon size={24} />}
            title="Public"
            description="22 komponente — landing, kampanja, blog, kontakt"
            count={22}
          />
          <PlaceholderCard
            icon={<UserIcon size={24} />}
            title="Auth"
            description="7 komponente — login, register, onboarding"
            count={7}
          />
          <PlaceholderCard
            icon={<LayoutDashboardIcon size={24} />}
            title="Dashboard"
            description="15 komponente — stats, tables, inbox, profile"
            count={15}
          />
          <PlaceholderCard
            icon={<ShieldIcon size={24} />}
            title="Admin"
            description="21 komponente — moderim, audit log, reports"
            count={21}
          />
        </div>
      </div>
    </main>
  );
}

function PlaceholderCard({
  icon, title, description, count,
}: { icon: React.ReactNode; title: string; description: string; count: number }) {
  return (
    <Card>
      <CardHeader>
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-unify-cream text-unify-brown">
          {icon}
        </div>
        <CardTitle className="flex items-center justify-between">
          {title}
          <span className="font-display text-sm text-unify-blue">{count}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Import nga <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">@/components/{title.toLowerCase()}</code>
      </CardContent>
    </Card>
  );
}
