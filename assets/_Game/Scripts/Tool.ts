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
    public setlayer: boolean = false;

    @property( BarController )
    public listBar: BarController[] = [];
    @property( BarController )
    public listScrew: BarController[] = [];
    @property( Node )
    barparent: Node = null;

    protected onLoad (): void
    {
        //this.listBar.length = 0;
        
        if ( this.runSetCollider )
        {
            this.listBar = this.barparent.getComponentsInChildren( BarController );
        }

        if ( this.setlayer )
        {
            this.listBar = this.barparent.getComponentsInChildren( BarController );
            this.listScrew = this.barparent.getComponentsInChildren( BarController );
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
            bar.modelCollider.destroy();
        }
    }

    public setLayer (): void
    {
        for ( let i = 0; i < this.listBar.length; i++ ) 
        {
            const bar = this.listBar[ i ];
            bar.node.layer = 10;
        }

        for ( let i = 0; i < this.listScrew.length; i++ ) 
        {
            const screw = this.listScrew[ i ];
            screw.node.layer = 11;
        }
    }
    
}

