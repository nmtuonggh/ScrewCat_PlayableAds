import { _decorator, CCBoolean, Component, Node, tween, Vec3 } from 'cc';
import { HoleContainer } from '../HoleContainer';
import { HoleColor } from '../../Hole/HoleColor';
import { eColorType } from '../../../GameConfig/GameColorConfig';
import { Hole } from '../../Hole/Hole';
import { BoxRenderer } from './BoxRenderer';
const { ccclass, property } = _decorator;

@ccclass( 'Box' )
export class Box extends HoleContainer
{

    private boxRenderer: BoxRenderer = null;
    private currentScrew: number = 0;
    //#endregion

    protected onLoad (): void
    {
        this.listHoles = this.getComponentsInChildren( HoleColor );
        this.boxRenderer = this.getComponent( BoxRenderer );
    }

    protected start (): void
    {
        this.setHoleData();
    }

    public GetFreeHole ( colorType: eColorType ): Hole
    {
        if ( this.boxRenderer.ColorType != colorType ) return null;

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

    public CheckFullBox (): void
    {
        this.currentScrew++;
        if ( this.currentScrew >= this.listHoles.length )
        {
            this.CloseBox();
        }
    }

    public CloseBox (): void
    {
        this.boxRenderer.closeBox.active = true;
        tween( this.boxRenderer.closeBox )
            .to( 0.5, { position: new Vec3( 0, 0, 0 ) } )
            .call( () => 
            {
                this.MoveOut();
            } )
            .start();
    }

    public MoveOut () : void {
        const pos = this.node.position.clone().add(new Vec3(0, 200, 0));
        tween(this.node)
            .to(0.8, {position: pos})
            .call(() => {
                //this.node.active = false;
            })
            .start();
    }


}


