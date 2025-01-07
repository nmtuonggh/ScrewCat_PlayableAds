import { _decorator, Component, Node } from 'cc';
import { BoxContainer } from './BoxContainer';
import { CCBoolean } from 'cc';
import { BoxSlot } from '../GameComponent/HoleContainer/Box/BoxSlot';
import { CCInteger } from 'cc';
import { tween } from 'cc';
import { Vec3 } from 'cc';
import { Prefab } from 'cc';
import { instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'ProgressBoxSlot' )
export class ProgressBoxSlot extends Component
{
    @property( Prefab )
    private addCountPrefab: Prefab = null;
    @property( [ CCInteger ] )
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

    public onBoxComplete ( node: Node )
{
    for (let i = 0; i < this.listLockingBoxSlot.length; i++)
    {
        let boxSlot = this.listLockingBoxSlot[i];
        boxSlot.CurrentLockedCount++;
        if ( boxSlot.CurrentLockedCount < boxSlot.TotalLockedCount )
        {
            let countNode = instantiate( this.addCountPrefab );
            countNode.parent = this.node;
            countNode.worldPosition = node.getWorldPosition();
            tween( countNode )
                .to( 0.5, { worldPosition: boxSlot.node.getWorldPosition() }, { easing: 'sineOut' } )
                .call( () =>
                {
                    countNode.destroy();
                    tween( boxSlot.LockText.node )
                        .to( 0.25, { scale: new Vec3( 1.2, 1.2, 1.2 ) }, { easing: 'sineOut' } )
                        .to( 0.25, { scale: new Vec3( 1, 1, 1 ) }, { easing: 'sineIn' } )
                        .start();
                    boxSlot.LockText.string = boxSlot.CurrentLockedCount.toString() + '/' + boxSlot.TotalLockedCount.toString();
                } )
                .start();
        }
        else
        {
            boxSlot.LockText.node.active = false;
            boxSlot.IsInProgress = false;
            boxSlot.boxAdsPrefab.active = false;
            boxSlot.LockAnim.setAnimation( 0, 'Unlock', false );
            this.listLockingBoxSlot.splice(i, 1);
            i--; // Adjust index after removal
        }
    }
}

}


