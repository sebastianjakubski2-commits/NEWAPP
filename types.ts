export interface Etap1 {
  wynik: number;
  zakonczono: boolean;
}

export interface Etap2 {
  aktualnyWezel: string;
  sumaPunktow: number;
  historiaWyborow: string[];
}

export interface Uczestnik {
  Token: string; // ID dokumentu
  Szkola: string;
  DopuszczonyDoEtapu2: boolean;
  Etap1: Etap1;
  Etap2: Etap2;
}
