import React from "react";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
    <div className="hero min-h-[calc(100vh-200px)] bg-gradient-to-br from-primary/10 to-secondary/10 px-4 sm:px-6 lg:px-8">
      <div className="hero-content text-center w-full max-w-none">
        <div className="max-w-6xl mx-auto w-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            AI Journalist
          </h1>
          <p className="py-4 sm:py-6 text-base sm:text-lg md:text-xl text-base-content/80 max-w-3xl mx-auto px-4">
            Transform any topic into comprehensive, well-researched articles
            with the power of artificial intelligence. Get instant,
            professional-quality content tailored to your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <Link
              to="/generate"
              className="btn btn-primary btn-md sm:btn-lg text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
            >
              Try Now
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <button className="btn btn-outline btn-md sm:btn-lg px-6 sm:px-8 py-2 sm:py-3 rounded-full w-full sm:w-auto">
              Learn More
            </button>
          </div>

          {/* Feature highlights */}
          <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 px-4">
            <div className="card bg-base-100/50 backdrop-blur-sm shadow-md">
              <div className="card-body items-center text-center p-4 sm:p-6">
                <div className="mb-3 sm:mb-4">
                  <div className="bg-primary text-primary-content rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="card-title text-base sm:text-lg">
                  Lightning Fast
                </h3>
                <p className="text-xs sm:text-sm">
                  Generate comprehensive articles in seconds, not hours.
                </p>
              </div>
            </div>

            <div className="card bg-base-100/50 backdrop-blur-sm shadow-md">
              <div className="card-body items-center text-center p-4 sm:p-6">
                <div className="mb-3 sm:mb-4">
                  <div className="bg-secondary text-secondary-content rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="card-title text-base sm:text-lg">
                  High Quality
                </h3>
                <p className="text-xs sm:text-sm">
                  Professional-grade content with proper research and citations.
                </p>
              </div>
            </div>

            <div className="card bg-base-100/50 backdrop-blur-sm shadow-md">
              <div className="card-body items-center text-center p-4 sm:p-6">
                <div className="mb-3 sm:mb-4">
                  <div className="bg-accent text-accent-content rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="card-title text-base sm:text-lg">
                  Customizable
                </h3>
                <p className="text-xs sm:text-sm">
                  Tailor the tone, style, and depth to match your requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
