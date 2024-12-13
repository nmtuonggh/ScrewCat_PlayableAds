import { Button } from 'cc';
import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';

import { tween } from 'cc';
import { Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'UILose' )
export class UILose extends Component
{
    @property( Node )
    public loseUI: Node = null!;
    @property( Label )
    textIQ: Label = null;

    public setIQtext ( text: string ): void
    {
        this.textIQ.string = text;
    }

}


