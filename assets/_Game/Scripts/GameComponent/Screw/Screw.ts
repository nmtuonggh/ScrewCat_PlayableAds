import { _decorator, Collider2D, Component, Node, PhysicsSystem2D, Rect } from 'cc';
import { GameLayerComponent } from '../GameLayerComponent';
import { eColorType } from '../../GameConfig/GameColorConfig';
import { Hole } from '../Hole/Hole';
import { GameConfig } from '../../GameConfig/GameConfig';
const { ccclass, property } = _decorator;

@ccclass( 'Screw' )
export class Screw extends GameLayerComponent
{

    private _colorType: eColorType = eColorType.Blue;

    //#region Encapsulation

    public get ColorType (): eColorType
    {
        return this._colorType;
    }

    public set ColorType ( value: eColorType )
    {
        this._colorType = value;
    }

    //#endregion

    protected start (): void
    {
        //console.log(this.IsBlocked());
        this.Test();
    }

    //#region CheckMove
    public CheckMove (): void
    {
        // if ( this.IsBlocked() === true )
        // {
        //     console.log( "Is blocked" );
        //     return;
        // }

        if ( this.CheckMoveBox() )
        {
            //console.log("Can move to box");
        }
    }

    public CheckMoveBox (): boolean
    {
        let freeBox = this.GameLogic.GetFreeHoleBox( this.ColorType );
        if ( freeBox !== null )
        {
            this.MoveToBoxSlot( freeBox );
            return true;
        }

        return false;
    }

    private cachedBarLayer: Collider2D[] = [];

    // private IsBlocked (): boolean
    // {
    //     this.cachedBarLayer = [];
    //     const barLayer = GameLayerMaskConfig.BAR_LAYER_MASK;
    //     const screwPosition = this.node.position;
    //     // console.log( "Screw Position: ", screwPosition );
    //     // console.log("GameConfig.SCREW_RADIUS: ", GameConfig.SCREW_RADIUS);
    //     const aabb = new Rect(
    //         screwPosition.x - GameConfig.SCREW_RADIUS,
    //         screwPosition.y - GameConfig.SCREW_RADIUS,
    //         GameConfig.SCREW_RADIUS * 2,
    //         GameConfig.SCREW_RADIUS * 2 );


    //     let cachedCollider = PhysicsSystem2D.instance.testAABB( aabb );

    //     console.log( "Cached Collider: ", cachedCollider.length );

    //     if ( cachedCollider.length === 0 ) return false;

    //     console.log( "Cached Bar Layer: ", cachedCollider.length );

    //     for ( let i = 0; i < cachedCollider.length; i++ )
    //     {
    //         //neu cung layer voi BAR_LAYER
    //         if ( cachedCollider[ i ].node.layer === barLayer )
    //         {
    //             this.cachedBarLayer.push( cachedCollider[ i ] );
    //         }
    //     }

    //     for ( let i = 0; i < this.cachedBarLayer.length; i++ )
    //     {
    //         let bar = this.cachedBarLayer[ i ].node.getComponent( GameLayerComponent );
    //         if ( bar !== null )
    //         {
    //             if ( bar.Layer > this.Layer )
    //             {
    //                 console.log( "Is blocked" );
    //                 return true;
    //             }
    //         }
    //     }

    //     return false;
    // }

    private Test (): void
{
    const aabb = new Rect(
        this.node.position.x - GameConfig.CLICK_RADIUS,
        this.node.position.y - GameConfig.CLICK_RADIUS,
        GameConfig.CLICK_RADIUS * 2,
        GameConfig.CLICK_RADIUS * 2 );

    let cachedCols = PhysicsSystem2D.instance.testAABB( aabb );

    console.log( "Cached Collider: ", cachedCols.length );
}

    //#endregion

    private MoveToBoxSlot ( hole: Hole ): void
    {
        //console.log( 'MoveToBoxSlot' );
        hole.isLinked = true;
        hole.SetColor();
        this.node.active = false;
    }
}


