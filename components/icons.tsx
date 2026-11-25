import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps) {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

export function DropletIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3.2c3.2 3.4 6 6.5 6 10a6 6 0 1 1-12 0c0-3.5 2.8-6.6 6-10Z" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.4-3.4" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3 5 6v5.5c0 4.6 3 7.9 7 9.5 4-1.6 7-4.9 7-9.5V6l-7-3Z" />
      <path d="m9.2 12 2 2 3.6-4" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m5 12.5 4.4 4.5L19 7.5" />
    </svg>
  );
}

export function AlertIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 4.5 3.4 19h17.2L12 4.5Z" />
      <path d="M12 10v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3.5 19.5c.6-3 2.9-4.7 5.5-4.7s4.9 1.7 5.5 4.7" />
      <path d="M16 5.6a3.2 3.2 0 0 1 0 6.2" />
      <path d="M17.4 14.9c1.7.5 2.8 2 3.1 4.1" />
    </svg>
  );
}

export function HeartPulseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M20.2 6.8a4.6 4.6 0 0 0-6.5 0L12 8.5l-1.7-1.7a4.6 4.6 0 1 0-6.5 6.5L12 21l8.2-7.7a4.6 4.6 0 0 0 0-6.5Z" />
      <path d="M4.5 12h4l1.5-2.5 2 5L14 12h5.5" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4.5 12h15" />
      <path d="m13.5 6 6 6-6 6" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="9" y="9" width="11" height="11" rx="2.5" />
      <path d="M15 5.5A2.5 2.5 0 0 0 12.5 3H6a2.5 2.5 0 0 0-2.5 2.5v7A2.5 2.5 0 0 0 6 15" />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8.5 10.5V8a3.5 3.5 0 1 1 7 0v2.5" />
    </svg>
  );
}

export function SparkIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6L4.8 10.7 10.3 9 12 3.5Z" />
    </svg>
  );
}
