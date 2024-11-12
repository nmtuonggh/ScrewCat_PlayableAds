import { _decorator, Component, Node } from 'cc';
import { Screw } from './Screw/Screw';
import { BarController } from './Bar/BarController';
import { GameLayerComponent } from './GameLayerComponent';
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

    public UnActiveLayer (): void
    {
        this.node.active = false;
    }

    public InitDataLayer():void
    {
        this.listScrew = this.node.getComponentsInChildren(Screw);
        //this.listBar = this.node.getComponentsInChildren(GameLayerComponent) as BarController[];
        this.screwCount = this.listScrew.length;
        
    }

    public RemoveScrew (): void
    {
        this.screwCount--;
    }

    public ShowScrew (): void{
        for ( let i = 0; i < this.listScrew.length; i++ )
        {
            this.listScrew[i].Show();
        }
    }

    public HideScrew (): void{
        for ( let i = 0; i < this.listScrew.length; i++ )
        {
            this.listScrew[i].Hide();
        }
    }

    public SetNormalSpriteBarInLayer (): void
    {
        for ( let i = 0; i < this.listBar.length; i++ )
        {
            const bar = this.listBar[ i ];
            bar.ShowBar();
        }
    }

    public SetHideSpriteBar (): void
    {
        for ( let i = 0; i < this.listBar.length; i++ )
        {
            const bar = this.listBar[ i ];
            bar.HideBar();
        }
    }

    public SetKinematicBarLayer (): void
    {
        for ( let i = 0; i < this.listBar.length; i++ )
        {
            const bar = this.listBar[ i ];
            bar.barPhysic.SetKinematic();
        }
    }

    public SetDynamicBarLayer (): void
    {
        for ( let i = 0; i < this.listBar.length; i++ )
        {
            const bar = this.listBar[ i ];
            bar.barPhysic.SetDynamic();
        }
    }
}


