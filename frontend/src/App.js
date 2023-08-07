// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes, Switch } from "react-router-dom";
import SignupFormModal from "./components/SignupFormModal";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import GetAllSpots from "./components/Spots/GetAllSpots";
// import SpotDetail from "./components/Spots/SpotDetail/SpotDetail";
import SpotDetail from "./components/Spots/SpotDetail";
import CreateSpotForm from "./components/Spots/SpotForms/CreateSpotForm";
import EditSpotForm from "./components/Spots/SpotForms/EditSpotForm";
import StarRating from "./components/StarRating/StarRating";
import SpotItem from "./components/Spots/ManageSpot/ManageSpot";
import ManageReviews from "./components/Reviews/ManageReviews/ManageReviews";

// import CreateReviewModal from "./components/Reviews/ReviewForms/CreateReviewModal";
// import EditReviewForm from "./components/Reviews/ReviewForms/EditReviewForm";

import CreateReviewModal from "./components/Reviews/ReviewModals/CreateReviewModal";
// import CreateReviewModal from "./components/AllReviews/CreateReviewModal";

import SpotForm from "./components/Spots/SpotForms/SpotForm";
import DeleteReviewModal from "./components/Reviews/ReviewModals/DeleteReviewModal";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
      <Switch>
      <Route exact path="/" component={GetAllSpots} />
      <Route exact path="/spots/new" component={CreateSpotForm} />
      {/* <Route exact path="/spots/edit/:spotId" component={SpotForm} /> */}
      <Route exact path="/spots/edit/:spotId" component={EditSpotForm} />

      <Route exact path="/reviews/new" component={CreateReviewModal} />
      <Route exact path="/reviews/:reviewId" component={DeleteReviewModal} />
      {/* <Route exact path="/reviews/current" component={ManageReviews} /> */}
      <Route exact path="/spots/:spotId" component={SpotDetail} />
      <Route exact path="/owner/spots" component={SpotItem} />
    </Switch>

      )}
    </>
  );
}
export default App;
