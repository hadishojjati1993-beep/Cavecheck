export type Marketplace = {
  id:
    | "amazon"
    | "ebay"
    | "zalando"
    | "decathlon"
    | "asos"
    | "nike"
    | "adidas"
    | "puma"
    | "footlocker"
    | "jd"
    | "zappos"
    | "ssense"
    | "farfetch"
    | "goat"
    | "stockx"
    | "more";
  name: string;
};

export const MARKETPLACES: Marketplace[] = [
  { id: "amazon", name: "Amazon" },
  { id: "zalando", name: "Zalando" },
  { id: "ebay", name: "eBay" },
  { id: "decathlon", name: "Decathlon" },

  { id: "asos", name: "ASOS" },
  { id: "zappos", name: "Zappos" },
  { id: "footlocker", name: "Foot Locker" },
  { id: "jd", name: "JD Sports" },

  { id: "nike", name: "Nike" },
  { id: "adidas", name: "adidas" },
  { id: "puma", name: "PUMA" },

  { id: "farfetch", name: "FARFETCH" },
  { id: "ssense", name: "SSENSE" },

  { id: "stockx", name: "StockX" },
  { id: "goat", name: "GOAT" },

  { id: "more", name: "More stores" },
];