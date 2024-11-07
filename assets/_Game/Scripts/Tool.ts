import { _decorator, Component, Node } from 'cc';
import { BarController } from './GameComponent/Bar/BarController';
const { ccclass, property, executeInEditMode } = _decorator;


@ccclass( 'Tool' )
@executeInEditMode( true )
export class Tool extends Component
{   
    @property(Boolean)
    public isDebug: boolean = false;

    @property( BarController )
    public listBar: BarController[] = [];
    @property( Node )
    barparent: Node = null;

    protected onLoad (): void
    {
        if (this.isDebug === false) return;
        this.listBar = this.barparent.getComponentsInChildren( BarController );
    }

    protected start (): void
    {
        if (this.isDebug === false) return;
        for ( let i = 0; i < this.listBar.length; i++ ) 
        {
            const bar = this.listBar[ i ];
            bar.SetCollider();
            bar.collider.threshold = 5;
        }
    }

    public run (): void
    {
        console.log( 'Tool run' );
    }
}

