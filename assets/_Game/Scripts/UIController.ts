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
const { ccclass, property } = _decorator;

@ccclass( 'UIController' )
export class UIController extends Component
{

    @property([CanvasScreenController])
    public canvasScreenController: CanvasScreenController[] = [];

    protected static _instance: UIController = null;

    public static get Instance (): UIController
    {
        return this._instance;
    }

    protected override onLoad (): void
    {
        if ( UIController._instance === null )
        {
            UIController._instance = this;
        }
    }

    public onChangedScreen ( ): void
    {
        if(!GameManager.Instance.lose) return;

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


