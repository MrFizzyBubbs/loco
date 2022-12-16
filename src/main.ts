import { getTasks } from "grimoire-kolmafia";
import { Args } from "grimoire-kolmafia/dist/args";
import { myAdventures, myTurncount } from "kolmafia";
import { sinceKolmafiaRevision } from "libram";
import { Engine } from "./engine";
import { startTracking, stopTracking } from "./session";
import { locoQuest } from "./tasks";

export const args = Args.create("loco", "A script for automated adventuring in the crimbo train", {
  turns: Args.number({
    help: "The number of turns to run (use negative numbers for the number of turns remaining)",
    default: Infinity,
  }),
  // TODO make this a string arg so I don't have to remember what each choice does
  caboose: Args.number({
    help: "Option to choose in the caboose non-combat encounter.",
    options: [
      [1, "parts"],
      [2, "elves"],
      [3, "ping pong"],
    ],
    default: 1,
  }),
});

export const turncount = myTurncount();
export function completed(): boolean {
  return args.turns > 0
    ? myTurncount() - turncount >= args.turns || myAdventures() === 0
    : myAdventures() === -args.turns;
}

export function main(command?: string): void {
  Args.fill(args, command);
  if (args.help) {
    Args.showHelp(args);
    return;
  }

  sinceKolmafiaRevision(27001);
  startTracking();

  const tasks = getTasks([locoQuest()]);
  const engine = new Engine(tasks);

  try {
    engine.run();
  } finally {
    engine.destruct();
    stopTracking();
  }
}
