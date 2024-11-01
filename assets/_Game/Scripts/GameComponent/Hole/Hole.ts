import { _decorator, color, Component, Node, Sprite } from 'cc';
import { Box } from '../HoleContainer/Box/Box';
import { Screw } from '../Screw/Screw';
const { ccclass, property } = _decorator;

@ccclass( 'Hole' )
export class Hole extends Component
{

    @property({type : [Sprite]})
    private sprite: Sprite;
    
    public Box: Box = null;

    public isLinked: boolean = false;
    @property({type : Screw})
    public linkingScrew : Screw = null;


    public IsFree (): boolean 
    {
        console.log("Hole IsFree");
        return this !== null;
    }

    public SetColor(){
        this.sprite.color = color(255, 255, 255, 255);
    }
}


