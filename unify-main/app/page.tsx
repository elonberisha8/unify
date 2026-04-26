import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  Card,
} from "@/components/ui";
import { InfoIcon, MailIcon, PlusIcon, ScrollTextIcon, TrendingUpIcon } from "@/components/icons";
import { PublicLayout } from "@/components/layout";
import kidImage from "./public/kid.jpg";
import womenImage from "./public/women.jpg";

const eyebrowClass = "text-[11px] font-extrabold uppercase tracking-[0.32em] text-[#1899f2]";
const filledButtonClass =
  "h-11 rounded-full border border-transparent bg-[#7f88c3] px-7 text-[11px] font-extrabold uppercase tracking-[0.08em] text-white shadow-none hover:bg-[#7079b7]";
const outlineButtonClass =
  "h-11 rounded-full border border-[#e7dfcf] bg-transparent px-7 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#7f88c3] shadow-none hover:bg-white";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Rreth Nesh", href: "#about" },
  { label: "Shpalijet", href: "#causes" },
  { label: "Shërbimet", href: "#services" },
  { label: "Blog", href: "#stories" },
  { label: "Kontakt", href: "#contact" },
];

const stats = [
  { label: "Numri i Mbështetësve", value: "150K+" },
  { label: "Vullnetarë Botërorë", value: "15K+" },
  { label: "Kemi Mbledhur", value: "68K+" },
];

const featureCards = [
  {
    title: "Kushtet e Përdorimit",
    body: "Organizatat bamirëse fuqizojnë njerëzit për të bërë ndryshim, edhe nëse është vetëm në mënyrë të vogël",
    icon: ScrollTextIcon,
  },
  {
    title: "Politika e Privatësisë",
    body: "Njerëzit e apasionuar pas një çështjeje janë ata që mund të bëjnë ndryshimin më të madh",
    icon: InfoIcon,
  },
  {
    title: "info@unify.ks",
    body: "Zëri dhe veprimi tuaj kanë rëndësi - ju mund të bëni ndryshim në botë.",
    icon: MailIcon,
  },
  {
    title: "Kontakt",
    body: "Kur njerëzit bashkohen për të punuar për një qëllim të përbashkët, mund të arrijnë gjëra të mëdha.",
    icon: TrendingUpIcon,
  },
];

const causeCards = [
  {
    image:
      "https://images.unsplash.com/photo-1518398046578-8cca57782e17?auto=format&fit=crop&w=900&q=80",
    badge: "Ushqim",
    title: '"Siguro ujë të pastër për familjet në nevojë."',
    raised: "$4,373",
    goal: "€10,000 Qëllimi",
    progress: "42%",
  },
  {
    image:
      "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=900&q=80",
    badge: "Edukimi",
    title: '"Ndihmo me vakte ushqyese sot."',
    raised: "$5,200",
    goal: "€7,000 Qëllimi",
    progress: "68%",
  },
  {
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80",
    badge: "Bamirësi",
    title: '"Fuqizo jetët nëpërmjet bujarisë suaj."',
    raised: "$27,890",
    goal: "€50,000 Qëllimi",
    progress: "55%",
  },
];

const serviceCards = [
  {
    title: "Bamirësi",
    body: '"E dedikuar për të shërbyer të cenuarve. Na bashkohuni në krijimin e një bote më të sigurt nëpërmjet veprimit kolektiv."',
  },
  {
    title: "Ushqim",
    body: '"Ushqyerja e potencialit njerëzimor ushqimit. Punojmë që çdo fëmijë dhe familje të ketë qasje në ushqim të shëndetshëm."',
  },
  {
    title: "Ujë",
    body: '"Transformimi i jetëve me çdo pikë. Na ndihmoni të sjellim zgjidhje të qëndrueshme të ujit të pastër në zonat e largëta."',
  },
];

const volunteerStats = [
  { value: "42", title: "Njerëz", subtitle: "Parandalimi i Dhunës" },
  { value: "73", title: "Shoqëri", subtitle: "Kushtet e Përdorimit" },
  { value: "09", title: "Projekt", subtitle: "Spital Hulumtues" },
];

const galleryImages = [
  "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1526976668912-1a811878dd37?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1518398046578-8cca57782e17?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80",
];

const volunteers = [
  {
    name: "Albert Aliu",
    role: "Vullnetar",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Rilind Krasniqi",
    role: "Vullnetar",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Dea Krasniqi",
    role: "Vullnetar",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Besa Ajeti",
    role: "Vullnetar",
    image:
      womenImage.src,
  },
];

const faqItems = [
  {
    question: "Si mund të bëhem pjesë e vullnetarëve?",
    answer: "Plotësoni formularin e regjistrimit dhe ekipi ynë ju kontakton për hapat e ardhshëm të përfshirjes.",
  },
  {
    question: "Ku shkojnë paratë e donacioneve të mia?",
    answer: "Donacionet shpërndahen direkt në fushatat e verifikuara dhe raportohen në mënyrë transparente.",
  },
  {
    question: "A mund të krijoj unë një kampanjë të re?",
    answer: "Po, pas verifikimit të profilit tuaj mund të dorëzoni një fushatë të re për shqyrtim.",
  },
  {
    question: "Si vlerësohet siguria e pagesave?",
    answer: "Përdorim procese të verifikuara pagese dhe masa standarde sigurie për të mbrojtur transaksionet.",
  },
];

const footerSections = [
  {
    title: "Menu",
    links: [
      { label: "Rreth Nesh", href: "#about" },
      { label: "Shpalijet", href: "#causes" },
      { label: "Shërbimet", href: "#services" },
      { label: "Ngjarjet", href: "#stories" },
    ],
  },
  {
    title: "Ligjore",
    links: [
      { label: "Kushtet e Përdorimit", href: "#features" },
      { label: "Politika e Privatësisë", href: "#features" },
      { label: "info@unify.ks", href: "mailto:info@unify.ks" },
      { label: "Kontakt", href: "#contact" },
    ],
  },
];

export default function HomePage() {
  return (
    <PublicLayout navbar={{ links: navLinks }} footer={{ sections: footerSections }} className="bg-[#fbf8f2]">
      <main id="home" className="overflow-hidden pt-24">
        <section className="bg-[#fbf8f2] px-5 pb-24 pt-6 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[1180px]">
            <div className="grid items-center gap-16 lg:grid-cols-[1.04fr_0.96fr]">
              <div className="relative max-w-[470px] pt-10">
                <div className="absolute left-0 top-0 h-[66px] w-[66px] rounded-full bg-[#e8e1c9]" />
                <h1 className="relative font-[family:var(--font-display)] text-[58px] font-extrabold leading-[0.96] tracking-[-0.04em] text-[#3f210d] sm:text-[72px]">
                  Unite,
                  <br />
                  Ignite,
                  <br />
                  Make it Right
                </h1>
                <p className="mt-8 max-w-[360px] text-[15px] leading-8 text-[#90816f]">
                  Platforma e parë shqiptare e crowdfunding dhe ndihmës vullnetare. Bashkojmë njerëzit që duan
                  të bëjnë ndryshim.
                </p>
                <Button className={`${filledButtonClass} mt-9 min-w-[136px]`}>Dhuro Tani</Button>
              </div>

              <div className="relative flex justify-center lg:justify-end">
                <div className="relative h-[420px] w-[420px] sm:h-[470px] sm:w-[470px]">
                  <div className="absolute bottom-[22px] right-[10px] h-[180px] w-[180px] rounded-full bg-[#1899f2]" />
                  <div className="absolute right-[26px] top-[18px] h-[165px] w-[86px] rounded-[80px] border border-[#2d2a27] border-l-0 border-b-0" />
                  <div className="absolute right-[4px] top-[28px] h-[210px] w-[106px] rounded-[90px] border border-[#2d2a27] border-l-0 border-b-0" />
                  <div className="absolute left-[72px] top-[40px] h-[300px] w-[300px] overflow-hidden rounded-full border-[8px] border-[#fbf8f2] shadow-[0_22px_60px_rgba(63,33,13,0.12)]">
                    <img src={kidImage.src} alt="Child beneficiary" className="h-full w-full object-cover" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 grid overflow-hidden rounded-[4px] border border-[#e8e1d4] bg-white shadow-[0_4px_14px_rgba(63,33,13,0.06)] md:grid-cols-[1fr_1fr_1fr_1.75fr]">
              {stats.map((stat, index) => (
                <div key={stat.label} className="relative flex items-center justify-center px-6 py-5 md:min-h-[102px]">
                  <div className="text-center">
                    <p className="text-[11px] font-bold text-[#2e342f]">{stat.label}</p>
                    <p className="mt-2 text-[27px] font-extrabold leading-none text-[#1899f2]">{stat.value}</p>
                  </div>
                  {index < stats.length - 1 && (
                    <div className="absolute right-0 top-1/2 hidden h-[54px] w-[2px] -translate-y-1/2 rotate-[12deg] bg-[#151515] md:block" />
                  )}
                </div>
              ))}
              <div className="flex items-center justify-between gap-5 bg-[#ff2a23] px-8 py-5 text-white md:min-h-[102px]">
                <p className="max-w-[285px] text-[19px] font-extrabold leading-[1.35] text-white">
                  Qëllimi ynë është të ndihmojmë njerëzit të nevojë
                </p>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white md:h-12 md:w-12">
                  <span className="ml-1 text-base text-[#ff2a23]">▶</span>
                </div>
              </div>
            </div>

            <div id="features" className="mx-auto mt-28 max-w-[1010px] text-center">
              <p className={eyebrowClass}>Veçoritë Tona</p>
              <h2 className="mx-auto mt-5 max-w-[780px] font-[family:var(--font-display)] text-[34px] font-extrabold leading-[1.08] tracking-[-0.03em] text-[#3f210d] sm:text-[48px]">
                "Donacioni juaj është shkëndija që ndryshon një jetë - mbështetni sot një çështje në të cilën
                besoni."
              </h2>

              <div className="mt-14 grid gap-5 md:grid-cols-2">
                {featureCards.map((card) => {
                  const Icon = card.icon;

                  return (
                    <Card
                      key={card.title}
                      className="rounded-[10px] border border-[#e5dece] bg-white px-7 py-7 shadow-[0_10px_30px_rgba(63,33,13,0.05)]"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1899f2] text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-8 text-left font-[family:var(--font-display)] text-[28px] font-bold leading-none text-[#3f210d]">
                        {card.title}
                      </h3>
                      <div className="mt-6 h-[2px] w-[52px] bg-[#2f1d12]" />
                      <p className="mt-6 max-w-[390px] text-left text-[14px] leading-8 text-[#a19587]">{card.body}</p>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="causes" className="bg-white px-5 py-24 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[1180px]">
            <div className="text-center">
              <p className={eyebrowClass}>Rastet Tona</p>
              <h2 className="mt-4 font-[family:var(--font-display)] text-[40px] font-extrabold tracking-[-0.03em] text-[#3f210d] sm:text-[54px]">
                Shkaqet Tona të Fundit
              </h2>
            </div>

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {causeCards.map((card) => (
                <Card key={card.title} className="overflow-hidden rounded-[8px] border-0 bg-[#f6f1e3] shadow-none">
                  <div className="relative">
                    <img src={card.image} alt={card.badge} className="h-[230px] w-full object-cover" />
                    <Badge className="absolute bottom-4 left-4 rounded-full bg-[#1899f2] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-white hover:bg-[#1899f2]">
                      {card.badge}
                    </Badge>
                  </div>
                  <div className="px-5 pb-6 pt-5">
                    <h3 className="min-h-[86px] font-[family:var(--font-display)] text-[32px] font-bold leading-[1.06] tracking-[-0.03em] text-[#3f210d]">
                      {card.title}
                    </h3>
                    <div className="mt-8 flex items-center justify-between">
                      <span className="text-[26px] font-semibold text-[#4f2e18]">{card.raised}</span>
                      <span className="text-[13px] text-[#aea28f]">{card.goal}</span>
                    </div>
                    <div className="mt-4 h-[5px] rounded-full bg-[#e4dfd0]">
                      <div className="h-[5px] rounded-full bg-[#41bfc3]" style={{ width: card.progress }} />
                    </div>
                    <Button className={`${filledButtonClass} mt-6 min-w-[136px]`}>Dhuro Tani</Button>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button className={outlineButtonClass}>Shiko Të Gjitha</Button>
            </div>
          </div>
        </section>

        <section id="about" className="bg-[#fbf8f2] px-5 py-24 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[1180px]">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              <div className="relative mx-auto w-full max-w-[420px]">
                <div className="absolute left-[10px] top-[18px] h-[102px] w-[84px] rounded-[18px] bg-[#1899f2]" />
                <div className="absolute bottom-[10px] left-[46px] h-[86px] w-[74px] rounded-[999px] bg-[#1899f2]" />
                <div className="relative ml-10 mt-10 h-[280px] w-[280px] overflow-hidden rounded-[22px] shadow-[0_24px_60px_rgba(63,33,13,0.12)]">
                  <img
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80"
                    alt="Helping hands"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div>
                <p className={eyebrowClass}>Rreth Nesh</p>
                <h2 className="mt-4 max-w-[400px] font-[family:var(--font-display)] text-[50px] font-extrabold leading-[0.98] tracking-[-0.04em] text-[#3f210d] sm:text-[62px]">
                  Forma më e lartë e dashurisë
                </h2>
                <p className="mt-8 max-w-[430px] text-[18px] leading-9 text-[#4d3f2f]">
                  "Kuptimi i jetës është të gjesh dhuratën tënde. Qëllimi i jetës është ta japësh atë." - Pablo
                  Picasso
                </p>
                <Button className={`${outlineButtonClass} mt-9`}>Rreth Nesh</Button>
              </div>
            </div>

            <p className="mx-auto mt-14 max-w-[520px] text-center font-[family:var(--font-display)] text-[30px] font-bold leading-[1.18] text-[#4a250f]">
              Çfarëdo që ju intereson, do të ketë një organizatë që punon për të.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {volunteerStats.map((item) => (
                <Card key={item.title} className="rounded-[10px] border-0 bg-white px-8 py-6 shadow-none">
                  <div className="flex items-center gap-5">
                    <span className="font-[family:var(--font-display)] text-[54px] font-extrabold leading-none text-[#3f210d]">
                      {item.value}
                    </span>
                    <div>
                      <p className="font-[family:var(--font-display)] text-[26px] font-bold text-[#4a250f]">{item.title}</p>
                      <p className="text-[14px] text-[#b5a89a]">{item.subtitle}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-16 grid items-center gap-14 lg:grid-cols-2">
              <div className="max-w-[380px]">
                <p className={eyebrowClass}>Vullnetarë</p>
                <h2 className="mt-4 font-[family:var(--font-display)] text-[52px] font-extrabold leading-[1] tracking-[-0.04em] text-[#3f210d]">
                  Dashurinë e pashprehur ndaj njerëzve
                </h2>
                <p className="mt-8 text-[18px] leading-8 text-[#4d3f2f]">
                  "Nëse doni të ngritni veten, ngritni dikë tjetër." - Booker T. Washington
                </p>
                <Button className={`${outlineButtonClass} mt-8`}>Bëhu Vullnetar</Button>
              </div>

              <div className="relative mx-auto h-[330px] w-full max-w-[430px]">
                <div className="absolute left-[74px] top-[34px] h-[114px] w-[114px] rounded-full bg-[#1899f2]" />
                <div className="absolute bottom-[22px] right-[10px] h-[106px] w-[106px] rounded-[18px] bg-[#1899f2]" />
                <div className="absolute left-[130px] top-[30px] h-[230px] w-[230px] overflow-hidden rounded-full border-[8px] border-[#fbf8f2] shadow-[0_24px_60px_rgba(63,33,13,0.12)]">
                  <img
                    src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80"
                    alt="Volunteer helping a child"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="bg-white px-5 py-24 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[1180px]">
            <p className={eyebrowClass}>Shërbimet Tona</p>
            <h2 className="mt-4 font-[family:var(--font-display)] text-[42px] font-extrabold tracking-[-0.03em] text-[#3f210d] sm:text-[56px]">
              Shërbimet që Ofrojmë
            </h2>

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {serviceCards.map((card) => (
                <Card key={card.title} className="rounded-[8px] border-0 bg-[#f8f4e8] px-6 py-6 shadow-none">
                  <div className="h-12 w-12 rounded-[16px_16px_16px_0] bg-[#1899f2]" />
                  <div className="mt-6 h-[2px] w-[52px] bg-[#2f1d12]" />
                  <h3 className="mt-5 font-[family:var(--font-display)] text-[30px] font-bold text-[#3f210d]">{card.title}</h3>
                  <p className="mt-4 text-[14px] leading-8 text-[#988c7e]">{card.body}</p>
                  <Button className={`${filledButtonClass} mt-6 h-8 px-5 text-[10px]`}>Mëso Më Shumë</Button>
                </Card>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button className={outlineButtonClass}>Shiko Të Gjitha</Button>
            </div>
          </div>
        </section>

        <section className="bg-[#fbf8f2] px-5 py-20 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[1180px]">
            <div className="text-center">
              <p className={eyebrowClass}>Shikoni Galerinë Tonë</p>
            </div>

            <div className="mx-auto mt-12 grid max-w-[1060px] gap-5 md:grid-cols-[0.92fr_1.08fr_0.92fr]">
              <div className="space-y-5">
                <img src={galleryImages[0]} alt="Gallery crowd" className="h-[165px] w-full rounded-[14px] object-cover" />
                <img src={galleryImages[1]} alt="Gallery classroom" className="h-[185px] w-full rounded-[14px] object-cover" />
              </div>

              <div className="relative">
                <img src={galleryImages[4]} alt="Children running" className="h-full min-h-[370px] w-full rounded-[18px] object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_12px_30px_rgba(24,153,242,0.18)]">
                    <span className="ml-1 text-xl text-[#1899f2]">▶</span>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <img src={galleryImages[2]} alt="Volunteer back" className="h-[185px] w-full rounded-[14px] object-cover" />
                <img src={galleryImages[3]} alt="Students" className="h-[165px] w-full rounded-[14px] object-cover" />
              </div>
            </div>

            <div className="mt-12 text-center">
              <Button className={outlineButtonClass}>Shiko Të Gjitha</Button>
            </div>
          </div>
        </section>

        <section className="bg-[#1899f2] px-5 py-14 text-white sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-[1180px] flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="max-w-[420px] font-[family:var(--font-display)] text-[48px] font-extrabold leading-[1.03] tracking-[-0.03em]">
              Bashkohu me misionin tonë!
            </h2>
            <div className="flex flex-wrap gap-4">
              <Button className="h-12 rounded-full border border-white bg-white px-7 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#1899f2] hover:bg-white">
                Dhuro Tani
                <span className="ml-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#ff3131] text-[10px] text-white">
                  ▶
                </span>
              </Button>
              <Button className="h-12 rounded-full border border-white bg-white px-7 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#1899f2] hover:bg-white">
                Hapi 02
                <span className="ml-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#ff3131] text-[10px] text-white">
                  ▶
                </span>
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-[#fbf8f2] px-5 py-24 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[1180px]">
            <p className={eyebrowClass}>Vullnetarët</p>
            <h2 className="mt-4 font-[family:var(--font-display)] text-[44px] font-extrabold tracking-[-0.03em] text-[#3f210d] sm:text-[58px]">
              Vullnetarët Tanë
            </h2>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {volunteers.map((volunteer) => (
                <Card key={volunteer.name} className="rounded-[10px] border-0 bg-white p-3 shadow-none">
                  <img src={volunteer.image} alt={volunteer.name} className="h-[212px] w-full rounded-[6px] object-cover" />
                  <div className="px-2 pb-3 pt-5 text-center">
                    <h3 className="font-[family:var(--font-display)] text-[30px] font-bold text-[#3f210d]">{volunteer.name}</h3>
                    <p className="mt-1 text-[13px] text-[#b8afa3]">{volunteer.role}</p>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button className={outlineButtonClass}>Të Gjithë Ekipit</Button>
            </div>
          </div>
        </section>

        <section id="stories" className="bg-white px-5 py-24 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[1180px] text-center">
            <p className={eyebrowClass}>Histori Fëmijësh</p>
            <h2 className="mt-4 font-[family:var(--font-display)] text-[48px] font-extrabold tracking-[-0.03em] text-[#3f210d] sm:text-[60px]">
              Lexo Historitë
            </h2>

            <div className="relative mx-auto mt-16 max-w-[840px] rounded-[18px] border border-[#ece4d7] bg-white px-6 pb-10 pt-16 shadow-[0_12px_30px_rgba(63,33,13,0.05)] sm:px-14">
              <div className="absolute left-1/2 top-0 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#ece4d7] bg-white text-[32px] font-bold text-[#1899f2]">
                "
              </div>
              <p className="mx-auto max-w-[640px] text-[18px] leading-10 text-[#4b3a2f] sm:text-[20px]">
                "Për shkak të mbështetjes suaj të vazhdueshme, fëmijët tanë tashmë kanë akses në edukim të
                mirëfilltë dhe shërbime shëndetësore. Ju jeni arsyeja pse ata buzëqeshin sot!"
              </p>
              <p className="mt-10 text-[11px] font-extrabold uppercase tracking-[0.3em] text-[#b5c0dc]">Prind</p>
              <div className="mt-4 flex items-center justify-center">
                <div className="flex items-center">
                  {volunteers.slice(0, 5).map((volunteer, index) => (
                    <img
                      key={volunteer.name}
                      src={volunteer.image}
                      alt={volunteer.name}
                      className={`h-9 w-9 rounded-full border-2 border-white object-cover ${index > 0 ? "-ml-2" : ""}`}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-6 font-[family:var(--font-display)] text-[34px] font-bold text-[#3f210d]">Linda Berisha</p>
              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#ece4d7] text-[#beb8b0]"
                  aria-label="Previous story"
                >
                  ←
                </button>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#ece4d7] text-[#beb8b0]"
                  aria-label="Next story"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-white px-5 py-24 sm:px-8 lg:px-10">
          <div className="absolute right-[-82px] top-[180px] h-[100px] w-[100px] rounded-full bg-[#1899f2]" />
          <div className="mx-auto max-w-[1180px]">
            <div className="text-center">
              <p className={eyebrowClass}>FAQ</p>
              <h2 className="mx-auto mt-4 max-w-[620px] font-[family:var(--font-display)] text-[46px] font-extrabold leading-[1.02] tracking-[-0.04em] text-[#2f443e] sm:text-[64px]">
                Përgjigjet e të Gjitha Pyetjeve Tuaja
              </h2>
              <div className="mx-auto mt-6 h-[3px] w-[64px] bg-[#7fb8e7]" />
              <p className="mt-4 text-[15px] text-[#9a9a9a]">Pyetjet më të shpeshta?</p>
            </div>

            <div className="mx-auto mt-14 max-w-[760px]">
              <Accordion type="single" collapsible defaultValue="item-0">
                {faqItems.map((item, index) => (
                  <AccordionItem
                    key={item.question}
                    value={`item-${index}`}
                    className={`border-b border-[#ece7de] ${index === 0 ? "rounded-none border-b-0 bg-[#1899f2] px-4 text-white" : ""}`}
                  >
                    <AccordionTrigger
                      className={`py-6 text-left text-[15px] font-extrabold no-underline hover:no-underline ${
                        index === 0 ? "text-white [&>svg]:hidden" : "text-[#1899f2] [&>svg]:hidden"
                      }`}
                    >
                      <span>{item.question}</span>
                      <PlusIcon className={`h-4 w-4 ${index === 0 ? "text-white" : "text-[#1899f2]"}`} />
                    </AccordionTrigger>
                    <AccordionContent className={index === 0 ? "pb-6 text-white/85" : "pb-6 text-[#8e877d]"}>
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        <section id="contact" className="bg-[#fbf8f2] px-5 py-20 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-[1180px] items-center gap-12 lg:grid-cols-[0.98fr_0.82fr]">
            <div className="max-w-[420px]">
              <p className={eyebrowClass}>Bamirësi</p>
              <h2 className="mt-4 font-[family:var(--font-display)] text-[52px] font-extrabold leading-[0.98] tracking-[-0.04em] text-[#3f210d]">
                Dhënie ndihmë ndaj atyre që kanë nevojë
              </h2>
              <p className="mt-8 text-[15px] leading-8 text-[#9b8f80]">
                Bamirësia është akti i dhënies ndihmës ndaj atyre që kanë nevojë. Është një akt humanitar.
              </p>
              <Button className={`${outlineButtonClass} mt-9`}>Dhuro Tani</Button>
            </div>

            <div className="mx-auto w-full max-w-[340px] overflow-hidden rounded-[18px] shadow-[0_20px_50px_rgba(63,33,13,0.12)]">
              <img
                src="https://images.unsplash.com/photo-1518398046578-8cca57782e17?auto=format&fit=crop&w=900&q=80"
                alt="Child in need"
                className="h-[340px] w-full object-cover grayscale"
              />
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
