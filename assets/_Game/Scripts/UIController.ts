import { _decorator, Component, Node } from 'cc';
import { BoxContainer } from './Controller/BoxContainer';
import { tween } from 'cc';
import { Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIController')
export class UIController extends Component {

    
    @property(Node)
    public FailUI : Node = null;
    @property(Node)
    public CanvasList : Node[] = [];

    private canvasIndex : number = 0;


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
        
    }

    public onLandscape(): void 
    {
        
    }

    public TweenFail():void{
        this.FailUI.active = true;
        tween(this.FailUI)
        .to(0.5, {scale: new Vec3(1.5, 1.5, 1)})
        .start();
    }
}


