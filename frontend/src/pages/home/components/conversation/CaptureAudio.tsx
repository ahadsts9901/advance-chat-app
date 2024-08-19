import "./main.css"
import { IconButton } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FaMicrophone } from "react-icons/fa";
import { FaStop } from "react-icons/fa";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import WaveSurfer from "wavesurfer.js"
import { formatTime } from "../../../../utils/functions";

const CaptureAudio = ({ setShowAudioRecorder }: any) => {

    const audioRef: any = useRef(null)
    const mediaRecordedRef: any = useRef(null)
    const waveFormRef: any = useRef(null)

    const [isRecording, setIsRecording] = useState<boolean>(false)
    const [recordedAudio, setRecordedAudio] = useState<any>(null)

    const [waveForm, setWaveForm] = useState<any>(null)
    const [recordingDuration, setRecordingDuration] = useState<any>(null)
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [currentPlaybacktime, setCurrentPlaybacktime] = useState<number>(0)
    const [totalDuration, setTotalDuration] = useState<number>(0)

    const [renderedAudio, setRenderedAudio] = useState<any>(null)

    useEffect(() => {

        let interval: any

        if (isRecording) {
            interval = setInterval(() => {
                setRecordingDuration((prevDuration: any) => {
                    setTotalDuration(prevDuration + 1)
                    return prevDuration + 1
                })
            }, 1000)
        }

        return () => {
            clearInterval(interval)
        }

    }, [isRecording])

    useEffect(() => {

        const waveSurfer = WaveSurfer.create({
            container: waveFormRef.current,
            waveColor: "#ccc",
            progressColor: "#4a9eff",
            cursorColor: "#7ae3c3",
            barWidth: 2,
            height: 30,
        })

        setWaveForm(waveSurfer)

        waveSurfer.on("finish", () => {
            setIsPlaying(false)
        })

        return () => {
            waveSurfer.destroy()
        }

    }, [])

    useEffect(() => {

        if (recordedAudio) {

            const updatePlaybackTime = () => {
                setCurrentPlaybacktime(recordedAudio.currentTime)
            }

            recordedAudio.addEventListener("timeupdate", updatePlaybackTime)

            return () => {
                recordedAudio.removeEventListener("timeupdate", updatePlaybackTime)
            }

        }

    }, [recordedAudio])

    const handlePlayRecording = () => {
        if (recordedAudio) {
            waveForm.play();
            recordedAudio.play();
            setIsPlaying(true);
        }
    };

    const handlePauseRecording = () => {
        waveForm.pause();
        recordedAudio.pause();
        setIsPlaying(false);
    };

    const handleStartRecording = () => {

        if (waveForm) {

            navigator.mediaDevices.getUserMedia({ audio: true }).then((stream: any) => {

                setRecordingDuration(0)
                setCurrentPlaybacktime(0)
                setTotalDuration(0)
                setIsRecording(true)

                const mediaRecorder = new MediaRecorder(stream)
                mediaRecordedRef.current = mediaRecorder
                audioRef.current.srcObject = stream

                const chunks: any = []

                mediaRecorder.ondataavailable = (e: any) => {
                    chunks.push(e?.data)
                }

                mediaRecorder.onerror = (e) => {
                    console.error('MediaRecorder error:', e);
                };

                mediaRecorder.onstop = () => {
                    const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" })
                    const audioUrl = URL.createObjectURL(blob)
                    const audio = new Audio(audioUrl)
                    setRecordedAudio(audio)
                    waveForm.load(audioUrl)
                }

                mediaRecorder.start()

            }).catch((error) => {
                console.error(error)
            })

        }

    }

    const handleStopRecording = () => {

        if (mediaRecordedRef.current && isRecording) {

            mediaRecordedRef?.current?.stop()
            setIsRecording(false)
            waveForm?.stop()

            const audioChunks: any = []

            mediaRecordedRef?.current?.addEventListener("dataavailable", (e: any) => {
                audioChunks.push(e?.data)
            })

            mediaRecordedRef?.current?.addEventListener("stop", () => {

                const audioBlob = new Blob(audioChunks, { type: "audio/mp3" })
                const audioFile = new File([audioBlob], "recording.mp3")
                setRenderedAudio(audioFile)

            })

        }

    }

    const sendRecording = async () => { }

    return (
        <>
            <div className="audioRecorder">
                <IconButton onClick={() => {
                    handleStopRecording()
                    setRenderedAudio(null)
                    setRecordedAudio(null)
                    setWaveForm(null)
                    setIsPlaying(false)
                    setCurrentPlaybacktime(0)
                    setTotalDuration(0)
                    setShowAudioRecorder(false)
                }}><FaTrash /></IconButton>
                <>
                    <div className="recording-audio">
                        <>
                            <div className="record-cont">
                                {
                                    !isRecording && !recordedAudio && !isPlaying && <span className="audio-time-format start-recording" onClick={handleStartRecording}>Start recording</span>
                                }
                                {
                                    isRecording ?
                                        <p className="recording">Recording...<span>{formatTime(recordingDuration)}</span></p>
                                        :
                                        <>
                                            {
                                                recordedAudio &&
                                                <>
                                                    {
                                                        isPlaying ?
                                                            <IconButton><FaPause onClick={handlePauseRecording} /></IconButton>
                                                            :
                                                            <IconButton><FaPlay onClick={handlePlayRecording} /></IconButton>
                                                    }
                                                </>
                                            }
                                        </>
                                }
                                <>
                                    <div className="recordedWaves" ref={waveFormRef} hidden={isRecording}>
                                        <audio ref={audioRef} hidden></audio>
                                    </div>
                                    <div>
                                        {
                                            isRecording ?
                                                <IconButton onClick={handleStopRecording}><FaStop /></IconButton>
                                                :
                                                null
                                        }
                                    </div>
                                    {recordedAudio && isPlaying && !isRecording && <span className="audio-time-format">{formatTime(currentPlaybacktime)}</span>}
                                    {
                                        recordedAudio && !isPlaying && !isRecording && <span className="audio-time-format">{formatTime(totalDuration)}</span>
                                    }
                                </>
                            </div>
                            {
                                !isRecording ? <IconButton onClick={handleStartRecording} sx={{ marginRight: "0.5em" }}><FaMicrophone /></IconButton>
                                    :
                                    null
                            }
                        </>
                        <IconButton onClick={sendRecording}><IoMdSend /></IconButton>
                    </div>
                </>
            </div>
        </>
    )
}

export default CaptureAudio