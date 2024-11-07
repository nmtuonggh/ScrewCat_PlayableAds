import { _decorator, color, Component, Node, Sprite } from 'cc';
import { Box } from '../HoleContainer/Box/Box';
import { Screw } from '../Screw/Screw';
import { tween } from 'cc';
import { Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'Hole' )
export class Hole extends Component
{

    @property({type : [Sprite]})
    private sprite: Sprite;
    @property(Node)
    warning: Node = null;

    public Box: Box = null;

    public isLinked: boolean = false;
    @property({type : Screw})
    public linkingScrew : Screw = null;


    public IsFree (): boolean 
    {
        console.log("Hole IsFree");
        return this !== null;
    }

    public ShowWarning()
    {
        tween (this.warning)
        .to(.75, {scale: new Vec3(1.3,1.3,1.3)})
        .to(.75, {scale: new Vec3(0.3,0.3,0.3)})
        .start();
    }
}


