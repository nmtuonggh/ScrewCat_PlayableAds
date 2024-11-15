import { _decorator, Component, Node } from 'cc';
import { BoxSlot } from '../GameComponent/HoleContainer/Box/BoxSlot';
import { BoxContainer } from '../Controller/BoxContainer';
import { AudioController, AudioType } from '../AudioController/AudioController';
const { ccclass, property } = _decorator;

@ccclass( 'UnlockBoxController' )
export class UnlockBoxController extends Component 
{
    @property( Node )
    public boxContainer: Node = null;

    public boxSlot: BoxSlot[] = [];

    @property( [ BoxSlot ] )
    public lockBoxSlot: BoxSlot[] = [];

    @property( BoxSlot )
    currentLockBoxSlot: BoxSlot = null;


    private static _instance: UnlockBoxController = null;

    public static get Instance (): UnlockBoxController
    {
        return this._instance;
    }

    protected override onLoad (): void
    {
        if ( UnlockBoxController._instance === null )
        {
            UnlockBoxController._instance = this;
        }
    }

    protected start (): void
    {
        this.boxSlot = this.boxContainer.getComponentsInChildren( BoxSlot );
        for ( const slot of this.boxSlot )
        {
            if ( slot.isAds && slot.isBlock )
            {
                this.lockBoxSlot.push( slot );
            }
        }
        this.InitBlockBox();
    }

    public AddLockCount (): void
    {
        if( this.currentLockBoxSlot.lockCount <= 0 ) return;
        this.currentLockBoxSlot.currentCount += 1;
        this.currentLockBoxSlot.lockText.string = this.currentLockBoxSlot.currentCount + "/" + this.currentLockBoxSlot.lockCount;
        this.currentLockBoxSlot.TextLockBoxAnim();

        if ( this.currentLockBoxSlot.currentCount >= this.currentLockBoxSlot.lockCount )
        {
            this.currentLockBoxSlot.isAds = false;
            this.currentLockBoxSlot.lockText.node.active = false;
            this.currentLockBoxSlot.boxAdsPrefab.active = false;
            this.lockBoxSlot.shift();
            this.SetCurrentBlockBox();
        }
    }

    public SetCurrentBlockBox (): void
    {
        if ( this.lockBoxSlot.length === 0 ) return;
        this.currentLockBoxSlot = this.lockBoxSlot[ 0 ];

        AudioController.Instance.PlayAudio( AudioType.unlockChain );
        this.currentLockBoxSlot.UnlockAnimation();
        setTimeout( () =>
        {
            this.currentLockBoxSlot.lockAnim.node.active = false;
            this.currentLockBoxSlot.SetTextLockBox();
        }, 1000 );
    }

    public InitBlockBox (): void
    {
        if ( this.lockBoxSlot.length >= 2 )
        {
            this.currentLockBoxSlot = this.lockBoxSlot[ 0 ];
            for ( let i = 1; i < this.lockBoxSlot.length; i++ )
            {
                const boxSlot = this.lockBoxSlot[ i ];
                boxSlot.SetLock();
            }
        }
        else if ( this.lockBoxSlot.length === 1 )
        {
            this.currentLockBoxSlot = this.lockBoxSlot[ 0 ];
        }

        if ( this.currentLockBoxSlot.lockCount > 0 )
        {
            this.currentLockBoxSlot.SetTextLockBox();
        }
        else
        {
            this.currentLockBoxSlot.SetLock();
        }

    }
}


