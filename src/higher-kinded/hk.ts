// Inspiration: https://github.com/sinclairzx81/parsebox

export interface HK {
  input: unknown;
  output: unknown;
}

export type ApplyHK<I, H extends HK> = (H & { input: I })["output"];
