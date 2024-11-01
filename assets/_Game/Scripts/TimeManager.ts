import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TimeManager')
export class TimeManager extends Component {
    @property({ type: Number })
    public timescale: number = 1;

}
