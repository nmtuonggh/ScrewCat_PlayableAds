import { tween } from 'cc';
import { CCString } from 'cc';
import { Vec3 } from 'cc';
import { CCFloat } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { BoxSlot } from '../GameComponent/HoleContainer/Box/BoxSlot';
const { ccclass, property } = _decorator;

@ccclass( 'GridUI' )
export class GridUI extends Component
{
    @property( CCFloat )
    private space: number = 5;
    @property( Node )
    private listActiveChild: Node[] = [];
    @property(CCString)
    gridComponent: string = null;

    protected onLoad (): void
    {
        this.RepositionHoleChange();
    }

    GetActiveChild (): void
    {
        let listchild = this.node.getComponentsInChildren(BoxSlot );
        listchild.forEach( child => 
        {
            if ( child.node.active === true )
            {
                //nếu chưa có trong listActiveChild thì thêm vào
                if ( this.listActiveChild.indexOf( child.node ) === -1 )
                {
                    this.listActiveChild.push( child.node );
                }
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

            tween( hole ).stop();
            tween( hole )
                .to( 0, { position: new Vec3( firstLeftPos + i * this.space, 0, 0 ) } )
                .start();
        }
    }
}


