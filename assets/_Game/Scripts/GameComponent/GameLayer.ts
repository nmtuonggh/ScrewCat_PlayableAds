import { _decorator, Component, Node } from 'cc';
import { Screw } from './Screw/Screw';
import { BarController } from './Bar/BarController';

const { ccclass, property } = _decorator;

@ccclass( 'GameLayer' )
export class GameLayer extends Component
{
    public screwCount: number = 0;

    public listScrew : Screw[] = [];

    public listBar: BarController[] = [];

    public activeLayer (): void
    {
        this.node.active = true;
    }

    public unActiveLayer (): void
    {
        //this.node.active = false;
    }

    public initDataLayer():void
    {
        this.listScrew = this.node.getComponentsInChildren(Screw);
        this.listBar = this.node.getComponentsInChildren(BarController);
        this.screwCount = this.listScrew.length;
        
    }

    public removeScrew (): void
    {
        this.screwCount--;
    }

    public showScrew (): void{
        for ( let i = 0; i < this.listScrew.length; i++ )
        {
            this.listScrew[i].show();
        }
    }

    public hideScrew (): void{
        for ( let i = 0; i < this.listScrew.length; i++ )
        {
            this.listScrew[i].hide();
        }
    }

    public setNormalSpriteBarInLayer (): void
    {
        for ( let i = 0; i < this.listBar.length; i++ )
        {
            const bar = this.listBar[ i ];
            bar.showBar();
        }
    }

    public setHideSpriteBar (): void
    {
        for ( let i = 0; i < this.listBar.length; i++ )
        {
            const bar = this.listBar[ i ];
            bar.hideBar();
        }
    }
}


