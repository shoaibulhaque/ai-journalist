import React, { useState, useEffect } from "react";

interface JobStatus {
  job_id: string;
  status: string;
  result?: {
    summary: string;
    audio_url?: string;
  };
}

const GenerateReportPage: React.FC = () => {
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Simulate progress when generating
  useEffect(() => {
    if (jobStatus?.status === "processing") {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev; // Don't go to 100% until actually complete
          return prev + Math.random() * 10;
        });
      }, 1000);
      return () => clearInterval(interval);
    } else if (jobStatus?.status === "complete") {
      setProgress(100);
    }
  }, [jobStatus?.status]);

  // Poll for job status
  useEffect(() => {
    if (jobStatus?.job_id && jobStatus.status === "processing") {
      const pollInterval = setInterval(async () => {
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/report_status/${jobStatus.job_id}`,
            {
              method: "POST",
            }
          );
          if (response.ok) {
            const data = await response.json();
            setJobStatus(data);
            if (data.status === "complete") {
              setIsLoading(false);
            }
          }
        } catch (error) {
          console.error("Error polling job status:", error);
        }
      }, 2000);

      return () => clearInterval(pollInterval);
    }
  }, [jobStatus?.job_id, jobStatus?.status]);

  // Initialize audio when result is available
  useEffect(() => {
    if (jobStatus?.result?.audio_url) {
      const audioElement = new Audio(
        `http://127.0.0.1:8000${jobStatus.result.audio_url}`
      );

      audioElement.addEventListener("loadedmetadata", () => {
        setDuration(audioElement.duration);
      });

      audioElement.addEventListener("timeupdate", () => {
        setCurrentTime(audioElement.currentTime);
      });

      audioElement.addEventListener("ended", () => {
        setIsPlaying(false);
      });

      setAudio(audioElement);

      return () => {
        audioElement.pause();
        audioElement.removeEventListener("loadedmetadata", () => {});
        audioElement.removeEventListener("timeupdate", () => {});
        audioElement.removeEventListener("ended", () => {});
      };
    }
  }, [jobStatus?.result?.audio_url]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setProgress(0);
    setJobStatus(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/generate_report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      if (response.ok) {
        const data = await response.json();
        setJobStatus({ job_id: data.job_id, status: "processing" });
      } else {
        throw new Error("Failed to start report generation");
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
      // Show error toast or notification
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const togglePlayPause = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    }
  };

  const seekBackward = () => {
    if (audio) {
      audio.currentTime = Math.max(0, audio.currentTime - 10);
    }
  };

  const seekForward = () => {
    if (audio) {
      audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
    }
  };

  const handleVolumeChange = (volume: number) => {
    if (audio) {
      audio.volume = volume;
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] bg-base-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-base-content mb-2">
            AI Journalist
          </h1>
          <div className="flex justify-end">
            <div className="avatar placeholder">
              <div className="bg-error text-error-content rounded-full w-8 h-8 sm:w-10 sm:h-10">
                <span className="text-xs">!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Topic Input Form */}
        <div className="card bg-base-100 shadow-xl mb-6 sm:mb-8">
          <div className="card-body p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
              Enter Topic Here
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <input
                  type="text"
                  placeholder="Enter Topic Here"
                  className="input input-bordered w-full text-base sm:text-lg h-12 sm:h-14"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="form-control">
                <button
                  type="submit"
                  className={`btn btn-primary w-full h-12 sm:h-14 text-base sm:text-lg ${
                    isLoading ? "loading" : ""
                  }`}
                  disabled={isLoading || !topic.trim()}
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      Generate Report
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Job Status Section */}
        {jobStatus && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">
                Job Status
              </h2>

              {/* Progress Bar */}
              <div className="mb-4 sm:mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs sm:text-sm font-medium">
                    {jobStatus.status === "processing"
                      ? "Generating Article..."
                      : "Complete"}
                  </span>
                  <span className="text-xs sm:text-sm text-base-content/60">
                    {Math.round(progress)}%
                  </span>
                </div>
                <progress
                  className="progress progress-primary w-full h-2 sm:h-3"
                  value={progress}
                  max="100"
                ></progress>
              </div>

              {/* Audio Controls */}
              <div className="bg-base-200 rounded-lg p-3 sm:p-4">
                {/* Waveform Visualization */}
                <div className="flex items-center justify-center h-16 sm:h-20 mb-3 sm:mb-4">
                  <div className="flex items-end space-x-0.5 sm:space-x-1">
                    {[...Array(window.innerWidth < 640 ? 15 : 20)].map(
                      (_, i) => (
                        <div
                          key={i}
                          className={`bg-primary rounded-sm transition-all duration-300 ${
                            isPlaying ? "animate-pulse" : ""
                          }`}
                          style={{
                            width: window.innerWidth < 640 ? "2px" : "3px",
                            height: `${Math.random() * 30 + 8}px`,
                            opacity:
                              duration > 0 && i < (currentTime / duration) * 20
                                ? 1
                                : 0.3,
                          }}
                        />
                      )
                    )}
                  </div>
                </div>

                {/* Time Display */}
                <div className="flex justify-between text-xs sm:text-sm text-base-content/60 mb-3 sm:mb-4">
                  <span>{formatTime(Math.floor(currentTime))}</span>
                  <span>{formatTime(Math.floor(duration))}</span>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center space-x-2 sm:space-x-4">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() =>
                      handleVolumeChange(audio?.volume === 0 ? 1 : 0)
                    }
                    disabled={!audio}
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728"
                      />
                    </svg>
                  </button>

                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={seekBackward}
                    disabled={!audio}
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <button
                    className="btn btn-primary btn-circle btn-sm sm:btn-md"
                    onClick={togglePlayPause}
                    disabled={!audio || jobStatus.status !== "complete"}
                  >
                    {isPlaying ? (
                      <svg
                        className="w-4 h-4 sm:w-6 sm:h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 9v6m4-6v6"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4 sm:w-6 sm:h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>

                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={seekForward}
                    disabled={!audio}
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>

                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      if (audio) {
                        const link = document.createElement("a");
                        link.href = `http://127.0.0.1:8000${jobStatus?.result?.audio_url}`;
                        link.download = `ai-journalist-${jobStatus?.job_id}.mp3`;
                        link.click();
                      }
                    }}
                    disabled={!audio || !jobStatus?.result?.audio_url}
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Result Display */}
              {jobStatus.result && (
                <div className="mt-4 sm:mt-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                    Generated Report
                  </h3>
                  <div className="bg-base-200 rounded-lg p-3 sm:p-4">
                    <p className="text-sm sm:text-base text-base-content/80 leading-relaxed">
                      {jobStatus.result.summary}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateReportPage;
