import { useEffect, useState } from 'react';
// import spotIndexItem from './spotIndexItem';

import { useDispatch, useSelector } from 'react-redux';
import { getAllSpots, fetchSpots } from '../store/spots';
import { getAllReviews } from '../store/reviews';

const SORT_BY_NAME = "name";
const SORT_BY_RATING = "rating";
const SORT_BY_ASC = 1;
const SORT_BY_DESC = -1;

const SpotIndex = () => {
  const spots = useSelector(getAllSpots);
  const reviews = useSelector(getAllReviews);
  const [sortBy, setSortBy] = useState(SORT_BY_NAME);
  const [sortByDir, setSortByDir] = useState(SORT_BY_ASC);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  let sortedSpots = [];
  for (let idx in spots) {
    const spot = { ...spots[idx] };
    const spotReviews = reviews.filter(review => review.spotId === spot.id);
    const totalStarsRating = spotReviews.reduce((sum, review) => review.rating + sum, 0);
    spot.avgStarsRating = totalStarsRating / spotReviews.length;
    sortedSpots.push(spot);
  }
  if (sortBy === SORT_BY_RATING) {
    sortedSpots.sort((spotA, spotB) => (sortByDir) * (spotA.avgStarsRating - spotB.avgStarsRating));
  } else if (sortBy === SORT_BY_NAME) {
    sortedSpots.sort((spotA, spotB) => sortByDir * (spotA.name < spotB.name ? -1 : 1));
  }

  return (
    <section>
      <ul className="sort">
        Sort Animals By:
        <li
          disabled={sortBy === SORT_BY_RATING}
          onClick={() => setSortBy(SORT_BY_RATING)}
          className={sortBy === SORT_BY_RATING ? " active" : ""}
        >
          Rating
        </li>
        <li
          disabled={sortBy === SORT_BY_NAME}
          onClick={() => setSortBy(SORT_BY_NAME)}
          className={sortBy === SORT_BY_NAME ? " active" : ""}
        >
          Name
        </li>
        <li
          disabled={sortByDir === SORT_BY_ASC}
          onClick={() => setSortByDir(SORT_BY_ASC)}
          className={sortByDir === SORT_BY_ASC ? " active" : ""}
        >
          ASC
        </li>
        <li
          disabled={sortByDir === SORT_BY_DESC}
          onClick={() => setSortByDir(SORT_BY_DESC)}
          className={sortByDir === SORT_BY_DESC ? " active" : ""}
        >
          DESC
        </li>
      </ul>
      <ul>
        {
          sortedSpots.map(spot => (
            <spotIndexItem
              spot={spot}
              key={spot.id}
            />
          ))
        }
      </ul>
    </section>
  );
}

export default SpotIndex;
