import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { getSpotDetailThunk } from "../../../store/spots";
import { useParams, Link } from "react-router-dom";

export default function SpotDetail() {
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots.singleSpot);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { spotId } = useParams();
  const sessionUser = useSelector((state) => state.session.user);


  useEffect(() => {
    // dispatch(getSpotDetailThunk(spotId));
  }, [dispatch, spotId]);

  const goToNextSlide = () => {
    setCurrentIndex((currentIndex + 1) % spot.SpotImages?.length);
  };

  const goToPrevSlide = () => {
    setCurrentIndex(
      (currentIndex - 1 + spot.SpotImages?.length) % spot.SpotImages?.length
    );
  };

  if (!spot.id) return null;

  const displayEditBtn = () => sessionUser && sessionUser.id === spot.userId;
  console.log("spot: ", spot)

  return (
    <div className="single-spot-main-container">
      <div className="single-spot-inner-container">
        <Link className="single-spot-upper-inner-left-container" to="/">
          <div className="material-symbols-outlined-container">
            <span
              className="material-symbols-outlined"
              id="material-symbols-outlined"
            >
              arrow_back
            </span>
          </div>
        </Link>

        <div className="single-spot-upper-inner-right-container">
          <div className="single-spot-upper-left-container">
            <img
              src={spot.SpotImages[currentIndex]?.url}
              alt={spot.name}
            />
            <div onClick={goToPrevSlide} className="spotDetail-arrow-back">
              <span
                className="material-symbols-outlined"
                id="material-symbols-arrow_back_ios_new"
              >
                arrow_back_ios_new
              </span>
            </div>
            <div onClick={goToNextSlide} className="spotDetail-arrow-next">
              <span
                className="material-symbols-outlined"
                id="material-symbols-navigate_next"
              >
                navigate_next
              </span>
            </div>
          </div>

          <div className="single-spot-upper-right-container">
            <div className="single-spot-upper-right-inner-container-top">
              <h2 className="single-spot-name">{spot.name}</h2>

              <div className="user-info-container">
                <div className="single-spot-user-info-left-container">
                  <div className="single-spot-user-profile">
                    {spot.creatorName[0]}
                  </div>

                  <div className="single-spot-user-info-container">
                    <div className="single-spot-user-name">
                      {spot.creatorName}
                    </div>
                  </div>
                </div>
                {displayEditBtn() && (
                  <Link
                    className="edit-spot"
                    to={`/spotForm/edit/${spot.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <span className="material-symbols-outlined">
                      edit
                    </span>
                  </Link>
                )}
              </div>

              <div className="single-spot-image-info-container">
                <div
                  className={`single-spot-image-description ${isExpanded ? "expanded" : "collapsed"}`}
                >
                  <strong>About:</strong>{" "}
                  {isExpanded
                    ? spot.description
                    : spot.description.slice(0, 100)}
                </div>
                {spot.description.length > 100 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="single-spot-description-expand-option"
                  >
                    {isExpanded ? "Show Less" : "Show More"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
