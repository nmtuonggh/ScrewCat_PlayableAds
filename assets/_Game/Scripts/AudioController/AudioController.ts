import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
import * as exp from 'constants';
const { ccclass, property } = _decorator;

@ccclass( 'AudioController' )
export class AudioController extends Component
{
    @property( AudioClip )
    public audioClip: AudioClip[] = [];
    @property( AudioClip )
    public audioComplete: AudioClip[] = [];

    @property( AudioSource )
    public audioSource: AudioSource = null;

    @property( AudioSource )
    public bg: AudioSource = null;
    @property( AudioSource )
    public Chain: AudioSource = null;

    private static _instance: AudioController = null;

    public static get Instance (): AudioController
    {
        return this._instance;
    }

    protected onLoad (): void
    {
        if ( AudioController._instance === null )
        {
            AudioController._instance = this;
        }
        //this.PlayerBG( );
    }

    public PlayAudio ( type: AudioType )
    {
        this.audioSource.clip = this.audioClip[ type ];
        this.audioSource.playOneShot(this.audioSource.clip);
    }

    public PlayMewoComplete (){
        const index = Math.floor(Math.random() * this.audioComplete.length);
        this.audioSource.clip = this.audioComplete[ index ];
        this.audioSource.playOneShot(this.audioSource.clip);
    }

    public PlayerBG(){
        this.bg.play();
    }

    public PlayChain(){
        this.Chain.play();
    }
}

export enum AudioType
{
    screwIn = 0,
    screwOut = 1,
    boxComplete = 2,
    lose = 3,
    chainVibrate = 4,
    unlockChain = 5,
}



