import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'GameLayer' )
export class GameLayer extends Component
{
    @property( Number )
    public layerOrder: number = 0;

    public screwCount: number = 0;

    public getLayer (): number
    {
        return this.layerOrder;
    }

    public setLayer ( layer: number ): void
    {
        this.layerOrder = layer;
    }

    public ActiveLayer (): void
    {
        this.node.active = true;
    }

    public DeactiveLayer (): void
    {
        this.node.active = false;
    }

    public RemoveScrew (): void
    {
        this.screwCount--;
    }
}


