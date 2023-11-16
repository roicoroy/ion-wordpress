import { Injectable } from '@angular/core';
import Phaser from "phaser";

@Injectable({
  providedIn: 'root'
})
export class ScreenSizeService extends Phaser.Scene {
  canvasEl!: HTMLElement | null;
  eventEmitter = new Phaser.Events.EventEmitter();
  constructor(

  ) {
    super('config');
  }

  resizeGameContainer(game: Phaser.Game, canvasEl: HTMLCanvasElement | any) {
    // let winW = window.innerWidth / window.devicePixelRatio;
    // let winH = window.innerHeight / window.devicePixelRatio;
    // const scaleRatio = window.devicePixelRatio / 3;
    // console.log(window.devicePixelRatio);
    // let breakpoints = [
    //   { scrW: 390, gamW: 390 },
    //   { scrW: 390, gamW: 390 },
    // ];
    // let currentBreakpoint: any = null;
    // let newViewPortW = 0;
    // let newViewPortH = 0;

    // for (let i = 0; i < breakpoints.length; i++) {
    //   currentBreakpoint = breakpoints[i];

    //   if (winW < currentBreakpoint.scrW) {
    //     break;
    //   }
    // }
    // newViewPortW = currentBreakpoint.gamW;
    // newViewPortH = currentBreakpoint.gamW * (winH / winW);

    // canvasEl.style.width = `${newViewPortW}px`;
    // canvasEl.style.height = `${newViewPortH}px`;  
    // // game.canvas.style.width = `${newViewPortW}px`
    // // game.canvas.style.height = `${newViewPortH}px`;

    // game.scale.resize(newViewPortW, newViewPortH);
    // game.scale.setGameSize(newViewPortW, newViewPortH);

    // this.physics.world.setBounds(0, 0, window.innerWidth, window.innerHeight);
    // game.canvas.style.width = window.innerWidth + 'px';
    // game.canvas.style.height = window.innerHeight + 'px';

    this.resize(game)

    this.eventEmitter.emit('screenResized');
  }

  resize(game: Phaser.Game) {

    const canvas: any = game?.canvas, width = window.innerWidth, height = window.innerHeight;
    const wratio: any = width / height, ratio = canvas?.width / canvas?.height;

    if (wratio < ratio) {
      const percentageHeigh = height / 100 * 20;
      const tabletHeight = height - percentageHeigh;

      canvas.style.width = width + "px";
      canvas.style.height = (width / ratio / 1.09) + "px";
      // game.scale.setGameSize(width, (width / ratio / 1.01)).getParentBounds();

    } else {
      const percentageHeigh = height / 100 * 20;
      const tabletHeight = height - percentageHeigh;
      canvas.style.width = (height * ratio) + "px";
      canvas.style.height = tabletHeight + "px";
      // game.scale.setGameSize(height * ratio, tabletHeight).getParentBounds();
    }
  }
}
// https://www.stephengarside.co.uk/blog/scaling-phaser-3-game-screens-easy-example/

