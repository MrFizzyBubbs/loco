import { visitUrl } from "kolmafia";

export function getElfGratitude(): number {
  const page = visitUrl("questlog.php?which=3");
  const match = page.match(/You earned (\d+) Elf Gratitude during Crimbo 2022./);
  return match ? Number(match[1]) : 0;
}
