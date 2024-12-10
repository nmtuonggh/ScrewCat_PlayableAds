import { _decorator, Component, Node } from 'cc';
import { BoxContainer } from './Controller/BoxContainer';
import { tween } from 'cc';
import { Vec3 } from 'cc';
import { Screw } from './GameComponent/Screw/Screw';
import { OutOfMove } from './OutOfMove';
import { GameManager } from './Manager/GameManager';
import { UILose } from './UI/UILose';
import { TestIQController } from './TestIQ/TestIQController';
import { CanvasScreenController } from './MultiScreen/CanvasScreenController';
import { getGameSystem } from './GameSystem';
const { ccclass, property } = _decorator;

@ccclass( 'UIController' )
export class UIController extends Component
{

    @property([CanvasScreenController])
    public canvasScreenController: CanvasScreenController[] = [];

    public onChangedScreen ( ): void
    {
        if(!getGameSystem().GameManager.lose) return;

        this.canvasScreenController.forEach(element => {  //UI Canvas
            element.uiCanvasScreen.setOutOfMoveUIStatus(false);
            element.uiCanvasScreen.setFailUIStatus(false);
            element.uiCanvasScreen.setLoseUIStatus(true);
        });
    }

    public ShowOutOfMove ( ): void
    {
        this.canvasScreenController.forEach(element => {
            element.uiCanvasScreen.setOutOfMoveUIStatus(true);
        });
    }
}


