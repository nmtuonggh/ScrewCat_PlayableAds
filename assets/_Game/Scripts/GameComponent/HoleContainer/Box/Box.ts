import { _decorator, CCBoolean, Component, Node, tween, Vec3 } from 'cc';
import { HoleContainer } from '../HoleContainer';
import { HoleColor } from '../../Hole/HoleColor';
import { eColorType } from '../../../GameConfig/GameColorConfig';
import { Hole } from '../../Hole/Hole';
import { BoxRenderer } from './BoxRenderer';
import { BoxSlot } from './BoxSlot';
import { AudioType } from '../../../AudioController/AudioController';
import { GameConfig } from '../../../GameConfig/GameConfig';
import { getGameSystem } from '../../../GameSystem';
const { ccclass, property } = _decorator;

@ccclass( 'Box' )
export class Box extends HoleContainer
{
    //#region PRIVATE FIELD
    private boxRenderer: BoxRenderer = null;
    private currentScrew: number = 0;
    private boxSlotOwner: BoxSlot = null;
    private starList: Node[] = [];

    //#endregion
    //#region PROPERTY
    public get BoxRenderer (): BoxRenderer
    {
        return this.boxRenderer;
    }
    public set BoxRenderer ( value: BoxRenderer )
    {
        this.boxRenderer = value;
    }
    //#endregion
    //#region PUBLIC FIELD
    public IS_ANIMATING: boolean = false;
    //#endregion
    //#region CC METHODS
    protected onLoad (): void
    {
        this.listHoles = this.getComponentsInChildren( HoleColor );
        this.boxRenderer = this.getComponent( BoxRenderer );
        this.boxSlotOwner = this.node.parent.parent.getComponent( BoxSlot );
    }

    protected start (): void
    {
        this.setHoleData();
    }
    //#endregion
    //#region PUBLIC METHOD
    public getFreeHole ( colorType: eColorType ): Hole
    {
        if ( this.boxRenderer.colorType != colorType ) return null;

        for ( const hole of this.listHoles )
        {
            if ( hole.IsFree() && hole.isLinked === false )
            {
                return hole;
            }
        }

        return null;
    }

    //#region BoxComplete
    public checkFullBox (): void
    {
        this.currentScrew++;
        if ( this.currentScrew >= this.listHoles.length )
        {
            this.CloseBox();
        }
    }
    //#endregion
    //#endregion

    public MoveIn (): void
    {
        this.IS_ANIMATING = true;
        tween( this.node )
            .to( GameConfig.BOX_MOVEIN_DURATION, { position: new Vec3( 0, 0, 0 ) } )
            .call( () => 
            {
                this.IS_ANIMATING = false;
                getGameSystem().CahedContainer.CheckMoveScrewFromCachedToBox();
            } )
            .start();
    }
    //#endregion

    //#region PRIVATE METHOD
    private MoveOut (): void
    {
        const pos = this.node.position.clone().add( new Vec3( 0, 200, 0 ) );
        this.boxRenderer.skeleton.setAnimation( 0, 'Appear2', false );
        tween( this.node )
            .to( GameConfig.BOX_MOVEOUT_DURATION, { position: pos } )
            .call( () =>
            {
                this.boxRenderer.skeleton.enabled = false;
                this.boxSlotOwner.Box = null;
                this.node.destroy();
                getGameSystem().UnlockBoxController.AddLockCount();
                getGameSystem().BoxContainer.CheckCreateBox();
                getGameSystem().BoxContainer.RemoveActiveBox( this );
            } )
            .start();
    }
    private CloseBox (): void
    {
        if ( getGameSystem().GameManager.lose ) return;
        let listHolesPos: Vec3[] = [];
        for ( let i = 0; i < this.listHoles.length; i++ )
        {
            listHolesPos.push( this.listHoles[ i ].node.worldPosition );
        }
        getGameSystem().GameManager.CollectedScrew += this.listHoles.length;
        this.boxRenderer.closeBox.active = true;
        ///Random tieng meo di kem voi con meo
        let index = Math.floor( Math.random() * 5 );
        let iqNode;
        this.boxRenderer.PlayAnimCompleBox( index );
        tween( this.boxRenderer.closeBox )
            .to( GameConfig.BOX_CLOSE_DURATION, { position: new Vec3( 0, 0, 0 ) } )
            .call( () =>
            {
                getGameSystem().AudioController.playAudio( AudioType.boxComplete );
                getGameSystem().AudioController.playMewoComplete( index );
                this.starList = getGameSystem().StarController.spawnStar( this.listHoles.length, listHolesPos, 0 );
                getGameSystem().StarController.playParticle( this.node.worldPosition );
                iqNode = getGameSystem().TestIQController.spawnIQ( this.node, true );
            } )
            .delay( 0.3 )
            .call( () =>
            {
                getGameSystem().StarController.moveListStart( this.starList );
                getGameSystem().TestIQController.moveIQ( iqNode, 5 );
                this.MoveOut();
            } )
            .start();
    }
    private setHoleData (): void
    {
        for ( const hole of this.listHoles )
        {
            hole.Box = this;
        }
    }
    //#endregion
}


