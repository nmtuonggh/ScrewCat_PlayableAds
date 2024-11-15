import { instantiate } from 'cc';
import { Prefab } from 'cc';
import { _decorator, Component, Node } from 'cc';
import BoxController from '../../../../extensions/nvthan/@types/packages/scene/@types/cce/public/gizmos/3d/elements/controller/box-controller';
import { Box } from '../GameComponent/HoleContainer/Box/Box';
import { tween } from 'cc';
import { Label } from 'cc';
import { Vec3 } from 'cc';
import { MultiScreneController, ScreenType } from '../Controller/MultiScreneController';
import { MoveScrewHandle } from '../Controller/MoveScrewHandle';
import { sp } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'TestIQController' )
export class TestIQController extends Component 
{
    @property( [ Node ] )
    private uiTestIQ: Node = null;
    @property( [ Vec3 ] )
    private endPosition: Vec3[] = [];
    @property( Prefab )
    private iqPrefab: Prefab = null;
    @property( Node )
    private holder: Node = null;
    @property( Label )
    public text: Label = null;
    @property( sp.Skeleton )
    public iqAnim: sp.Skeleton = null;



    public currentIQ: number = 0;

    private static _instance: TestIQController = null;

    public static get Instance (): TestIQController
    {
        return this._instance;
    }

    protected override onLoad (): void
    {
        if ( TestIQController._instance === null )
        {
            TestIQController._instance = this;
        }
    }

    protected start (): void
    {
        this.currentIQ = 0;
        this.text.string = `${ this.currentIQ }`;
    }

    private SetStartPosition ( screenType: ScreenType ): void
    {
        let pos = this.endPosition[ screenType ].clone().subtract( new Vec3( 0, 800, 0 ) );
        this.uiTestIQ.position = pos;
    }

    private SetEndPosition ( screenType: ScreenType ): void
    {
        let pos = this.endPosition[ screenType ];
        this.uiTestIQ.position = pos;
    }

    public TweenIQUI ( screenType: ScreenType ): void
    {
        this.iqAnim.setAnimation( 0, "idle", true );
        tween( this.uiTestIQ )
            .to( 0.5, { position: this.endPosition[ screenType ] }, { easing: 'backOut' } )
            .call( () =>
            {
                this.TweenScaleText();
                this.AddIQ( 75 );
                this.iqAnim.setAnimation( 0, "Roi kinh", false );
                this.iqAnim.setCompleteListener( () =>
                {
                    this.iqAnim.setAnimation( 0, "idle", true );
                } );
            } )
            .start();
    }

    public SetupIQUI ( screenType: ScreenType ): void
    {
        if ( !MoveScrewHandle.Instance.isFirstTouch )
        {
            this.SetStartPosition( screenType );
        }
        else
        {
            this.SetEndPosition( screenType );
        }
    }

    public SpawnIQ ( box: Box ): Node
    {
        const iq = instantiate( this.iqPrefab );
        iq.parent = this.holder;
        iq.worldPosition = box.node.worldPosition;
        return iq;
    }

    public MoveIQ ( iq: Node ): void
    {
        tween( iq )
        // tween().to( 0.7, { scale: new Vec3( 2, 2, 2 ) }, { easing: 'backIn' } )
            .to( 0.25, { scale: new Vec3( 1.75, 1.75, 2 ) }, { easing: 'backIn' } )
            .to( 0.7, { worldPosition: this.text.node.worldPosition }, { easing: 'backIn' } )

            // .parallel(
            //     tween().to( 0.7, { worldPosition: this.text.node.worldPosition }, { easing: 'backIn' } ),
            // )
            .call( () =>
            {
                iq.destroy();
            } )
            .call( () =>
            {
                this.TweenScaleText();
                this.AddIQ( 5 );
                this.iqAnim.setAnimation( 0, "Roi kinh", false );
                this.iqAnim.setCompleteListener( () =>
                {
                    this.iqAnim.setAnimation( 0, "idle", true );
                } );
            } )
            .start();
    }

    private AddIQ ( amount: number ): void
    {
        const initialIQ = this.currentIQ;
        tween( { amount: initialIQ } )
            .to( 0.35, { amount: initialIQ + amount }, {
                onUpdate: ( target, ratio ) =>
                {
                    let r = Math.round( amount * ratio );
                    this.text.string = `${ initialIQ + r }`;
                }
            } )
            .call( () => { this.currentIQ += amount; } )
            .start();
    }

    private TweenScaleText (): void
    {
        tween( this.text.node )
            .to( 0.2, { scale: new Vec3( 1.2, 1.2, 1.2 ) } )
            .to( 0.2, { scale: new Vec3( 1, 1, 1 ) } )
            .start();
    }
}


