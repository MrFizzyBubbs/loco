import { CombatStrategy, Quest, Task } from "grimoire-kolmafia";
import {
  $effect,
  $familiar,
  $item,
  $location,
  $skill,
  get,
  have,
  Macro,
  ReagnimatedGnome,
  SongBoom,
} from "libram";
import {
  cliExecute,
  descToItem,
  getWorkshed,
  handlingChoice,
  lastChoice,
  runChoice,
  toSkill,
  totalTurnsPlayed,
  visitUrl,
} from "kolmafia";
import { args, completed } from "./main";

export function locoQuest(): Quest<Task> {
  return {
    name: "Loco",
    tasks: [
      {
        name: "Kgnee",
        ready: () => have($familiar`Reagnimated Gnome`),
        completed: () => have($item`gnomish housemaid's kgnee`),
        do: () => ReagnimatedGnome.choosePart("kgnee"),
        outfit: { familiar: $familiar`Reagnimated Gnome` },
        limit: { tries: 1 },
      },
      {
        name: "SongBoom",
        ready: () => SongBoom.have() && SongBoom.songChangesLeft() > 0,
        completed: () => SongBoom.song() === "Food Vibrations",
        do: () => SongBoom.setSong("Food Vibrations"),
        limit: { tries: 1 },
      },
      {
        name: "Cosplay Saber",
        ready: () => have($item`Fourth of May Cosplay Saber`),
        completed: () => get("_saberMod") !== 0,
        do: () => cliExecute("saber familiar"),
        limit: { tries: 1 },
      },
      {
        name: "Caboose",
        completed: () => completed(),
        do: $location`Crimbo Train (Caboose)`,
        post: getExtros,
        outfit: {
          weapon: $item`Fourth of May Cosplay Saber`,
          acc1: $item`mafia thumb ring`,
          acc2: $item`lucky gold ring`,
          familiar: $familiar`Reagnimated Gnome`,
          famequip: $item`gnomish housemaid's kgnee`,
          modifier: "familiar weight",
        },
        effects: () =>
          [$effect`Blood Bond`, $effect`Empathy`, $effect`Leash of Linguini`].filter((effect) =>
            have(toSkill(effect))
          ),
        combat: new CombatStrategy().autoattack(
          Macro.trySkill($skill`Micrometeorite`)
            .tryItem($item`Time-Spinner`)
            .trySkill($skill`Sing Along`)
            .attack()
            .repeat()
        ),
      },
    ],
  };
}

function getExtros(): void {
  if (getWorkshed() !== $item`cold medicine cabinet`) return;
  if (get("_coldMedicineConsults") >= 5 || get("_nextColdMedicineConsult") > totalTurnsPlayed()) {
    return;
  }
  const options = visitUrl("campground.php?action=workshed");
  let match;
  const regexp = /descitem\((\d+)\)/g;
  while ((match = regexp.exec(options)) !== null) {
    const item = descToItem(match[1]);
    if (item === $item`Extrovermectin™`) {
      visitUrl("campground.php?action=workshed");
      runChoice(5);
      return;
    }
  }
}
