import type { AuthUser } from "@/app/lib/auth";

/* =========================================================
   AVATAR THEMES
========================================================= */

const avatarPool = [
  {
    src: "/avatar/bg-avatar-1.svg",

    heroIcon: "/avatar/bg-avatar-1-2.svg",

    gradient:
      "linear-gradient( 90deg, #dc9569 0%, #d28361 25%, #c46f59 50%, #ba5b50 75%, #ae4949 100% )",
  },

  {
    src: "/avatar/bg-avatar-2.svg",

    heroIcon: "/avatar/bg-avatar-2-2.svg",

    gradient:
      "linear-gradient( 90deg, #263278 0%, #2d418d 25%, #314ea0 50%, #375cb5 75%, #3d6bc9 100%);",
  },

  {
    src: "/avatar/bg-avatar-3.svg",

    heroIcon: "/avatar/bg-avatar-3-2.svg",

    gradient:
      "linear-gradient( 90deg, #ecc70f 0%, #ecb80c 25%, #eca407 50%, #ec9203 75%, #ec8200 100%)",
  },

  {
    src: "/avatar/bg-avatar-4.svg",

    heroIcon: "/avatar/bg-avatar-4-2.svg",

    gradient:
      "linear-gradient( 90deg, #c4b788 0%, #a3956c 25%, #80704d 50%, #5d4d30 75%, #3c2a14 100%)",
  },
] as const;

/* =========================================================
   HASH
========================================================= */

function hashSeed(value: string) {
  let hash = 0;

  for (let i = 0; i < value.length; i += 1) {
    hash =
      (hash * 31 + value.charCodeAt(i)) >>> 0;
  }

  return hash;
}

/* =========================================================
   USER SEED
========================================================= */

function getUserSeed(
  user?: Partial<AuthUser> | null
) {
  return String(
    user?.id ||
      user?.email ||
      user?.name ||
      "bangalicon-user"
  )
    .trim()
    .toLowerCase();
}

/* =========================================================
   AVATAR INDEX
========================================================= */

export function getUserAvatarIndex(
  user?: Partial<AuthUser> | null
) {
  const seed = getUserSeed(user);

  return hashSeed(seed) % avatarPool.length;
}

/* =========================================================
   AVATAR IMAGE
========================================================= */

export function getUserAvatarSrc(
  user?: Partial<AuthUser> | null
) {
  const index = getUserAvatarIndex(user);

  return avatarPool[index].src;
}

/* =========================================================
   HERO ICON
========================================================= */

export function getUserAvatarHeroIcon(
  user?: Partial<AuthUser> | null
) {
  const index = getUserAvatarIndex(user);

  return avatarPool[index].heroIcon;
}

/* =========================================================
   BACKGROUND GRADIENT
========================================================= */

export function getUserAvatarGradient(
  user?: Partial<AuthUser> | null
) {
  const index = getUserAvatarIndex(user);

  return avatarPool[index].gradient;
}

/* =========================================================
   COMPLETE THEME
========================================================= */

export function getUserAvatarTheme(
  user?: Partial<AuthUser> | null
) {
  const index = getUserAvatarIndex(user);

  return {
    index,
    ...avatarPool[index],
  };
}

/* =========================================================
   EXPORT ALL THEMES
========================================================= */

export const USER_AVATAR_THEMES = avatarPool;