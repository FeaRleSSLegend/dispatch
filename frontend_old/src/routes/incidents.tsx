import { Outlet, createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/incidents")({
  component: IncidentsLayout,
})

function IncidentsLayout() {
  return <Outlet />
}