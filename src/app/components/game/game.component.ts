import { Component, OnInit } from '@angular/core';
import { Board } from 'src/app/models/board';
import { Tile } from 'src/app/models/tile';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

    board: Board = <Board>{};
    colors: string[] = ['red', 'yellow', 'blue', 'green', 'indigo', 'black'];
    currentTurn = 1;
    player1color: string = '';
    player2color: string = '';

  constructor() { }

  ngOnInit() {
    this.generateRandomBoard();
  }

  generateRandomBoard() {
    this.board.width = 8;
    this.board.height = 7;
    this.board.tiles = [];
    for (let i = 0; i < this.board.width * this.board.height; i++) {
        let tile: Tile = {
            adjacentTiles: this.getAdjacent(i),
            canBeClicked: false,
            ownedBy: 0,
            color: '',
            id: i
        }
        this.board.tiles.push(tile);
    }
    for (let i = 0; i < this.board.width * this.board.height; i++) {
      let excludedColors: string[] = this.board.tiles[i].adjacentTiles.map(tileId => this.board.tiles[tileId].color);
      if (i === this.board.height * this.board.width - this.board.width) {
          excludedColors.push(this.board.tiles[this.board.width - 1].color);
          this.board.tiles[i].ownedBy = 1;
          this.board.tiles[this.board.width - 1].ownedBy = 2;
      }
      if (i === 2 * this.board.width - 1) excludedColors.push(this.board.tiles[this.board.width - 2].color);
      if (i === this.board.height * this.board.width - this.board.width + 1) excludedColors.push(this.board.tiles[this.board.width * this.board.height - 2 * this.board.width].color);
      this.board.tiles[i].color = this.randomColor(excludedColors);
    }
    this.player1color = this.board.tiles[this.board.height * this.board.width - this.board.width].color;
    this.player2color = this.board.tiles[this.board.width - 1].color;
  }

  private getAdjacent(i: number): number[] {
    const boardWidth = this.board.width;
    const boardHeight = this.board.height;
    const widthModLimit = this.board.width - 1;
    let adjacents: number[] = [];
    // left
    if ((i - 1) % boardWidth < widthModLimit && (i - 1) >= 0) adjacents.push(i - 1);
    // top
    if (i - boardWidth >= 0) adjacents.push(i - boardWidth);
    // right
    if ((i + 1) % boardWidth > 0 && (i + 1) < (boardWidth * boardHeight)) adjacents.push(i + 1);
    // bottom
    if (i + boardWidth < (boardWidth * boardHeight)) adjacents.push(i + boardWidth);
    return adjacents;
  }

  private randomColor(exceptions: string[] = []): string {
    let availableColors: string[] = cloneDeep(this.colors);
    availableColors = availableColors.filter(color => !exceptions.includes(color));
    return availableColors[Math.floor(Math.random() * availableColors.length)];
  }

  private toggleColor(color) {
      if (color === this.player1color || color === this.player2color) return;
      this.board.tiles.forEach(tile => {
          if (tile.ownedBy === this.currentTurn) {
              tile.color = color;
              tile.adjacentTiles.forEach(newTile => {
                  if (this.board.tiles[newTile].color === color && this.board.tiles[newTile].ownedBy === 0) {
                      this.board.tiles[newTile].ownedBy = this.currentTurn;
                  }
              })
          }
      });
      this.currentTurn = this.currentTurn === 1 ? 2 : 1;
      if (this.currentTurn === 1) {
          this.player1color = color;
      } else {
          this.player2color = color;
      }
  }

  private checkEndGameState(): boolean {
      return !this.board.tiles.some(tile => tile.ownedBy === 0);
  }

}
