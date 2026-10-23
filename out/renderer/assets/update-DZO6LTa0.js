var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
globalThis.__MAESTRI_BUILD_SHA__ = "1bf806c58255ee745382a65848e9698af74aba67";
import { u as useTranslation, r as reactExports, j as jsxRuntimeExports, D as Download, a as clientExports, R as RootErrorBoundary, i as instance } from "./global-DRL_rtBl.js";
const ALLOWED_TAGS = /* @__PURE__ */ new Set([
  "H1",
  "H2",
  "H3",
  "H4",
  "P",
  "UL",
  "OL",
  "LI",
  "BLOCKQUOTE",
  "STRONG",
  "B",
  "EM",
  "I",
  "CODE",
  "PRE",
  "BR",
  "HR",
  "A"
]);
const DROP_WITH_CONTENT = /* @__PURE__ */ new Set([
  "SCRIPT",
  "STYLE",
  "TEMPLATE",
  "IFRAME",
  "FRAME",
  "FRAMESET",
  "OBJECT",
  "EMBED",
  "APPLET",
  "NOSCRIPT",
  "LINK",
  "META",
  "BASE",
  "FORM",
  "INPUT",
  "BUTTON",
  "SELECT",
  "TEXTAREA",
  "SVG",
  "MATH"
]);
const MAX_NODES = 4e3;
const MAX_DEPTH = 24;
const MAX_TEXT = 2e5;
function parseNotes(raw) {
  const trimmed = raw.trim();
  if (trimmed === "") return { kind: "empty" };
  const source = new DOMParser().parseFromString(trimmed, "text/html").body;
  const fragment = document.createDocumentFragment();
  const budget = { nodes: MAX_NODES, text: MAX_TEXT };
  const elements = build(source, fragment, budget, 0);
  if (elements === 0) {
    const text = (source.textContent ?? trimmed).trim();
    return text === "" ? { kind: "empty" } : { kind: "text", text: text.slice(0, MAX_TEXT) };
  }
  return { kind: "markup", fragment };
}
__name(parseNotes, "parseNotes");
function build(source, into, budget, depth) {
  let emitted = 0;
  for (const child of source.childNodes) {
    if (budget.nodes <= 0) break;
    if (child.nodeType === Node.TEXT_NODE) {
      const value = child.nodeValue ?? "";
      if (value === "") continue;
      const clipped = value.slice(0, Math.max(0, budget.text));
      budget.text -= clipped.length;
      budget.nodes -= 1;
      into.appendChild(document.createTextNode(clipped));
      continue;
    }
    if (!(child instanceof Element)) continue;
    const tag = child.tagName.toUpperCase();
    if (DROP_WITH_CONTENT.has(tag)) continue;
    if (!ALLOWED_TAGS.has(tag) || depth >= MAX_DEPTH) {
      emitted += build(child, into, budget, depth + 1);
      continue;
    }
    const element = document.createElement(tag.toLowerCase());
    if (tag === "A") {
      const href = safeHref(child.getAttribute("href"));
      if (href !== null) element.setAttribute("href", href);
    }
    budget.nodes -= 1;
    emitted += 1;
    into.appendChild(element);
    emitted += build(child, element, budget, depth + 1);
  }
  return emitted;
}
__name(build, "build");
function safeHref(value) {
  if (value === null) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}
__name(safeHref, "safeHref");
const iconUrl = "" + new URL("icon-BkYaA-5j.png", import.meta.url).href;
const CARD_BACKGROUND = "color-mix(in srgb, var(--foreground) 6%, var(--background))";
const NOTES_MAX_HEIGHT = 420;
function UpdateWindow({ payload, onChoose }) {
  const { t } = useTranslation();
  const dialogRef = reactExports.useRef(null);
  const notesBoxRef = reactExports.useRef(null);
  const recovery = payload.action.kind === "recovery";
  const manual = payload.action.kind === "manual";
  const consequenceKey = consequenceKeyFor(payload.action.kind);
  const consequence = consequenceKey === null ? "" : t(consequenceKey);
  reactExports.useEffect(() => {
    dialogRef.current?.focus();
  }, []);
  reactExports.useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (dialog === null) return;
    let reported = 0;
    const report = /* @__PURE__ */ __name(() => {
      const height = Math.ceil(
        dialog.getBoundingClientRect().height + notesShortfall(notesBoxRef.current)
      );
      if (height <= 0 || height === reported) return;
      reported = height;
      window.maestriUpdate?.reportHeight(height);
    }, "report");
    report();
    const observer = new ResizeObserver(report);
    observer.observe(dialog);
    return () => observer.disconnect();
  }, [payload]);
  reactExports.useEffect(() => {
    const onKeyDown = /* @__PURE__ */ __name((event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      onChoose("later");
    }, "onKeyDown");
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onChoose]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref: dialogRef,
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "update-title",
      "aria-describedby": "update-consequence",
      tabIndex: -1,
      className: "flex max-h-[100dvh] w-full flex-col gap-4 p-6 outline-none",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: iconUrl,
              alt: "",
              "aria-hidden": "true",
              className: "size-12 shrink-0 rounded-[10px]"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 flex-col gap-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { id: "update-title", className: "text-[15px] font-semibold text-foreground", children: recovery ? t("update.recoveryTitle") : t("update.title", { version: payload.display }) }),
            recovery ? null : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] text-muted-foreground", children: t("update.current", { version: payload.current }) })
          ] })
        ] }),
        payload.action.kind === "recovery" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          RecoveryInstructions,
          {
            executablePath: payload.action.executablePath,
            backupPath: payload.action.backupPath
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(ReleaseNotes, { notes: payload.notes, boxRef: notesBoxRef }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 flex-col gap-2", children: [
          recovery ? null : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              id: "update-consequence",
              className: "text-[11px] leading-relaxed text-muted-foreground",
              children: consequence
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: /* @__PURE__ */ __name(() => onChoose("later"), "onClick"),
                className: "rounded-lg border px-3 py-1.5 text-[13px] text-foreground outline-none hover:bg-[var(--bg-hover)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                style: { borderColor: "var(--border)" },
                children: recovery ? t("update.close") : t("update.later")
              }
            ),
            recovery ? null : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: /* @__PURE__ */ __name(() => onChoose(manual ? "download" : "restart"), "onClick"),
                className: "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                style: { background: "var(--accent)", color: "var(--accent-foreground)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-3.5", "aria-hidden": "true" }),
                  manual ? t("update.download") : t("update.restart")
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
}
__name(UpdateWindow, "UpdateWindow");
function notesShortfall(box) {
  const scroller = box?.firstElementChild;
  if (box === null || !(scroller instanceof HTMLElement)) return 0;
  const border = scroller.offsetHeight - scroller.clientHeight;
  const wanted = Math.min(scroller.scrollHeight + border, NOTES_MAX_HEIGHT);
  return Math.max(0, wanted - box.offsetHeight);
}
__name(notesShortfall, "notesShortfall");
function RecoveryInstructions({
  executablePath,
  backupPath
}) {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      id: "update-consequence",
      role: "alert",
      tabIndex: 0,
      className: "flex min-h-0 flex-auto flex-col gap-3 overflow-y-auto rounded-lg border p-3 text-[12px] leading-relaxed text-foreground outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
      style: { borderColor: "var(--border)", background: CARD_BACKGROUND },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: t("update.recoveryBody") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: t("update.recoveryRename") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "select-text break-all rounded bg-black/5 px-2 py-1 dark:bg-white/5", children: backupPath })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: t("update.recoveryTo") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "select-text break-all rounded bg-black/5 px-2 py-1 dark:bg-white/5", children: executablePath })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: t("update.recoveryBeforeQuit") })
      ]
    }
  );
}
__name(RecoveryInstructions, "RecoveryInstructions");
function ReleaseNotes({
  notes,
  boxRef
}) {
  const { t } = useTranslation();
  const hostRef = reactExports.useRef(null);
  const parsed = reactExports.useMemo(() => {
    try {
      return parseNotes(notes);
    } catch {
      return { kind: "empty" };
    }
  }, [notes]);
  reactExports.useLayoutEffect(() => {
    const host = hostRef.current;
    if (host === null || parsed.kind !== "markup") return;
    host.replaceChildren(parsed.fragment);
    return () => host.replaceChildren();
  }, [parsed]);
  const label = t("update.notesLabel");
  if (parsed.kind === "empty") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Region, { label, boxRef, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] text-muted-foreground", children: t("update.notesEmpty") }) });
  }
  if (parsed.kind === "text") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Region, { label, boxRef, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "whitespace-pre-wrap text-[12.5px] leading-relaxed text-foreground", children: parsed.text }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Region, { label, boxRef, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: hostRef, className: "update-notes text-[12.5px] leading-relaxed text-foreground" }) });
}
__name(ReleaseNotes, "ReleaseNotes");
function Region({
  label,
  children,
  boxRef
}) {
  const scrollerRef = reactExports.useRef(null);
  const [moreBelow, setMoreBelow] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const scroller = scrollerRef.current;
    if (scroller === null) return;
    const sync = /* @__PURE__ */ __name(() => {
      const remaining = scroller.scrollHeight - scroller.clientHeight - scroller.scrollTop;
      setMoreBelow(remaining > 1);
    }, "sync");
    sync();
    scroller.addEventListener("scroll", sync, { passive: true });
    const observer = new ResizeObserver(sync);
    observer.observe(scroller);
    for (const child of scroller.children) observer.observe(child);
    return () => {
      scroller.removeEventListener("scroll", sync);
      observer.disconnect();
    };
  }, [children]);
  return (
    // The cap lives on this box and the scroller FILLS it, so the card has two
    // independent limits: it never grows past the cap, and it gives up height
    // freely when the window is too short for everything. It is the only part
    // of the dialog that flexes, which is what keeps the footer safe.
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        ref: boxRef,
        className: "relative flex min-h-0 flex-auto flex-col",
        style: { maxHeight: NOTES_MAX_HEIGHT },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              ref: scrollerRef,
              role: "region",
              "aria-label": label,
              tabIndex: 0,
              className: "min-h-0 flex-auto overflow-y-auto rounded-lg border p-3 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
              style: { borderColor: "var(--border)", background: CARD_BACKGROUND },
              onClick: /* @__PURE__ */ __name((event) => {
                const target = event.target;
                if (!(target instanceof Element)) return;
                const anchor = target.closest("a");
                if (anchor === null) return;
                event.preventDefault();
                const href = anchor.getAttribute("href");
                if (href !== null && href !== "") window.maestriUpdate?.openExternal(href);
              }, "onClick"),
              children
            }
          ),
          moreBelow ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "aria-hidden": "true",
              className: "pointer-events-none absolute inset-x-px bottom-px h-10 rounded-b-lg",
              style: { background: `linear-gradient(to bottom, transparent, ${CARD_BACKGROUND})` }
            }
          ) : null
        ]
      }
    )
  );
}
__name(Region, "Region");
function consequenceKeyFor(kind) {
  if (kind === "installerReady") return "update.consequence";
  if (kind === "installNow") return "update.installNowConsequence";
  if (kind === "portableReady") return "update.portableConsequence";
  if (kind === "manual") return "update.manualConsequence";
  return null;
}
__name(consequenceKeyFor, "consequenceKeyFor");
const container = document.getElementById("root");
if (!container) {
  throw new Error("Maestri update window: #root element not found in update.html");
}
const Root = /* @__PURE__ */ __name(() => {
  const [payload, setPayload] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const bridge = window.maestriUpdate;
    if (bridge === void 0) return;
    let cancelled = false;
    void bridge.payload().then((value) => {
      if (cancelled) return;
      document.documentElement.setAttribute("data-theme", value.theme);
      if (instance.language !== value.locale) void instance.changeLanguage(value.locale);
      setPayload(value);
    }).catch(() => {
      bridge.respond("later");
    });
    return () => {
      cancelled = true;
    };
  }, []);
  if (payload === null) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(UpdateWindow, { payload, onChoose: /* @__PURE__ */ __name((choice) => window.maestriUpdate?.respond(choice), "onChoose") });
}, "Root");
clientExports.createRoot(container).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(RootErrorBoundary, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Root, {}) }) })
);
