import { _decorator, Component, Node } from 'cc';
import { CahedContainer } from '../Controller/CahedContainer';
const { ccclass, property } = _decorator;

@ccclass('BoosterControll')
export class BoosterControll extends Component {
    public cachedContainer: CahedContainer = null;

    protected start (): void
    {
        this.cachedContainer = CahedContainer.Instance;
    }
    
    public BoosterAddNewHole(): void
    {
        // if(this.cachedContainer.AddNewHole() != null)
        // {
        //     console.log("Add new hole");
        // }
        // else
        // {
        //     console.log("Can't add new hole");
        // }

    }
}


