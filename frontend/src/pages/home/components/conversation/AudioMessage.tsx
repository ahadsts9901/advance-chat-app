import "./main.css"
import { IconButton } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import WaveSurfer from "wavesurfer.js"
import { FaPause } from "react-icons/fa"
import { FaPlay } from "react-icons/fa6"
import { formatTime } from "../../../../utils/functions"
import fallBackProfileImage from "/default_avatar.png"

const AudioMessage = ({ audioUrl, image }: any) => {

    const waveForm: any = useRef()
    const waveFormRef: any = useRef()

    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [currentPlaybacktime, setCurrentPlaybacktime] = useState<number>(0)
    const [totalDuration, setTotalDuration] = useState<number>(0)
    const [audioMessage, setAudioMessage] = useState<any>(null)

    useEffect(() => {
        if (!waveForm.current && waveFormRef.current) {

            waveForm.current = WaveSurfer.create({
                container: waveFormRef.current,
                waveColor: "#ccc",
                progressColor: "#4a9eff",
                cursorColor: "#7ae3c3",
                barWidth: 2,
                height: 30,
            });

            waveForm.current.on('ready', () => {
                setTotalDuration(waveForm.current.getDuration());
            });

            waveForm.current.on('finish', () => {
                setIsPlaying(false);
            });
        }

    }, []);

    useEffect(() => {

        if (audioMessage) {

            const updatePlaybackTime = () => {
                setCurrentPlaybacktime(audioMessage?.currentTime)
            }

            audioMessage?.addEventListener("timeupdate", updatePlaybackTime)

            return () => {
                audioMessage?.removeEventListener("timeupdate", updatePlaybackTime)
            }

        }

    }, [audioMessage])

    useEffect(() => {

        const audio = new Audio(audioUrl)
        setAudioMessage(audio)
        waveForm?.current?.load(audioUrl)
        waveForm?.current?.on('ready', () => {
            setTotalDuration(waveForm?.current?.getDuration())
        })

        audio?.addEventListener("ended", () => {
            setIsPlaying(false);
            setCurrentPlaybacktime(0);
        });

        return () => {
            audio?.removeEventListener("ended", () => { });
        };

    }, [audioUrl])

    const handlePlayAudio = () => {

        if (audioMessage) {
            waveForm?.current?.stop();
            waveForm?.current?.play();
            audioMessage?.play();
            setIsPlaying(true);
        }
    };

    const handlePauseAudio = () => {
        waveForm?.current?.stop();
        audioMessage?.pause();
        setIsPlaying(false);
    };

    return (
        <>
            <div className="audioMessage">
                <img src={image} alt=""
                    onError={(e: any) => {
                        e.target.src = fallBackProfileImage
                        e.target.style.padding = "0.4em"
                    }}
                />
                <>
                    {
                        audioMessage &&
                        <>
                            {
                                isPlaying ?
                                    <IconButton onClick={handlePauseAudio}><FaPause /></IconButton>
                                    :
                                    <IconButton onClick={handlePlayAudio}><FaPlay /></IconButton>
                            }
                        </>
                    }
                    <div className="waves-recorded" ref={waveFormRef}></div>
                    <div className="recorderTime">{formatTime(isPlaying ? currentPlaybacktime : totalDuration)}</div>
                </>
            </div>
        </>
    )
}

export default AudioMessage