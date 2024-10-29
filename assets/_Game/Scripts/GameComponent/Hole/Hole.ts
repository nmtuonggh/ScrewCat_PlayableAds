import { _decorator, color, Component, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'Hole' )
export class Hole extends Component
{

    @property({type : [Sprite]})
    private sprite: Sprite;

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


