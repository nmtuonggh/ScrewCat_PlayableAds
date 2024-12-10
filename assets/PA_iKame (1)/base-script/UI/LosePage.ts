import { _decorator, Component, Node } from 'cc';
import { TrackingManager } from '../PlayableAds/Tracking/TrackingManager';
import { PlayableAdsManager } from '../PlayableAds/PlayableAdsManager';
const { ccclass, property } = _decorator;

@ccclass( 'LosePage' )
export class LosePage extends Component
{
    protected onEnable (): void
    {
        TrackingManager.LoseLevel();
        setTimeout( () =>
        {
            PlayableAdsManager.Instance().ForceOpenStore();
        }, 3000 );
    }

    public onClick (): void
    {
        PlayableAdsManager.Instance().OpenStore();
    }
}


