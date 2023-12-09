import { type Secondary } from "./secondary";

export interface Player {
  name: string;
  army: string;
  secondaries: Secondary[];
  primaryScore: number;
  allegiance?: Allegiance;
  id?: string;
}

export type Allegiance = "Loyalist" | "Traitor";
