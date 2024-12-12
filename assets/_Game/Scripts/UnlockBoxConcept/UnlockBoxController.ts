import { _decorator, Component, Node } from 'cc';
import { BoxSlot } from '../GameComponent/HoleContainer/Box/BoxSlot';
import { AudioController, AudioType } from '../AudioController/AudioController';
import { getGameSystem } from '../GameSystem';
const { ccclass, property } = _decorator;

@ccclass( 'UnlockBoxController' )
export class UnlockBoxController extends Component 
{
    @property( Node )
    public boxContainer: Node = null;
    @property( [ BoxSlot ] )
    public lockBoxSlot: BoxSlot[] = [];
    @property( BoxSlot )
    currentLockBoxSlot: BoxSlot = null;

    public boxSlot: BoxSlot[] = [];

    protected start (): void
    {
        this.boxSlot = this.boxContainer.getComponentsInChildren( BoxSlot );
        for ( const slot of this.boxSlot )
        {
            if ( slot.IsLock && slot.IsBlockByChain )
            {
                this.lockBoxSlot.push( slot );
            }
        }
        this.InitBlockBox();
    }

    public AddLockCount (): void
    {
        if( !this.currentLockBoxSlot) return;
        if( this.currentLockBoxSlot.LockCount <= 0 ) return;
        this.currentLockBoxSlot.CurrentCount += 1;
        //this.currentLockBoxSlot.LockText.string = this.currentLockBoxSlot.CurrentCount + "/" + this.currentLockBoxSlot.LockCount;
        this.currentLockBoxSlot.TextLockBoxAnim();
        if ( this.currentLockBoxSlot.CurrentCount >= this.currentLockBoxSlot.LockCount )
        {
            this.lockBoxSlot.shift();
            if ( this.lockBoxSlot.length === 0 ) return;
            this.currentLockBoxSlot = this.lockBoxSlot[ 0 ];
        }
    }

    public InitBlockBox (): void
    {
        if ( this.lockBoxSlot.length >= 2 )
        {
            this.currentLockBoxSlot = this.lockBoxSlot[ 0 ];
        }
        else if ( this.lockBoxSlot.length === 1 )
        {
            this.currentLockBoxSlot = this.lockBoxSlot[ 0 ];
        }
    }
}


