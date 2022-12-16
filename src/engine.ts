import { Engine as BaseEngine, Task } from "grimoire-kolmafia";
import { $effect, get, have, PropertiesManager } from "libram";

export class Engine extends BaseEngine<never, Task> {
  post(task: Task): void {
    super.post(task);
    if (have($effect`Beaten Up`) || !get("_lastCombatWon")) throw "Fight was lost; stop";
  }

  // initPropertiesManager(manager: PropertiesManager): void {
  //   super.initPropertiesManager(manager);
  //   for (const choices of unsupportedChoices.values()) manager.setChoices(choices);
  //   const priority = args.priority as "elves" | "parts" | "pingpong";
  //   manager.setChoice(1486, { parts: 1, elves: 2, pingpong: 3 }[priority]);
  // }
}
