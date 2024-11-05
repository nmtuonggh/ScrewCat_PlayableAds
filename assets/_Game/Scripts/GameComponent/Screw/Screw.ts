import { _decorator, Collider2D, HingeJoint2D, instantiate, Node, PhysicsSystem2D, Prefab, random, Rect, Tween, tween, Vec2, Vec3 } from 'cc';
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
import { ScrewData } from '../../FakeSO/ScrewData';
import { GameManager } from '../../Manager/GameManager';
import { LogicSpawnBoxController } from '../../Controller/LogicSpawnBoxController';
import { BarController } from '../Bar/BarController';
const { ccclass, property } = _decorator;

@ccclass( 'Screw' )
export class Screw extends GameLayerComponent
{

    @property( { type: HingeJoint2D } )
    public hingeJoint: HingeJoint2D = null;
    @property( ScrewRenderer )
    private screwRenderer: ScrewRenderer = null;
    private screwAnimation: ScrewAnim = null;

    private linkingHole: Hole = null;
    public BarHolder: BarController = null;
    public State: eScrewState = eScrewState.IN_BAR;
    //#region Encapsulation

    public get ScrewRenderer (): ScrewRenderer
    {
        return this.screwRenderer;
    }


    //#endregion

    protected onLoad (): void
    {
        //this.screwRenderer = this.getComponent( ScrewRenderer );
        this.screwAnimation = this.getComponent( ScrewAnim );
    }

    public InitSCrewData ( colorType: eColorType, data: ScrewData ): void
    {
        this.State = eScrewState.IN_BAR;
        this.screwRenderer.SetSprite( colorType, data );

    }

    private FreeJoints (): void 
    {
        this.hingeJoint.enabled = false;
        this.BarHolder.RemoveScrew( this );
    }

    //#region CheckMove
    public CheckMove (): void
    {
        if ( this.State === eScrewState.MOVING )
        {
            return;
        }

        if ( this.State === eScrewState.IN_BAR  && this.IsBlocked() )
        {
            this.BlockedTween();
            return;
        }

        switch ( this.State )
        {
            case eScrewState.IN_BAR:
                let moveSuccess: boolean = false;

                if ( this.CheckMoveBox() )
                {
                    this.State = eScrewState.MOVING;
                    moveSuccess = true;
                    AudioController.Instance.PlayAudio( AudioType.screwOut );
                } 
                else if ( this.CheckMoveCache() )
                {
                    this.State = eScrewState.MOVING;
                    moveSuccess = true;
                    AudioController.Instance.PlayAudio( AudioType.screwOut );
                }

                if ( moveSuccess === true )
                {
                    this.FreeJoints();
                }

                break;

            case eScrewState.IN_CACHED:
                if ( this.CheckMoveBox() )
                {
                    AudioController.Instance.PlayAudio( AudioType.screwOut );
                }
                break;
            case eScrewState.IN_BOX:
                break;
        }

    }

    public CheckMoveBox (): boolean
    {
        //let freeBox = this.GameLogic.GetFreeHoleBox( this.screwRenderer.ColorType );
        let freeBox = BoxContainer.Instance.GetFreeBoxSlot( this.screwRenderer.colorType );

        if ( freeBox !== null )
        {
            this.MoveToBoxSlot( freeBox );
            //loại screw này ra khỏi list screw của LogicSpawnBoxController
            LogicSpawnBoxController.Instance.RemoveScrew( this );
            
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

    //#endregion

    //#region Blocked

    public IsBlocked (): boolean
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

    private BlockedTween (): void
    {
        const axis = Math.floor( Math.random() * 4 );
        this.screwAnimation.ScrewBlock( axis );
    }

    //#endregion

    //#region MoveToBoxSlot
    private MoveToBoxSlot ( hole: Hole ): void 
    {
        hole.isLinked = true;
        hole.linkingScrew = null;
        this.linkingHole = hole;
        GameManager.Instance.CheckGoToAdsCondition();
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

    //#endregion

    //#region MoveToCacheSlot

    private MoveToCacheSlot ( hole: Hole ): void
    {
        hole.isLinked = true;
        this.linkingHole = hole;
        this.screwAnimation.ScrewOut();
        GameManager.Instance.CheckGoToAdsCondition();
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
                GameManager.Instance.CheckLose();
            } );
    }

    //#endregion

}

export enum eScrewState
{
    IN_BAR = 0,
    IN_CACHED = 1,
    IN_BOX = 2,
    MOVING = 999
}


