import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Glyph } from "./Glyph";
import {
  email,
  nav,
  projects,
  experiences,
  sections,
  sectionId,
  searchItems,
  pageTitle,
} from "./content";
function CopyEmail() {
  const [state, setState] = useState("Copy email");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <button
      className="copy"
      onClick={async () => {
        clearTimeout(timer.current);
        try {
          await navigator.clipboard.writeText(email);
          setState("Copied ✓");
        } catch {
          setState("Select email to copy");
        }
        timer.current = setTimeout(() => setState("Copy email"), 2000);
      }}
    >
      <span aria-live="polite">{state}</span>
    </button>
  );
}
function Socials() {
  return (
    <>
      <a href="https://github.com/gitanshkothari">GitHub ↗</a>
      <a href="https://linkedin.com/in/gitansh-kothari/">LinkedIn ↗</a>
      <a href="/resume/Gitansh_Kothari_Resume.pdf">Résumé ↗</a>
    </>
  );
}
function Search({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const [query, setQuery] = useState(""),
    [selected, setSelected] = useState(0),
    [copyStatus, setCopyStatus] = useState("Copy email");
  useEffect(() => {
    if (copyStatus === "Copy email") return;
    const timer = setTimeout(() => setCopyStatus("Copy email"), 2000);
    return () => clearTimeout(timer);
  }, [copyStatus]);
  const trigger = useRef<HTMLButtonElement>(null);
  const q = query.toLowerCase().trim();
  const score = (i: (typeof searchItems)[number]) =>
    i.title.toLowerCase() === q
      ? 3
      : i.aliases.toLowerCase().split(" ").includes(q)
        ? 2
        : 1;
  const results = searchItems
    .filter(
      (i) =>
        !q ||
        (i.title + " " + i.aliases + " " + i.description)
          .toLowerCase()
          .includes(q),
    )
    .sort((a, b) => score(b) - score(a));
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(0);
    }
  }, [open]);
  useEffect(() => {
    document
      .getElementById("result-" + selected)
      ?.scrollIntoView({ block: "nearest" });
  }, [selected]);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger ref={trigger} className="search-button">
        <span className="desktop-label">⌘ / Ctrl K</span>
        <span className="mobile-label">Search</span>
        <span className="sr-only"> portfolio</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />
        <Dialog.Content
          className="dialog"
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            trigger.current?.focus();
          }}
        >
          <Dialog.Title className="sr-only">Search portfolio</Dialog.Title>
          <Dialog.Description className="sr-only">
            Find pages, projects, skills and experience. Use arrow keys and
            Enter to select a result.
          </Dialog.Description>
          <div className="search-head">
            <input
              autoFocus
              aria-label="Search projects, skills, experience"
              placeholder="Search projects, skills, experience…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelected(0);
              }}
              onKeyDown={(e) => {
                if (["ArrowDown", "ArrowUp"].includes(e.key)) {
                  e.preventDefault();
                  setSelected(
                    (n) =>
                      (n + (e.key === "ArrowDown" ? 1 : -1) + results.length) %
                      Math.max(1, results.length),
                  );
                }
                if (e.key === "Enter") {
                  e.preventDefault();
                  document.getElementById("result-" + selected)?.click();
                }
              }}
            />
            <Dialog.Close className="quiet">Esc</Dialog.Close>
          </div>
          <div className="results" aria-label="Search results">
            {results.map((r, i) =>
              r.href === "copy" ? (
                <button
                  id={"result-" + i}
                  key={r.href}
                  className={"result " + (i === selected ? "selected" : "")}
                  onFocus={() => setSelected(i)}
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(email);
                      setCopyStatus("Copied ✓");
                    } catch {
                      setCopyStatus("Select email to copy");
                    }
                  }}
                >
                  <span aria-live="polite">{copyStatus}</span>{" "}
                  <small>{email}</small>
                </button>
              ) : (
                <a
                  id={"result-" + i}
                  key={r.href}
                  className={"result " + (i === selected ? "selected" : "")}
                  href={r.href}
                  onFocus={() => setSelected(i)}
                  onClick={() => setOpen(false)}
                >
                  <span>
                    {r.title}
                    <small>{r.description}</small>
                  </span>
                  <span className="result-type">{r.type} ↗</span>
                </a>
              ),
            )}
            {!results.length && (
              <div className="empty">
                <p>No matches for “{query}”.</p>
                <button onClick={() => setQuery("")}>Clear search</button>
                <div className="flex flex-wrap gap-5 mt-6">
                  {nav.map((n) => (
                    <a
                      key={n.href}
                      href={n.href}
                      onClick={() => setOpen(false)}
                    >
                      {n.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="search-foot">
            ↑ ↓ to explore <span>Enter to open · Esc to close</span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
function Home({
  reduced,
  navigate,
}: {
  reduced: boolean;
  navigate: (path: string) => void;
}) {
  const [word, setWord] = useState("");
  const input = useRef<HTMLInputElement>(null),
    hero = useRef<HTMLElement>(null);
  const value = word.toLowerCase().trim();
  const matches = nav.filter((n) =>
    n.aliases.split(" ").some((a) => a.startsWith(value)),
  );
  useEffect(() => {
    const exact = nav.find((n) => n.aliases.split(" ").includes(value));
    if (!exact) return;
    const timer = setTimeout(() => navigate(exact.href), 200);
    return () => clearTimeout(timer);
  }, [value, navigate]);
  useEffect(() => {
    const type = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      const rect = hero.current?.getBoundingClientRect();
      if (
        !rect ||
        rect.bottom < 150 ||
        rect.top > innerHeight ||
        document.querySelector('[role="dialog"]') ||
        !matchMedia("(pointer:fine)").matches ||
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        e.isComposing ||
        el.closest('input,textarea,select,[contenteditable="true"]') ||
        getSelection()?.toString()
      )
        return;
      if (/^[a-z]$/i.test(e.key)) {
        e.preventDefault();
        input.current?.focus();
        setWord(e.key);
      }
    };
    window.addEventListener("keydown", type);
    return () => window.removeEventListener("keydown", type);
  }, []);
  return (
    <section ref={hero} className="home">
      <h1 tabIndex={-1} className="sr-only">
        Gitansh Kothari — Software, vision and robotics
      </h1>
      <div className="eyebrow">
        <span>Software · Vision · Robotics</span>
        <span>Personal index / 01</span>
      </div>
      <Glyph word={matches.length ? value : ""} reduced={reduced} />
      <form
        className="entry"
        onSubmit={(e) => {
          e.preventDefault();
          if (["resume", "cv"].includes(value))
            location.assign("/resume/Gitansh_Kothari_Resume.pdf");
          else if (matches[0]) navigate(matches[0].href);
        }}
      >
        <input
          ref={input}
          aria-label="Type a destination"
          placeholder="type to explore"
          value={word}
          autoComplete="off"
          spellCheck={false}
          maxLength={24}
          onChange={(e) => setWord(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setWord("");
              input.current?.blur();
            }
          }}
        />
        <button
          type="button"
          aria-label="Clear destination"
          onClick={() => {
            setWord("");
            input.current?.focus();
          }}
        >
          ↶
        </button>
      </form>
      <div className="suggestions" aria-live="polite">
        {value && !matches.length ? (
          <span>
            {["resume", "cv"].includes(value) ? (
              <a href="/resume/Gitansh_Kothari_Resume.pdf">View résumé PDF ↗</a>
            ) : (
              "Try work, experience, about or contact."
            )}
          </span>
        ) : (
          matches.map((n) => (
            <a key={n.href} href={n.href}>
              {n.title.toLowerCase()}
            </a>
          ))
        )}
      </div>
      <div className="home-copy">
        A few things I’ve built.
        <br />A little about how I think.
        <p>Type a destination, or choose one above.</p>
      </div>
    </section>
  );
}
function Heading({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="page-heading">
      <div className="eyebrow">{label}</div>
      <h1 tabIndex={-1}>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
}
function Work() {
  return (
    <>
      <Heading
        label="Selected work / 02"
        title="Work"
        description="Three projects, from visual perception to useful software. A closer look at the decisions behind each."
      />
      <div className="work-list">
        {projects.map((p, i) => (
          <article key={p.slug} className="work-row">
            <a href={"/projects/" + p.slug} className="project-image">
              <img
                src={p.image}
                width="1000"
                height="625"
                alt={p.caption}
                loading={i ? "lazy" : "eager"}
              />
            </a>
            <div>
              <div className="eyebrow">
                0{i + 1} / {p.status}
              </div>
              <h2>
                <a href={"/projects/" + p.slug}>{p.title}</a>
              </h2>
              <p>{p.summary}</p>
              <p className="role">{p.role}</p>
              <div className="tags">
                {p.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <a className="text-link" href={"/projects/" + p.slug}>
                Read case study <span>↗</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
function CaseStudy({ slug }: { slug: string }) {
  const p = projects.find((p) => p.slug === slug)!;
  const [active, setActive] = useState("overview");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        }),
      { rootMargin: "-15% 0px -60% 0px" },
    );
    document
      .querySelectorAll("article section[id]")
      .forEach((e) => observer.observe(e));
    return () => observer.disconnect();
  }, [slug]);
  const toc = (
    <nav aria-label="On this page">
      {sections.map((s) => (
        <a
          key={s}
          href={"#" + sectionId(s)}
          aria-current={active === sectionId(s) ? "location" : undefined}
        >
          {s}
        </a>
      ))}
    </nav>
  );
  return (
    <>
      <a className="back-link" href="/projects">
        ← Back to Work
      </a>
      <Heading label={p.status} title={p.title} description={p.summary} />
      <div className="project-meta">
        <span>{p.role}</span>
        <span>{p.tags.join(" · ")}</span>
        <a href={p.repo}>View source ↗</a>
      </div>
      <figure className="cover">
        <img src={p.image} width="1200" height="750" alt={p.caption} />
        <figcaption>{p.caption}</figcaption>
      </figure>
      <div className="reader-layout">
        <aside className="toc">
          <span className="eyebrow">On this page</span>
          {toc}
        </aside>
        <article className="reader">
          <details className="mobile-toc">
            <summary>On this page</summary>
            {toc}
          </details>
          <div className="quick-read">
            <span className="eyebrow">The quick read</span>
            <p>{p.quick}</p>
          </div>
          {sections.map((s, i) => (
            <section key={s} id={sectionId(s)}>
              <h2>
                <a href={"#" + sectionId(s)}>
                  {s}
                  <span aria-hidden="true"> ↗</span>
                </a>
              </h2>
              {p.body[i].map((t) => (
                <p key={t}>{t}</p>
              ))}
              {s === "Results" && p.metrics && (
                <div className="metrics">
                  {p.metrics.map((m) => (
                    <div key={m.label}>
                      <strong>{m.value}</strong>
                      <span>{m.label}</span>
                    </div>
                  ))}
                </div>
              )}
              {s === "System / Architecture" &&
                p.slug === "deepreplication" && (
                  <div className="family-list">
                    {[
                      "CNNs — architecture implementations",
                      "Transformer — sequence modeling",
                      "Diffusion — exploratory",
                      "Language-model components — exploratory",
                    ].map((t) => (
                      <div key={t}>{t}</div>
                    ))}
                  </div>
                )}
            </section>
          ))}
          <div className="next-project">
            <span className="eyebrow">Next project</span>
            <h2>
              <a
                href={
                  "/projects/" + projects[(projects.indexOf(p) + 1) % 3].slug
                }
              >
                {projects[(projects.indexOf(p) + 1) % 3].title} ↗
              </a>
            </h2>
            <a href="/contact">Discuss the work →</a>
          </div>
        </article>
      </div>
    </>
  );
}
function Experience() {
  return (
    <>
      <Heading
        label="Experience / 03"
        title="Software in the real world."
        description="Perception systems, deployment constraints and learning by doing."
      />
      {experiences.map((e) => (
        <section className="experience-row" key={e.id} id={e.id}>
          <div className="eyebrow">{e.date}</div>
          <div>
            <h2>{e.company}</h2>
            <p className="role">{e.role}</p>
            <p className="lead">{e.summary}</p>
            <ul>
              {e.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <p className="mono muted">{e.tags}</p>
            {e.id === "magna" && (
              <a className="text-link" href={"/projects/" + projects[0].slug}>
                Related personal work: driving perception ↗
              </a>
            )}
          </div>
        </section>
      ))}
    </>
  );
}
function About() {
  return (
    <>
      <Heading label="About / 04" title="Curious about how things work." />
      <div className="about-intro">
        <p>
          I’m Gitansh. I build software and explore how machines understand the
          world.
        </p>
        <p className="muted">
          My work sits between computer vision, systems engineering and useful
          software. I’m interested in the details that turn an idea into
          something that works: data, implementation choices and the constraints
          around them.
        </p>
        <p className="muted">
          I learn by building, measuring and revisiting the assumptions. The
          projects here include both practical systems and architecture
          implementations, with their limitations kept in view.
        </p>
      </div>
      <section id="education" className="about-section">
        <h2>Education</h2>
        <div className="education-row">
          <h3>University of California, San Diego</h3>
          <p>MS Computer Science · Current study</p>
        </div>
        <div className="education-row">
          <h3>University of Toronto</h3>
          <p>BASc Computer Engineering · 2020–2025</p>
          <p className="muted">
            Minors in Artificial Intelligence and Engineering Business
          </p>
        </div>
      </section>
      <section className="about-section">
        <h2>Capabilities, with context.</h2>
        {[
          {
            name: "Perception / ML",
            skills: ["PyTorch", "Computer vision", "Transformers"],
            href: "/projects/" + projects[0].slug,
          },
          {
            name: "Systems / performance",
            skills: ["C++", "CUDA", "TensorRT", "ONNX"],
            href: "/experience#magna",
          },
          {
            name: "Product / software",
            skills: ["TypeScript", "React", "PostgreSQL"],
            href: "/projects/scholarspace-ai",
          },
        ].map((g) => (
          <div className="skill-row" key={g.name}>
            <h3>{g.name}</h3>
            <div className="flex flex-wrap gap-4">
              {g.skills.map((s) => (
                <a key={s} href={g.href}>
                  {s} ↗
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
function Contact() {
  return (
    <>
      <Heading
        label="Contact / 05"
        title="Let’s make something useful."
        description="For opportunities, thoughtful questions, or a conversation about the work."
      />
      <div className="contact-content">
        <a className="email" href={"mailto:" + email}>
          {email}
        </a>
        <div className="contact-actions">
          <CopyEmail />
          <a href={"mailto:" + email}>Email me ↗</a>
        </div>
        <div className="contact-links">
          <Socials />
        </div>
        <section className="resume">
          <h2>Résumé</h2>
          <p className="muted">
            Source portfolio version. Current résumé verification is pending.
          </p>
          <div className="flex gap-6 flex-wrap">
            <a href="/resume/Gitansh_Kothari_Resume.pdf">View PDF ↗</a>
            <a href="/resume/Gitansh_Kothari_Resume.pdf" download>
              Download PDF ↓
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
export function App({ initialPath = "/" }: { initialPath?: string }) {
  const [path, setPath] = useState(initialPath.replace(/\/$/, "") || "/"),
    [search, setSearch] = useState(false),
    [menu, setMenu] = useState(false),
    [motionOff, setMotionOff] = useState(false),
    [systemReduced, setSystemReduced] = useState(false);
  const [transition, setTransition] = useState<{
    word: string;
    initial: string;
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const transitionTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(transitionTimer.current), []);
  const main = useRef<HTMLElement>(null);
  const positions = useRef(new Map<string, number>());
  const currentUrl = useRef("");
  const focusTargets = useRef(
    new Map<string, { href: string; text: string }>(),
  );
  const pathRef = useRef(path);
  const navigateRef = useRef<(href: string) => void>(() => {});
  const navigate = useRef((href: string) => navigateRef.current(href)).current;
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    setSystemReduced(mq.matches);
    const update = () => setSystemReduced(mq.matches);
    mq.addEventListener("change", update);
    try {
      setMotionOff(localStorage.getItem("glyph-motion") === "off");
    } catch {}
    return () => mq.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    currentUrl.current = location.href;
    navigateRef.current = (href) => {
      const url = new URL(href, location.href);
      clearTimeout(transitionTimer.current);
      setTransition(null);
      const canvas = document.querySelector<HTMLCanvasElement>(".home canvas");
      if (
        location.pathname === "/" &&
        canvas &&
        nav.some((n) => n.href === url.pathname) &&
        document.querySelector(".site")?.getAttribute("data-motion") !== "off"
      ) {
        const box = canvas.getBoundingClientRect();
        if (box.bottom > 0) {
          setTransition({
            word: pageTitle(url.pathname).toLowerCase(),
            initial:
              document.querySelector<HTMLInputElement>(".entry input")?.value ||
              "",
            top: box.top,
            left: box.left,
            width: box.width,
            height: box.height,
          });
          transitionTimer.current = setTimeout(() => setTransition(null), 400);
        }
      }
      positions.current.set(location.href, scrollY);
      const focused = document.activeElement as HTMLAnchorElement;
      if (focused?.href)
        focusTargets.current.set(location.href, {
          href: focused.href,
          text: focused.textContent || "",
        });
      history.pushState({}, "", url);
      currentUrl.current = url.href;
      setPath(url.pathname.replace(/\/$/, "") || "/");
      pathRef.current = url.pathname;
      setMenu(false);
      setSearch(false);
      requestAnimationFrame(() => {
        if (url.hash)
          document
            .getElementById(decodeURIComponent(url.hash.slice(1)))
            ?.scrollIntoView();
        else scrollTo(0, 0);
        main.current
          ?.querySelector<HTMLElement>("h1")
          ?.focus({ preventScroll: true });
      });
    };
    const click = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a");
      if (
        !a ||
        e.defaultPrevented ||
        e.button ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        a.hasAttribute("download") ||
        a.target
      )
        return;
      const url = new URL(a.href);
      if (url.origin !== location.origin || url.pathname.endsWith(".pdf"))
        return;
      if (url.pathname === location.pathname && url.hash) return;
      e.preventDefault();
      navigate(url.href);
    };
    const pop = () => {
      clearTimeout(transitionTimer.current);
      setTransition(null);
      positions.current.set(currentUrl.current, scrollY);
      currentUrl.current = location.href;
      setPath(location.pathname.replace(/\/$/, "") || "/");
      setMenu(false);
      setSearch(false);
      requestAnimationFrame(() => {
        if (location.hash)
          document
            .getElementById(decodeURIComponent(location.hash.slice(1)))
            ?.scrollIntoView();
        else scrollTo(0, positions.current.get(location.href) || 0);
        const target = focusTargets.current.get(location.href);
        if (target)
          Array.from(document.querySelectorAll<HTMLAnchorElement>("main a"))
            .find(
              (a) => a.href === target.href && a.textContent === target.text,
            )
            ?.focus({ preventScroll: true });
      });
    };
    history.scrollRestoration = "manual";
    document.addEventListener("click", click);
    window.addEventListener("popstate", pop);
    const key = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setMenu(false);
        setSearch((v) => !v);
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("click", click);
      window.removeEventListener("popstate", pop);
      document.removeEventListener("keydown", key);
      history.scrollRestoration = "auto";
    };
  }, [navigate]);
  useEffect(() => {
    document.title =
      pageTitle(path) +
      (path === "/" ? " — Software, vision & robotics" : " — Gitansh Kothari");
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", "https://gitanshkothari.vercel.app" + path);
  }, [path]);
  const project = projects.find((p) => "/projects/" + p.slug === path);
  return (
    <div
      className="site"
      data-motion={motionOff || systemReduced ? "off" : "on"}
    >
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="header">
        <a className="brand" href="/" aria-label="Gitansh Kothari, home">
          <strong>gk.</strong>
          <span>Gitansh Kothari</span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              aria-current={path.startsWith(n.href) ? "page" : undefined}
            >
              {n.title}
            </a>
          ))}
        </nav>
        <Search
          open={search}
          setOpen={(v) => {
            setMenu(false);
            setSearch(v);
          }}
        />
        <Dialog.Root
          open={menu}
          onOpenChange={(v) => {
            setSearch(false);
            setMenu(v);
          }}
        >
          <Dialog.Trigger className="menu-button">Menu</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="overlay" />
            <Dialog.Content className="dialog mobile-menu">
              <Dialog.Title>Explore</Dialog.Title>
              <Dialog.Description className="sr-only">
                Portfolio navigation
              </Dialog.Description>
              <Dialog.Close className="menu-close">Close ×</Dialog.Close>
              <nav aria-label="Mobile navigation">
                {nav.map((n) => (
                  <a key={n.href} href={n.href}>
                    {n.title} ↗
                  </a>
                ))}
                <a href="/resume/Gitansh_Kothari_Resume.pdf">Résumé ↗</a>
              </nav>
              <label>
                <input
                  type="checkbox"
                  checked={motionOff}
                  onChange={(e) => {
                    setMotionOff(e.target.checked);
                    try {
                      localStorage.setItem(
                        "glyph-motion",
                        e.target.checked ? "off" : "on",
                      );
                    } catch {}
                  }}
                />{" "}
                Reduce motion
              </label>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </header>
      <noscript>
        <style>{`.menu-button,.search-button,.entry,.glyph,.copy,.footer-bottom button{display:none}.desktop-nav{display:flex;flex-wrap:wrap}.header{height:auto;min-height:96px;flex-wrap:wrap;padding-block:16px}`}</style>
      </noscript>
      <main ref={main} id="main" className={path === "/" ? "" : "interior"}>
        {path === "/" ? (
          <Home reduced={motionOff || systemReduced} navigate={navigate} />
        ) : path === "/projects" ? (
          <Work />
        ) : project ? (
          <CaseStudy key={project.slug} slug={project.slug} />
        ) : path === "/experience" ? (
          <Experience />
        ) : path === "/about" ? (
          <About />
        ) : path === "/contact" ? (
          <Contact />
        ) : (
          <>
            <Heading label="404" title="This page isn’t here." />
            <p>
              <a href="/projects">Explore Work →</a>
            </p>
            <p>
              <a href="/">Return home →</a>
            </p>
            <button onClick={() => setSearch(true)}>
              Search the portfolio
            </button>
          </>
        )}
      </main>
      <footer>
        <div className="footer-top">
          <span>Gitansh Kothari / Selected work</span>
          <CopyEmail />
          <div className="footer-links">
            <Socials />
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Gitansh Kothari</span>
          <button
            aria-pressed={motionOff}
            onClick={() => setMotionOff((v) => !v)}
          >
            Motion: {motionOff || systemReduced ? "reduced" : "on"}
          </button>
        </div>
      </footer>
      {transition && (
        <div
          className="route-morph"
          aria-hidden="true"
          style={{
            top: transition.top,
            left: transition.left,
            width: transition.width,
            height: transition.height,
          }}
        >
          <Glyph word={transition.word} initialWord={transition.initial} />
        </div>
      )}
      <div className="sr-only" role="status" aria-live="polite">
        {pageTitle(path)}
      </div>
    </div>
  );
}
