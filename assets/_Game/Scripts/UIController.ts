import { _decorator, Component, Node } from 'cc';
import { BoxContainer } from './Controller/BoxContainer';
import { tween } from 'cc';
import { Vec3 } from 'cc';
import { Screw } from './GameComponent/Screw/Screw';
import { OutOfMove } from './OutOfMove';
import { GameManager } from './Manager/GameManager';
import { UILose } from './UI/UILose';
import { TestIQController } from './TestIQ/TestIQController';
const { ccclass, property } = _decorator;

@ccclass( 'UIController' )
export class UIController extends Component
{



    @property( [ Node ] )
    public fail: Node[] = [];
    @property( [ Node ] )
    public LoseUI: Node[] = [];
    @property( [ OutOfMove ] )
    public listOFM: OutOfMove[] = [];


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

    public TweenFail ( index: number ): void
    {
        this.fail[ index ].active = true;
        this.fail[ index ].scale = new Vec3( 5, 5, 0 );
        tween( this.fail[ index ] )
            .to( 0.5, { scale: new Vec3( 1.5, 1.5, 1 ) } )
            .start();
    }

    public onChangedScreen ( ): void
    {
        if(!GameManager.Instance.lose) return;
        //this.LoseUI[ index ].active = true;
        this.listOFM.forEach(element => {
            element.node.active = false;
        });
        this.fail.forEach(element => {
            element.active = false;
        });
        this.LoseUI.forEach(element => {
            element.active = true;
            element.getComponent(UILose).setIQtext(TestIQController.Instance.currentIQ.toString());
        });
    }

    public ShowOutOfMove ( ): void
    {
        console.log('ShowOutOfMove' + this.listOFM.length);
        this.listOFM.forEach(element => {
            element.node.active = true;
        });
    }
}


