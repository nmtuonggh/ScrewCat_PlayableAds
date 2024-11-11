import { _decorator, Component, Node } from 'cc';
import { Screw } from './Screw/Screw';
import { BarController } from './Bar/BarController';
const { ccclass, property } = _decorator;

@ccclass( 'GameLayer' )
export class GameLayer extends Component
{
    @property( Number )
    public layerOrder: number = 0;

    public screwCount: number = 0;

    public listScrew : Screw[] = [];

    public listBar: BarController[] = [];

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

    public InitDataLayer():void
    {
        this.listScrew = this.node.getComponentsInChildren(Screw);
        //this.listBar = this.node.getComponentsInChildren(BarController);
        this.screwCount = this.listScrew.length;
        
    }

    public RemoveScrew (): void
    {
        this.screwCount--;
    }

    public ActiveScrew (): void{
        for ( let i = 0; i < this.listScrew.length; i++ )
        {
            this.listScrew[i].node.active = true;
        }
    }

    public DeactiveScrew (): void{
        for ( let i = 0; i < this.listScrew.length; i++ )
        {
            this.listScrew[i].node.active = false;
        }
    }

    public SetPlayingBarLayer (): void
    {
        for ( let i = 0; i < this.listBar.length; i++ )
        {
            const bar = this.listBar[ i ];
            bar.ShowBar();
        }
    }

    public SetHidingBarLayer (): void
    {
        for ( let i = 0; i < this.listBar.length; i++ )
        {
            const bar = this.listBar[ i ];
            bar.HideBar();
        }
    }
}


