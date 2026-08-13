"use client";

import Image from "next/image";
import type { AuthUser } from "@/app/lib/auth";
import { getUserAvatarSrc } from "@/app/lib/userAvatar";

export default function UserAvatar({
  user,
  size = 36,
  className = "",
}: {
  user?: Partial<AuthUser> | null;
  size?: number;
  className?: string;
}) {
  const src = getUserAvatarSrc(user);

  return (
    <span
      className={`relative inline-flex shrink-0 overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <Image
        src={src}
        alt=""
        fill
        sizes={`${size}px`}
        className="object-cover"
      />
    </span>
  );
}