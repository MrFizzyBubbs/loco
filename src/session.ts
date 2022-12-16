/* eslint-disable libram/verify-constants */
import { myTurncount, print } from "kolmafia";
import { $item, Session } from "libram";
import { getElfGratitude } from "./crimbo";
import { turncount } from "./main";

let sessionStart: Session;
let initialGratitude: number;

export function startTracking(): void {
  sessionStart = Session.current();
  initialGratitude = getElfGratitude();
}

export function numberWithCommas(x: number): string {
  const str = x.toString();
  if (str.includes(".")) return x.toFixed(2);
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function stopTracking(): void {
  const sessionResults = Session.current().diff(sessionStart);
  const gratitude = getElfGratitude() - initialGratitude;
  // TODO track ping pong skill
  const turns = myTurncount() - turncount;

  const trainbotItems = [
    $item`pile of Trainbot parts`,
    $item`Trainbot circuitry`,
    $item`Trainbot harness`,
    $item`Trainbot linkages`,
    $item`Trainbot optics`,
    $item`Trainbot plating`,
    $item`Trainbot servomotors`,
    $item`Trainbot tubing`,
  ];
  const pingpongItems = [$item`ping-pong paddle`, $item`ping-pong ball`];

  print(`This run of loco you spent ${turns} adventures and generated`, "blue");
  for (const item of [...trainbotItems, ...pingpongItems]) {
    print(`* ${numberWithCommas(sessionResults.items.get(item) ?? 0)} ${item}`, "blue");
  }
  print(`* ${numberWithCommas(gratitude)} elf gratitude`, "blue");
  print(`* ${numberWithCommas(sessionResults.meat)} meat`, "blue");
  print("That's ??? MPA!", "blue");
}
