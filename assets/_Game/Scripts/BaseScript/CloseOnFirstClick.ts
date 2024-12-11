import { _decorator, Component, Node } from 'cc';
import { PlayableAdsManager } from '../../../PA_iKame (1)/base-script/PlayableAds/PlayableAdsManager';
const { ccclass, property } = _decorator;

@ccclass('CloseOnFirstClick')
export class CloseOnFirstClick extends Component {
    update(deltaTime: number) {
        if (PlayableAdsManager.Instance().firstClicked) {
            this.node.active = false;
        }
    }
}


