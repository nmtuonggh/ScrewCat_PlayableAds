import { _decorator, Component, Node } from 'cc';
import { PlayableAdsManager } from 'db://assets/PA_iKame (1)/base-script/PlayableAds/PlayableAdsManager';
const { ccclass, property } = _decorator;

@ccclass('ForceStoreUI')
export class ForceStoreUI extends Component {
    public onClick()
    {
        PlayableAdsManager.Instance().ForceOpenStore();
    }
}


