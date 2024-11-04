import { _decorator, CCFloat, Component, Node, tween, Vec3 } from 'cc';
import { Hole } from '../../Hole/Hole';
const { ccclass, property } = _decorator;

@ccclass( 'HorizontalGrid' )
export class HorizontalGrid extends Component
{
    @property( CCFloat )
    private space: number = 5;
    @property(Node)
    private listActiveChild: Node[] = [];

    protected onLoad (): void
    {
    }

    GetActiveChild (): void
    {
        let listchild = this.node.getComponentsInChildren( Hole );
        listchild.forEach( child => 
        {
            if ( child.node.active === true )
            {
                this.listActiveChild.push( child.node );
            }
        } );
    }

    public RepositionHoleChange (): void
    {
        this.GetActiveChild();
        const activeChildCount = this.listActiveChild.length;
        var firstLeftPos = this.node.position.x - ( activeChildCount - 1 ) * this.space / 2;

        for ( let i = 0; i < activeChildCount; i++ )
        {
            const hole = this.listActiveChild[ i ];

            tween(hole).stop();
            tween(hole)
                .to( 0.2, { position: new Vec3( firstLeftPos + i * this.space, 0, 0 ) } )
                .start();
        }
    }
}



