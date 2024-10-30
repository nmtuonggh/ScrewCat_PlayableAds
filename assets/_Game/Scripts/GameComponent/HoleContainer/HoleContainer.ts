import { _decorator, Component, Node } from 'cc';
import { HoleColor } from '../Hole/HoleColor';
const { ccclass, property } = _decorator;

@ccclass('HoleContainer')
export abstract class HoleContainer extends Component {

    @property({ type: HoleColor })
    public listHoles: HoleColor[] = [];
}