import { _decorator, Component, Node } from 'cc';
import { HoleColor } from '../Hole/HoleColor';
const { ccclass, property } = _decorator;

@ccclass('HoleContainer')
export class HoleContainer extends Component {
    @property({ type: HoleColor })
    protected _holes: HoleColor[] = [];

    protected onload (): void {
        this._holes = this.getComponentsInChildren(HoleColor);
    }
}


