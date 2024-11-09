import { _decorator, Component, Node } from 'cc';
import { BarController } from './GameComponent/Bar/BarController';
import { Screw } from './GameComponent/Screw/Screw';
const { ccclass, property, executeInEditMode } = _decorator;


@ccclass( 'Tool' )
@executeInEditMode( true )
export class Tool extends Component
{
    @property( Boolean )
    public runSetCollider: boolean = false;
    @property( Boolean )
    public setlayer: boolean = false;
    @property( Boolean )
    public setScrewToBar: boolean = false;

    @property( BarController )
    public listBar: BarController[] = [];
    @property( BarController )
    public listScrew: BarController[] = [];
    @property( Node )
    barparent: Node = null;

    protected onLoad (): void
    {
        this.listBar.length = 0;
        this.listScrew.length = 0;

        if ( this.runSetCollider || this.setScrewToBar)
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

        if ( this.setlayer )
        {
            this.setLayer();
        }

        if ( this.setScrewToBar )
        {
            this.SetScrewBar();
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

    public SetScrewBar (): void
    {
        for ( let i = 0; i < this.listBar.length; i++ ) 
        {
            const bar = this.listBar[ i ];
            bar.listScrews.length = 0;
            for( let j = 0; j < bar.screwCount; j++ )
            {
                const id = bar.idFirstScrew + j;
                //dyệt qua các child của parent của bar, nếu có node nào có tên là Screw_ + id thì gán vào listScrew
                const screw = bar.node.parent.getChildByName( "Screw_" + id );
                if ( screw.getComponent(Screw) )
                {
                    bar.listScrews.push( screw.getComponent( Screw ) );
                }
            }
            console.log( "Screw: ", bar.listScrews.length );

        }
        
    }
    
}

