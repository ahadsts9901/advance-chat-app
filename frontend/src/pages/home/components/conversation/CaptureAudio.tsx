import "./main.css"
import { IconButton } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FaMicrophone } from "react-icons/fa";
import { FaStop } from "react-icons/fa";
import { FaPlay } from "react-icons/fa";
import { FaPauseCircle } from "react-icons/fa";
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
        if (waveForm) handleStartRecording()
    }, [waveForm])

    const handlePlayRecording = () => { }
    const handlePauseRecording = () => { }

    const handleStartRecording = () => {

        setRecordingDuration(0)
        setCurrentPlaybacktime(0)
        setTotalDuration(0)
        setIsRecording(true)

        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream: any) => {

            const mediaRecorder = new MediaRecorder(stream)
            mediaRecordedRef.current = mediaRecorder
            audioRef.current.srcObject = stream

            const chunks: any = []

            mediaRecorder.ondataavailable = (e: any) => chunks.push(e?.data)
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
    const handleStopRecording = () => { }

    const sendRecording = async () => { }

    return (
        <>
            <div className="audioRecorder">
                <IconButton onClick={() => setShowAudioRecorder(false)}><FaTrash /></IconButton>
                {
                    isRecording ?
                        <p className="recording">Recording...<span>{recordingDuration}</span></p>
                        :
                        <>
                            {
                                recordedAudio &&
                                <>
                                    {
                                        isPlaying ?
                                            <IconButton><FaStop onClick={handlePauseRecording} /></IconButton>
                                            :
                                            <IconButton><FaPlay onClick={handlePlayRecording} /></IconButton>
                                    }
                                </>
                            }
                        </>
                }
                <>
                    <div className="recordedWaves" hidden={isRecording} ref={waveFormRef}>
                        {recordedAudio && isPlaying && <span>{formatTime(currentPlaybacktime)}</span>}
                        {
                            recordedAudio && !isPlaying && <span>{formatTime(totalDuration)}</span>
                        }
                        <audio ref={audioRef} hidden></audio>
                        <div>
                            {
                                !isRecording ?
                                    <IconButton onClick={handleStartRecording}><FaMicrophone /></IconButton>
                                    :
                                    <IconButton onClick={handleStopRecording}><FaPauseCircle /></IconButton>
                            }
                        </div>
                    </div>
                </>
                <IconButton onClick={sendRecording}><IoMdSend /></IconButton>
                <IconButton onClick={() => setIsRecording(!isRecording)} sx={{ marginLeft: "auto" }}><FaMicrophone /></IconButton>
            </div>
        </>
    )
}

export default CaptureAudio