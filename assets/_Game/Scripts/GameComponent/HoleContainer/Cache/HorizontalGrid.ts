import { _decorator, CCFloat, Component, Node, tween, Vec3 } from 'cc';
import { Hole } from '../../Hole/Hole';
import { BoosterControll } from '../../../Booster/BoosterControll';
import { set } from '../../../../../../extensions/nvthan/@types/packages/scene/@types/cce/utils/lodash';
import { getGameSystem } from '../../../GameSystem';
const { ccclass, property } = _decorator;

@ccclass( 'HorizontalGrid' )
export class HorizontalGrid extends Component
{
    @property( CCFloat )
    private space: number = 5;
    @property( Node )
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
                //nếu chưa có trong listActiveChild thì thêm vào
                if ( this.listActiveChild.indexOf( child.node ) === -1 )
                {
                    this.listActiveChild.push( child.node );
                }
            }
        } );
    }

    public AddNewHole ( count: number ): Hole
    {
        if ( count <= 0 ) return null;
        let listchild = this.node.getComponentsInChildren( Hole );
        let listUnActiveChild: Hole[] = [];
        let hole: Hole = null;
        listchild.forEach( child => 
        {
            if ( child.node.active === false )
            {
                listUnActiveChild.push( child );
            }
        } );

        if ( listUnActiveChild.length > 0 )
        {
            hole = listUnActiveChild[ 0 ];
            this.listActiveChild.push( hole.node );
            this.RepositionHoleChange();
            if ( getGameSystem().BoosterControll && getGameSystem().BoosterControll.node && getGameSystem().BoosterControll.node.active )
            {
                getGameSystem().BoosterControll.HightlightBooster.StopHLBooster();
            }
            setTimeout( () =>
            {
                getGameSystem().BoosterControll.DrillAnimation( hole );

            }, 200 );
            //hole.node.active = true;
            return hole;
        }
        else
        {
            return null;
        }
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
                .to( 0.2, { position: new Vec3( firstLeftPos + i * this.space, 0, 0 ) } )
                .start();
        }
    }
}



