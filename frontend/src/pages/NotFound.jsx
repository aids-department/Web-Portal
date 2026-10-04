import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "../components/ui/Reveal";

export default function NotFound() {
  return (
    <Reveal className="mx-auto flex max-w-lg flex-col items-center gap-4 py-24 text-center">
      <span className="font-mono text-7xl font-medium tracking-tight text-shimmer sm:text-8xl">404</span>
      <h2 className="text-2xl font-semibold tracking-tight">
        <span className="text-gradient">Page not found</span>
      </h2>
      <p className="text-fg-muted">Sorry, the page you requested doesn't exist.</p>
      <Link to="/" className="btn-secondary mt-2">
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>
    </Reveal>
  );
}
