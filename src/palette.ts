export type Palette = {
  name: string;
  type: 'light' | 'dark';
  base: {
    base3: string;
    base2: string;
    base1: string;
    base0: string;
    base00: string;
    base01: string;
    base02: string;
    base03: string;
  };
  accents: {
    red: string;
    green: string;
    yellow: string;
    blue: string;
    purple: string;
    aqua: string;
    orange: string;
    brown: string;
  };
};

export const GruvalizedLight: Palette = {
  name: "Gruvalized Light",
  type: 'light',
  base: {
    base3: "#FAF5E7",
    base2: "#F7F1DF",
    base1: "#E9E1BF",
    base0: "#D9D0AE",
    base00: "#B8AE8E",
    base01: "#8A8062",
    base02: "#6A6A6A",
    base03: "#1A1A1A",
  },
  accents: {
    red: "#CC241D",
    green: "#448C27",
    yellow: "#D79921",
    blue: "#4B83CD",
    purple: "#7A3E9D",
    aqua: "#689D6A",
    orange: "#D65D0E",
    brown: "#6F2F00",
  },
};

export const GruvalizedDark: Palette = {
  name: "Gruvalized Dark",
  type: 'dark',
  base: {
    base3: "#1D2021", // editor bg
    base2: "#282828", // panels / tabs bg
    base1: "#3C3836", // selection / hover
    base0: "#504945",
    base00: "#665C54",
    base01: "#7C6F64",
    base02: "#928374",
    base03: "#FBF1C7", // strong fg for dark
  },
  accents: {
    red: "#CC241D",
    green: "#98971A",
    yellow: "#D79921",
    blue: "#458588",
    purple: "#B16286",
    aqua: "#689D6A",
    orange: "#D65D0E",
    brown: "#A89984",
  },
};
