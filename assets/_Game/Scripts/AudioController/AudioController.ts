import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'AudioController' )
export class AudioController extends Component
{
    @property( AudioClip )
    public audioClip: AudioClip[] = [];

    @property( AudioSource )
    public audioSource: AudioSource = null;

    @property( AudioSource )
    public bg: AudioSource = null;

    private static _instance: AudioController = null;

    public static get Instance (): AudioController
    {
        if ( this._instance === null )
        {
            this._instance = new AudioController();
        }
        return this._instance;
    }

    protected onLoad (): void
    {
        if ( AudioController._instance === null )
        {
            AudioController._instance = this;
        }
        this.PlayerBG( );
    }

    public PlayAudio ( type: AudioType )
    {
        this.audioSource.clip = this.audioClip[ type ];
        this.audioSource.play();
    }

    public PlayerBG(){
        this.bg.play();
    }
}

export enum AudioType
{
    screwIn = 0,
    screwOut = 1,
    screwInBox = 2,
    boxComplete = 3,
    meow = 4,
    bgm = 5,
}


