export function AvatarName(avatar: string) {
  return avatar
    ?.split(" ")
    .filter((word: string[] | string) => word.length > 0)
    .slice(0, 2)
    .map((word: string[] | string) => word[0]?.toUpperCase())
    .join("");
}
