export class VoiceController {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  private statusElement: HTMLElement;
  private onCommandCallback: (command: string) => void;

  constructor(statusElement: HTMLElement, onCommand: (command: string) => void) {
    this.statusElement = statusElement;
    this.onCommandCallback = onCommand;
    this.setupSpeechRecognition();
  }

  private setupSpeechRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      this.statusElement.textContent = 'Speech recognition not supported';
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      this.isListening = true;
      this.statusElement.textContent = '🎤 Listening for commands...';
      this.statusElement.className = 'listening';
    };

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
      this.statusElement.textContent = `🎯 Heard: "${command}"`;
      this.statusElement.className = 'processing';
      
      this.onCommandCallback(command);
      
      // Reset status after a moment
      setTimeout(() => {
        if (this.isListening) {
          this.statusElement.textContent = '🎤 Listening for commands...';
          this.statusElement.className = 'listening';
        }
      }, 2000);
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.statusElement.textContent = `❌ Error: ${event.error}`;
      this.statusElement.className = '';
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.statusElement.textContent = 'Click anywhere to restart voice control';
      this.statusElement.className = '';
    };
  }

  start() {
    if (this.recognition && !this.isListening) {
      try {
        this.recognition.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        this.statusElement.textContent = 'Failed to start voice control';
      }
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  toggle() {
    if (this.isListening) {
      this.stop();
    } else {
      this.start();
    }
  }
}
