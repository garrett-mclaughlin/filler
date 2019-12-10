import { Tile } from './tile';

export interface Board {
    width: number;
    height: number;
    tiles: Tile[];
    availableColors: string[];
    disallowedColors: string[];
}
