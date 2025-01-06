import { _decorator, Component, Node } from 'cc';
import { BoxContainer } from './BoxContainer';
import { CCBoolean } from 'cc';
import { BoxSlot } from '../GameComponent/HoleContainer/Box/BoxSlot';
import { CCInteger } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'ProgressBoxSlot' )
export class ProgressBoxSlot extends Component
{

    @property([CCInteger])
    private lockCounts: number[] = [];

    private listLockingBoxSlot: BoxSlot[] = [];
    private boxContainer: BoxContainer = null;
    protected start (): void
    {
        this.boxContainer = this.node.getComponent( BoxContainer );
    }
   
    public initLockBoxSlot ()
    {
        for ( let i = 0; i < this.lockCounts.length; i++ )
        {
            if ( this.lockCounts[ i ] > 0 )
            {
                let boxSlot = this.boxContainer.BoxSlots[ i ];
                boxSlot.IsBlockByChain = false;
                boxSlot.IsInProgress = true;
                boxSlot.TotalLockedCount = this.lockCounts[ i ];
                boxSlot.boxAdsPrefab.active = true;
                boxSlot.LockText.node.active = true;
                boxSlot.LockText.string = boxSlot.CurrentLockedCount.toString() + '/' + boxSlot.TotalLockedCount.toString();
                this.listLockingBoxSlot.push( boxSlot );
            }
        }
    }

    public onBoxComplete ()
    {
        if ( this.listLockingBoxSlot.length > 0 )
        {
            let boxSlot = this.listLockingBoxSlot[0];
            boxSlot.CurrentLockedCount++;
            if ( boxSlot.CurrentLockedCount < boxSlot.TotalLockedCount )
            {
                boxSlot.LockText.string = boxSlot.CurrentLockedCount.toString() + '/' + boxSlot.TotalLockedCount.toString();
            }
            else
            {
                boxSlot.LockText.node.active = false;
                boxSlot.IsInProgress = false;
                boxSlot.boxAdsPrefab.active = false;
                boxSlot.LockAnim.setAnimation( 0, 'Unlock', false );
                this.listLockingBoxSlot.shift();
            }
        }
    }

}


