import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/incidents")({
  head: () => ({ meta: [
    { title: "Incident Queue — SENTINEL" }, { name: "description", content: "Review the severity-sorted security incident queue." },
    { property: "og:title", content: "Incident Queue — SENTINEL" }, { property: "og:description", content: "Review the severity-sorted security incident queue." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ]}), component: IncidentsLayout,
});

function IncidentsLayout() { return <Outlet />; }