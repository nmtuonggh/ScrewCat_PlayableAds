import { _decorator, Component, Node } from 'cc';
import { BarController } from './GameComponent/Bar/BarController';
const { ccclass, property, executeInEditMode } = _decorator;


@ccclass( 'Tool' )
@executeInEditMode( true )
export class Tool extends Component
{
    @property( Boolean )
    public runSetCollider: boolean = false;
    @property( Boolean )
    public runSetCollider2: boolean = false;

    @property( BarController )
    public listBar: BarController[] = [];
    @property( BarController )
    public listBar2: BarController[] = [];
    @property( Node )
    barparent: Node = null;

    protected onLoad (): void
    {
        if ( this.runSetCollider )
        {
            this.listBar = this.barparent.getComponentsInChildren( BarController );
        }

    }

    protected start (): void
    {
        if ( this.runSetCollider )
        {
            this.setCollider();
        }

    }

    public setCollider (): void
    {
        for ( let i = 0; i < this.listBar.length; i++ ) 
        {
            const bar = this.listBar[ i ];
            bar.SetCollider();
            //bar.collider.threshold = 5;
        }
    }


    public run (): void
    {
        console.log( 'Tool run' );
    }
}

