import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { TokenRequest } from "../AxiosCreate";
import ReactPlayer from "react-player";
import "./ClassVideo.css";
import { AiFillHome } from "react-icons/ai";
import { PlayCircle, PauseCircle, Volume2, Maximize, Minimize } from "lucide-react";
import Footer from "./Footer";

function ClassVideo() {
  const location = useLocation();
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [played, setPlayed] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef(null);
  const wrapperRef = useRef(null);

  const initialBatchname = location.state?.batchname || localStorage.getItem("batchname");
  const [batchname, setBatchname] = useState(initialBatchname);

  useEffect(() => {
    if (batchname) {
      localStorage.setItem("batchname", batchname);

      async function fetchVideos() {
        try {
          const response = await TokenRequest.get(`/student/getdatavideos?batchname=${batchname}`);
          setVideos(response.data);
          setSelectedVideo(response.data.length > 0 ? response.data[response.data.length - 1] : null);
        } catch (error) {
          console.error("Error fetching videos:", error);
        }
      }
      fetchVideos();
    }
  }, [batchname]);

  const filteredVideos = searchQuery
    ? videos.filter((video) => video.video_title.toLowerCase().includes(searchQuery.toLowerCase()))
    : videos;

  const handleProgress = (progress) => {
    setPlayed(progress.played);
  };

  const handleScrubChange = (e) => {
    const seekTime = parseFloat(e.target.value);
    setPlayed(seekTime);

    if (playerRef.current) {
      playerRef.current.seekTo(seekTime); // Seek the video to the selected time
    }
  };


  const toggleFullscreen = () => {
    if (wrapperRef.current) {
      if (!isFullscreen) {
        if (wrapperRef.current.requestFullscreen) {
          wrapperRef.current.requestFullscreen();
        } else if (wrapperRef.current.mozRequestFullScreen) { // Firefox
          wrapperRef.current.mozRequestFullScreen();
        } else if (wrapperRef.current.webkitRequestFullscreen) { // Safari
          wrapperRef.current.webkitRequestFullscreen();
        } else if (wrapperRef.current.msRequestFullscreen) { // IE/Edge
          wrapperRef.current.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Safari
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
          document.msExitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  };


  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  return (
    <div>
      <section className="navbar_main_video">
        <div className="inner_div_nav_video">
          <div className="leftnav_video">
            <img src="../../public/logo (1).png" className="logo_nav_video" alt="" />
          </div>
          <div className="rightnav_video">
            <Link style={{ textDecoration: "none" }} to={"/"}>
              <button className="menus_right_video">
                <AiFillHome /> Home page
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="video_displaysec">
        <div className="d-flex flex-column flex-md-row">
          <div className="main-content" ref={wrapperRef}  >
            <h2>{selectedVideo ? selectedVideo.video_title : "Select a Video"}</h2>

            <div className="video-container p-3" ref={playerRef}   >
              {selectedVideo ? (
                <div className="video-wrapper"     >
                  <ReactPlayer
                    url={selectedVideo.video_link}
                    width={isFullscreen ? "100%" : "100%"} // Full width for fullscreen
                    height={isFullscreen ? "calc(100vh - 100px)" : "500px"} // Reduced height in fullscreen
                    playing={isPlaying}
                    volume={volume}
                    onProgress={handleProgress}
                    pip={false}
                    controls={false}
                    config={{
                      youtube: {
                        playerVars: {
                          modestbranding: 1,
                          controls: 0,
                          showinfo: 0,
                          rel: 0,
                          iv_load_policy: 3,
                          fs: 0,
                          disablekb: 1,
                        },
                      },
                    }}
                    onContextMenu={(e) => e.preventDefault()}
                    controlsList="nodownload"
                  />


                  <div className="custom-controls">
                    {/* Play/Pause Button */}
                    <button onClick={() => setIsPlaying(!isPlaying)} className="control-btn">
                      {isPlaying ? <PauseCircle size={24} /> : <PlayCircle size={24} />}
                    </button>

                    {/* Volume Control */}
                    <div className="volume-control">
                      <Volume2 size={20} />
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step="0.01"
                        value={played} 
                        onChange={handleScrubChange}
                        className="timeline-slider"
                      />
                    </div>

                    {/* Timeline Scrubber */}
                    <div className="timeline">
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step="0.01"
                        value={played}
                        onChange={handleScrubChange}
                        className="timeline-slider"
                      />
                    </div>

                    {/* Fullscreen Toggle */}
                    <button onClick={toggleFullscreen} className="control-btn">
                      {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
                    </button>
                  </div>

                  {/* Shield */}
                  <div className="video-shield" />
                </div>
              ) : (
                <p>Loading videos...</p>
              )}
            </div>
          </div>

          <div className="sidebar p-10">
            <h4 className="mb-3">Course Content</h4>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control mb-3"
              placeholder="Search by video title or date"
            />
            <ul className="list-group">
              {filteredVideos.length > 0 ? (
                filteredVideos.map((video, index) => (
                  <li key={index} className="list-group-item">
                    <a
                      href="#"
                      className="text-decoration-none"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedVideo(video);
                      }}
                    >
                      {video.video_title}
                    </a>
                  </li>
                ))
              ) : (
                <p>No videos found with the selected title.</p>
              )}
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ClassVideo;