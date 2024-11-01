import { _decorator, Collider2D, HingeJoint2D, Node, PhysicsSystem2D, Rect, Tween, tween, Vec2, Vec3 } from 'cc';
import { GameLayerComponent } from '../GameLayerComponent';
import { eColorType } from '../../GameConfig/GameColorConfig';
import { Hole } from '../Hole/Hole';
import { GameConfig } from '../../GameConfig/GameConfig';
import { GameLayerMaskConfig } from '../../GameConfig/GameLayerMaskConfig';
import { ScrewRenderer } from './ScrewRenderer';
import { EventManager } from '../../EventManager/EventManager';
import { BoxContainer } from '../../Controller/BoxContainer';
import { CahedContainer } from '../../Controller/CahedContainer';
import { ScrewAnim } from './ScrewAnim';
import { AudioController, AudioType } from '../../AudioController/AudioController';
const { ccclass, property } = _decorator;

@ccclass( 'Screw' )
export class Screw extends GameLayerComponent
{

    @property( { type: HingeJoint2D } )
    public hingeJoint: HingeJoint2D = null;
    @property( { type: ScrewRenderer } )
    private screwRenderer: ScrewRenderer = null;
    private screwAnimation: ScrewAnim = null;

    private linkingHole: Hole = null;
    public State: eScrewState = eScrewState.IN_BAR;
    //#region Encapsulation



    //#endregion

    protected onLoad (): void
    {
        this.screwRenderer = this.getComponent( ScrewRenderer );
        this.screwAnimation = this.getComponent( ScrewAnim );
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
            AudioController.Instance.PlayAudio( AudioType.screwOut );
        }
        else if ( this.CheckMoveCache() )
        {
            AudioController.Instance.PlayAudio( AudioType.screwOut );
        }


    }

    public CheckMoveBox (): boolean
    {
        //let freeBox = this.GameLogic.GetFreeHoleBox( this.screwRenderer.ColorType );
        let freeBox = BoxContainer.Instance.GetFreeBoxSlot( this.screwRenderer.colorType );

        if ( freeBox !== null )
        {
            this.MoveToBoxSlot( freeBox );
            return true;
        }

        return false;
    }

    public CheckMoveCache (): boolean
    {
        let freeHole = this.GameLogic.GetFreeHoleCache();
        if ( freeHole !== null )
        {
            this.MoveToCacheSlot( freeHole );
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
        hole.linkingScrew = null;
        this.linkingHole = hole;
        if ( this.State === eScrewState.IN_BAR )
        {
            this.hingeJoint.destroy();
        }
        this.screwAnimation.ScrewOut();
        this.TweenMoveBox( this.node, hole, GameConfig.SCREW_OUT_DURATION ).start();
    }

    private TweenMoveBox ( node: Node, hole: Hole, delayTime: number ): Tween<Node>
    {
        return tween( node )
            .delay( delayTime )
            .to( GameConfig.SCREW_MOVE_DURATION, { worldPosition: this.linkingHole.node.worldPosition } )
            .call( () =>
            {
                AudioController.Instance.PlayAudio( AudioType.screwIn );
                const worldPosition = this.node.worldPosition;
                this.node.parent = this.linkingHole.node;
                this.node.worldPosition = worldPosition;
                this.State = eScrewState.IN_BOX;
                hole.Box.CheckFullBox();
                this.screwAnimation.ScrewIn();
            } );
    }



    private MoveToCacheSlot ( hole: Hole ): void
    {
        hole.isLinked = true;
        this.linkingHole = hole;
        hole.SetColor();
        this.hingeJoint.destroy();
        this.screwAnimation.ScrewOut();
        this.TweenMoveCached( this.node, hole, GameConfig.SCREW_IN_DURATION ).start();
    }

    private TweenMoveCached ( node: Node, hole: Hole, delayTime: number ): Tween<Node>
    {
        return tween( node )
            .delay( delayTime )
            .to( GameConfig.SCREW_MOVE_DURATION, { worldPosition: this.linkingHole.node.worldPosition } )
            .call( () =>
            {
                AudioController.Instance.PlayAudio( AudioType.screwIn );
                const worldPosition = this.node.worldPosition;
                this.node.parent = this.linkingHole.node;
                this.node.worldPosition = worldPosition;
                hole.linkingScrew = this;
                this.State = eScrewState.IN_CACHED;
                this.screwAnimation.ScrewIn();
                CahedContainer.Instance.CheckMoveScrewFromCachedToBox();
            } );
    }

}

export enum eScrewState
{
    IN_BAR = 0,
    IN_CACHED = 1,
    IN_BOX = 2,
    MOVING = 999
}


