import { _decorator, CCBoolean, Component, Node, tween, Vec3 } from 'cc';
import { HoleContainer } from '../HoleContainer';
import { HoleColor } from '../../Hole/HoleColor';
import { eColorType } from '../../../GameConfig/GameColorConfig';
import { Hole } from '../../Hole/Hole';
import { BoxRenderer } from './BoxRenderer';
import { BoxSlot } from './BoxSlot';
import { BoxContainer } from '../../../Controller/BoxContainer';
import { CahedContainer } from '../../../Controller/CahedContainer';
import { AudioController, AudioType } from '../../../AudioController/AudioController';
import { GameConfig } from '../../../GameConfig/GameConfig';
import { StarController } from '../../../Star/StarController';
import { GameManager } from '../../../Manager/GameManager';
import { UnlockBoxController } from '../../../UnlockBoxConcept/UnlockBoxController';
import { TestIQController } from '../../../TestIQ/TestIQController';
const { ccclass, property } = _decorator;

@ccclass( 'Box' )
export class Box extends HoleContainer
{

    public boxRenderer: BoxRenderer = null;
    private currentScrew: number = 0;
    private boxSlotOwner: BoxSlot = null;

    public IS_ANIMATING: boolean = false;

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

    public GetFreeHole ( colorType: eColorType ): Hole
    {
        if ( this.boxRenderer.colorType != colorType ) return null;

        for ( const hole of this.listHoles )
        {
            if ( hole.IsFree() && hole.isLinked === false )
            {
                //console.log( "Tim duoc hole: " + hole );
                return hole;
            }
        }

        return null;
    }

    private setHoleData (): void
    {
        for ( const hole of this.listHoles )
        {
            hole.Box = this;
        }
    }

    //#region BoxComplete
    public CheckFullBox (): void
    {
        this.currentScrew++;
        if ( this.currentScrew >= this.listHoles.length )
        {
            this.CloseBox();
        }
    }

    private starList: Node[] = [];
    private iqNode: Node = null;

    public CloseBox (): void
    {
        GameManager.Instance.CollectedScrew += this.listHoles.length;
        this.boxRenderer.closeBox.active = true;
        this.boxRenderer.skeleton.setAnimation( 0, 'Appear', false );
        tween( this.boxRenderer.closeBox )
            .to( GameConfig.BOX_CLOSE_DURATION, { position: new Vec3( 0, 0, 0 ) } )
            .call( () =>
            {
                //MeowAnimation.Instance.MoveIn(this.node.parent);
                AudioController.Instance.PlayAudio( AudioType.boxComplete );
                AudioController.Instance.PlayMewoComplete();
                //this.starList = StarController.Instance.SpawnStar( this.listHoles.length, this.listHoles );
                StarController.Instance.PlayParticle( this.node.worldPosition );
                this.iqNode = TestIQController.Instance.SpawnIQ( this );
            } )
            .delay( 0.3 )
            .call( () =>
            {
                //StarController.Instance.Move( this.starList );
                TestIQController.Instance.MoveIQ( this.iqNode );
                this.MoveOut();
            } )
            .start();
    }

    public MoveOut (): void
    {
        const pos = this.node.position.clone().add( new Vec3( 0, 200, 0 ) );
        this.boxRenderer.skeleton.setAnimation( 0, 'Appear2', true );
        tween( this.node )
            .to( GameConfig.BOX_MOVEOUT_DURATION, { position: pos } )
            .call( () =>
            {
                this.boxSlotOwner.Box = null;
                this.node.destroy();
                UnlockBoxController.Instance.AddLockCount();
                BoxContainer.Instance.CheckCreateBox();
                BoxContainer.Instance.RemoveActiveBox( this );
            } )
            .start();
    }

    //#endregion

    public MoveIn (): void
    {
        this.IS_ANIMATING = true;
        tween( this.node )
            .to( GameConfig.BOX_MOVEIN_DURATION, { position: new Vec3( 0, 0, 0 ) } )
            .call( () => 
            {
                this.IS_ANIMATING = false;
                CahedContainer.Instance.CheckMoveScrewFromCachedToBox();
            } )
            .start();
    }

    public GetFreeHoleCount (): number
    {
        let count = 0;
        for ( const hole of this.listHoles )
        {
            if ( hole.IsFree() && hole.isLinked === false )
            {
                count++;
            }
        }
        return count;
    }
}


