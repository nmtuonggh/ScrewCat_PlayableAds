import { _decorator, Component, Node } from 'cc';
import { CahedContainer } from '../Controller/CahedContainer';
import { CCInteger } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BoosterControll')
export class BoosterControll extends Component 
{
    @property(CCInteger)
    public addHoleBoosterCount: number = 0;

    private cachedContainer: CahedContainer = null;

    protected start (): void
    {
        this.cachedContainer = CahedContainer.Instance;
    }
    
    public BoosterAddNewHole(): void
    {
        if(this.cachedContainer.AddNewHole(this.addHoleBoosterCount) != null && this.addHoleBoosterCount > 0)
        {
            console.log("Add new hole");
            this.addHoleBoosterCount--;
        }
        else
        {
            console.log("Can't add new hole");
        }

    }
}


