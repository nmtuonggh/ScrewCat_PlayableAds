import { _decorator, Collider2D, HingeJoint2D, Node, PhysicsSystem2D, Rect, tween, Vec2, Vec3 } from 'cc';
import { GameLayerComponent } from '../GameLayerComponent';
import { eColorType } from '../../GameConfig/GameColorConfig';
import { Hole } from '../Hole/Hole';
import { GameConfig } from '../../GameConfig/GameConfig';
import { GameLayerMaskConfig } from '../../GameConfig/GameLayerMaskConfig';
import { ScrewRenderer } from './ScrewRenderer';
const { ccclass, property } = _decorator;

@ccclass( 'Screw' )
export class Screw extends GameLayerComponent
{

    @property( { type: HingeJoint2D } )
    public hingeJoint: HingeJoint2D = null;

    private screwRenderer: ScrewRenderer = null;
    private linkingHole: Hole = null;
    //#region Encapsulation



    //#endregion

    protected onLoad (): void
    {
        this.screwRenderer = this.getComponent( ScrewRenderer );
    }

    //#region CheckMove
    public CheckMove (): void
    {
        if ( this.IsBlocked() === true )
        {
            console.log( "Is blocked" );
            return;
        }

        if ( this.CheckMoveBox() )
        {
            //console.log("Can move to box");
        }
    }

    public CheckMoveBox (): boolean
    {
        let freeBox = this.GameLogic.GetFreeHoleBox( this.screwRenderer.ColorType );
        if ( freeBox !== null )
        {
            this.MoveToBoxSlot( freeBox );
            return true;
        }

        return false;
    }

    private cachedBarLayer: Collider2D[] = [];

    private IsBlocked (): boolean
    {
        this.cachedBarLayer = [];

        const barLayer = GameLayerMaskConfig.BAR_LAYER_MASK;
        const screwPosition = this.node.getWorldPosition( this.node.position );

        const aabb = new Rect(
            screwPosition.x - GameConfig.SCREW_RADIUS,
            screwPosition.y - GameConfig.SCREW_RADIUS,
            GameConfig.SCREW_RADIUS * 2,
            GameConfig.SCREW_RADIUS * 2 );


        let cachedCollider = PhysicsSystem2D.instance.testAABB( aabb );

        if ( cachedCollider.length === 0 ) return false;

        //console.log( "Cached Collider: ", cachedCollider.length );

        for ( let i = 0; i < cachedCollider.length; i++ )
        {
            //neu cung layer voi BAR_LAYER
            if ( cachedCollider[ i ].node.layer === barLayer )
            {
                this.cachedBarLayer.push( cachedCollider[ i ] );
            }
        }

        // console.log( "Cached BarLayer: ", this.cachedBarLayer.length );

        for ( let i = 0; i < this.cachedBarLayer.length; i++ )
        {
            let bar = this.cachedBarLayer[ i ].node.getComponent( GameLayerComponent );
            if ( bar !== null )
            {
                //console.log( "Bar Layer: ", bar.Layer );
                if ( bar.Layer > this.Layer )
                {
                    console.log( "Is blocked" );
                    return true;
                }
            }
        }

        return false;
    }

    //#endregion

    private MoveToBoxSlot ( hole: Hole ): void 
    {
        hole.isLinked = true;
        this.linkingHole = hole;
        hole.SetColor();
        this.hingeJoint.destroy();
        //this.node.active = false;
        console.log( this.node.position );
        console.log( this.linkingHole.node.worldPosition );

        tween( this.node )
            .to( 0.5, { worldPosition: this.linkingHole.node.worldPosition } )
            .start();

        this.node.parent = this.linkingHole.node;
    }

}


