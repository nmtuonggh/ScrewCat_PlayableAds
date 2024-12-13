import { instantiate } from 'cc';
import { Prefab } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { Box } from '../GameComponent/HoleContainer/Box/Box';
import { tween } from 'cc';
import { Label } from 'cc';
import { Vec3 } from 'cc';
import { ScreenType } from '../Controller/MultiScreneController';
import { sp } from 'cc';
import { getGameSystem } from '../GameSystem';
const { ccclass, property } = _decorator;

@ccclass( 'TestIQController' )
export class TestIQController extends Component 
{
    //#region EDITOR EXPOSED FIELD
    @property( [ Node ] )
    private uiTestIQ: Node = null;
    @property( [ Vec3 ] )
    private endPosition: Vec3[] = [];
    @property( Prefab )
    private iqPrefabAdd: Prefab = null;
    @property( Prefab )
    private iqPrefabDec: Prefab = null;
    @property( Node )
    private holder: Node = null;
    @property( Label )
    private text: Label = null;
    @property( sp.Skeleton )
    private iqAnim: sp.Skeleton = null;
    //#endregion

    public currentIQ: number = 0;

    protected start (): void
    {
        this.currentIQ = 0;
        this.text.string = `${ this.currentIQ }`;
    }

    private setStartPosition ( screenType: ScreenType ): void
    {
        if ( !this.uiTestIQ ) return;
        let pos = this.endPosition[ screenType ].clone().subtract( new Vec3( 0, 800, 0 ) );
        this.uiTestIQ.position = pos;
    }

    private setEndPosition ( screenType: ScreenType ): void
    {
        if ( !this.uiTestIQ ) return;
        let pos = this.endPosition[ screenType ];
        this.uiTestIQ.position = pos;
    }
    private setUIIQPosition ( screenType: ScreenType ): void
    {
        if ( !this.uiTestIQ ) return;
        let pos = this.endPosition[ screenType ];
        this.uiTestIQ.position = pos;
    }

    public tweenIQUI ( screenType: ScreenType ): void
    {
        //this.iqAnim.setAnimation( 0, "idle", true );
        tween( this.uiTestIQ )
            .to( 0.5, { position: this.endPosition[ screenType ] }, { easing: 'backOut' } )
            .call( () =>
            {
                this.tweenScaleText();
                this.addIQ( 75 );
                // this.iqAnim.setAnimation( 0, "Roi kinh", false );
                // this.iqAnim.setCompleteListener( () =>
                // {
                //     this.iqAnim.setAnimation( 0, "idle", true );
                // } );
            } )
            .start();
    }

    public setupIQUI ( screenType: ScreenType ): void
    {
        this.setUIIQPosition( screenType );
    }

    public spawnIQ ( spawnNode: Node, isAdd: boolean ): Node
    {
        let iq;
        if ( isAdd )
        {
            iq = instantiate( this.iqPrefabAdd );
        }
        else
        {
            iq = instantiate( this.iqPrefabDec );
        }
        iq.parent = this.holder;
        var pos = new Vec3( 0, 0, 0 );
        Vec3.add( pos, spawnNode.getWorldPosition(), new Vec3( 0, 0, 0 ) ); ///em dinh chinh nma lai k can nen thoi de lam nhu the nay
        iq.worldPosition = pos;
        return iq;
    }

    public moveIQ ( iq: Node, value: number ): void
    {
        tween( iq )
            .to( 0.25, { scale: new Vec3( 1.65, 1.65, 2 ) }, { easing: 'smooth' } )
            .to( 0.7, { worldPosition: this.text.node.worldPosition }, { easing: 'smooth' } )
            .call( () =>
            {
                iq.destroy();
            } )
            .call( () =>
            {
                this.tweenScaleText();
                this.addIQ( value );
                // if ( this.iqAnim )
                // {
                //     this.iqAnim.setAnimation( 0, "Roi kinh", false );
                //     this.iqAnim.setCompleteListener( () =>
                //     {
                //         this.iqAnim.setAnimation( 0, "idle", true );
                //     } );
                // }
            } )
            .start();
    }

    private addIQ ( amount: number ): void
    {
        const initialIQ = this.currentIQ;
        this.currentIQ += amount;
        if ( initialIQ + amount >= 0 )
        {
            tween( { amount: initialIQ } )
                .to( 0.35, { amount: initialIQ + amount }, {
                    onUpdate: ( target, ratio ) =>
                    {
                        let r = Math.round( amount * ratio );
                        this.text.string = `${ initialIQ + r }`;
                    }
                } )
                .start();
        }
        else
        {
            this.currentIQ = 0;
        }
    }

    private tweenScaleText (): void
    {
        tween( this.text.node )
            .to( 0.2, { scale: new Vec3( 1.2, 1.2, 1.2 ) } )
            .to( 0.2, { scale: new Vec3( 1, 1, 1 ) } )
            .start();
    }
}


