import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'Hole' )
export class Hole extends Component
{

    public IsFree (): boolean 
    {
        return this.node !== null;
    }
}


