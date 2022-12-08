import { type Army } from "./../data/armies";
import { type Secondary } from "./secondary";

export interface Player {
  name: string;
  army: Army;
  secondaries: Secondary[];
  primaryScore: number;
}
