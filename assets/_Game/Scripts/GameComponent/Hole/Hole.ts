import { _decorator, color, Component, Node, Sprite } from 'cc';
import { Box } from '../HoleContainer/Box/Box';
const { ccclass, property } = _decorator;

@ccclass( 'Hole' )
export class Hole extends Component
{

    @property({type : [Sprite]})
    private sprite: Sprite;
    @property({type : Box})
    public Box: Box = null;

    public isLinked: boolean = false;


    public IsFree (): boolean 
    {
        console.log("Hole IsFree");
        return this !== null;
    }

    public SetColor(){
        this.sprite.color = color(255, 255, 255, 255);
    }
}


