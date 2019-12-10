export interface Tile {
    id: number;
    ownedBy: number;
    color: string;
    canBeClicked: boolean;
    adjacentTiles: number[];
}
