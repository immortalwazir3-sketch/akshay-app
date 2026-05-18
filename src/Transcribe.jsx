
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const VoiceAssistant = () => {

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {

    return <span>Browser doesnt support speech recognition.</span>;

  }

  return (

    <div>

      <p>Microphone: {listening ? "on" : "off"}</p>

      <button onClick={() => {
            SpeechRecognition.startListening({ continuous: true, interimResults: true })}}>Start</button>

      <button onClick={SpeechRecognition.stopListening}>Stop</button>

      <button onClick={resetTranscript}>Reset</button>

      <p>{transcript}</p>

    </div>

  );

};

export default VoiceAssistant;