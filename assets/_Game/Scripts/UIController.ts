import { _decorator, Component, Node } from 'cc';
import { BoxContainer } from './Controller/BoxContainer';
import { tween } from 'cc';
import { Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIController')
export class UIController extends Component {

    @property(Node)
    public boxContainer: Node = null;
    @property(Node)
    public GamePlayHolder: Node = null;
    @property(Node)
    public IconGame : Node = null;
    @property(Node)
    public StarCollection : Node = null;
    @property(Node)
    public FailUI : Node = null;


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

    public onPortrait(): void 
    {
        this.boxContainer.setPosition(0, 910, 0);
        this.GamePlayHolder.setPosition(0, 0, 0);
        this.IconGame.setPosition(-1000, -140, 0);
        this.StarCollection.setPosition(390, 560, 0);
        
    }

    public onLandscape(): void 
    {
        this.boxContainer.setPosition(-370, 910, 0);
        this.GamePlayHolder.setPosition(430, 0, 0);
        this.IconGame.setPosition(-430, -140, 0);
        this.StarCollection.setPosition(550, 700, 0);
        
    }

    public TweenFail():void{
        this.FailUI.active = true;
        tween(this.FailUI)
        .to(0.5, {scale: new Vec3(1.5, 1.5, 1)})
        .start();
    }
}


