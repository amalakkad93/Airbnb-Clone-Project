import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import {createSpotThunk, getSpotDetailThunk, updateSpotThunk } from '../../../store/spots';



import './CreateSpotForm.css';

export default function SpotForm({ formType, spotId }) {

  const dispatch = useDispatch();
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const [previewImage, setPreviewImage] = useState('');
  const [imageUrl2, setImageUrl2] = useState('');
  const [imageUrl3, setImageUrl3] = useState('');
  const [imageUrl4, setImageUrl4] = useState('');
  const [imageUrl5, setImageUrl5] = useState('');
  const [reloadPage, setReloadPage] = useState(false);
  const [validationObj, setValidationObj] = useState({});
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user);
  const oneSpot = useSelector((state) => state.spots.spotDetail);
  let spotEdit;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imageUrls = [previewImage, imageUrl2, imageUrl3, imageUrl4, imageUrl5];
    const imageExtensionsRegex = /\.(png|jpe?g)$/i;
    const invalidImages = imageUrls.filter((url) => url && !imageExtensionsRegex.test(url));
    if (invalidImages.length > 0) {
      const errorsObj = { ...validationObj };
      invalidImages.forEach((url, index) => {
        const fieldName = index === 0 ? 'previewImage' : `imageUrl${index}`;
        errorsObj[fieldName] = 'Image URL must end in .png, .jpg, or .jpeg';
      });
      setValidationObj(errorsObj);
      return;
    }

    const newSpot = { address, city, state, country, lat, lng, name, description, price };
    let newSpotImage= [];
    const tempNewSpotImage = [
      { url: previewImage, preview: true },
      { url: imageUrl2, preview: false },
      { url: imageUrl3, preview: false },
      { url: imageUrl4, preview: false },
      { url: imageUrl5, preview: false },
    ];

    tempNewSpotImage.forEach((image) => { if (image.url) newSpotImage.push(image); });


    if (formType === 'Create') {
      const newlyCreateSpot = await dispatch(createSpotThunk(newSpot, newSpotImage, sessionUser));
      if (newlyCreateSpot.id) {
        history.push(`/spots/${newlyCreateSpot.id}`);
      } else return null;
    }

    if (formType === 'Edit') {

      // spotEdit = await dispatch(updateSpotThunk());
      try {

        const updatedSpot = { id: spotId, address, city, state, country, lat, lng, name, description, price };
        // const updatedSpot = { address, city, state, country, lat, lng, name, description, price };
        // console.log("***************", updatedSpot)

        const updatedSpotData = await dispatch(updateSpotThunk(updatedSpot));
        if (updatedSpotData) {
          // history.push(`/spots/${spotId}`);
          history.push(`/spots/${updatedSpotData.id}`);
        } else return null;

      } catch (error) {
        console.error("****************Error updating spot:", error.message);
      }
    }

    // const errorsObj = {};
    // if (formType === 'Create') {
    //   if (!address) errorsObj.address = 'Address is required';
    //   if (!city) errorsObj.city = 'City is required';
    //   if (!state) errorsObj.state = 'State is required';
    //   if (!country) errorsObj.country = 'Country is required';
    //   if (!lat) errorsObj.lat = 'Latitude is required';
    //   if (!lng) errorsObj.lng = 'Longitude is required';
    //   if (!name) errorsObj.name = 'Name is required';
    //   if (!description) errorsObj.description = 'Description is required';
    //   if (!price) errorsObj.price = 'Price is required';
    //   if (!previewImage) errorsObj.previewImage = 'Preview Image is required';

    //   setValidationObj(errorsObj);
    // }

  };

  useEffect(() => {
    const errorsObj = {};
    if (formType === 'Create') {
      if (!address) errorsObj.address = 'Address is required';
      if (!city) errorsObj.city = 'City is required';
      if (!state) errorsObj.state = 'State is required';
      if (!country) errorsObj.country = 'Country is required';
      if (!lat) errorsObj.lat = 'Latitude is required';
      if (!lng) errorsObj.lng = 'Longitude is required';
      if (!name) errorsObj.name = 'Name is required';
      if (!description) errorsObj.description = 'Description is required';
      if (!price) errorsObj.price = 'Price is required';
      if (!previewImage) errorsObj.previewImage = 'Preview Image is required';

      setValidationObj(errorsObj);
    }
  }, [address, city, state, country, lat, lng, name, description, price, previewImage]);

  useEffect(() => {
    if (formType === 'Edit') {
      dispatch(getSpotDetailThunk(spotId))
    .then(data => {

        setAddress(data.address);
        setCity(data.city);
        setState(data.state);
        setCountry(data.country);
        setLat(data.lat);
        setLng(data.lng);
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price);
      })
    }
  } , [spotId, formType]);

  const clearImageError = (fieldName) => {
    if (validationObj[fieldName]) {
      setValidationObj((prevState) => ({ ...prevState, [fieldName]: '' }));
    }
  };

  // if(!spotEdit) return null;

  return (
    <div className="form-container">
      <form
        className={formType === 'Create' ? 'create-container' : 'edit-container'}
        onSubmit={handleSubmit}
      >
        <h1>{formType === 'Create' ? 'Create a new Spot' : 'Update your Spot'}</h1>
        <div>
          <div className="div-title">
          <h2>Where is your place located?</h2>
          <p>Guests will only get you exact address once they booked a reservation.</p>
            <div className="error-container">
              <p>Country</p>
              {validationObj.country && <p className="errors">{validationObj.country}</p>}
            </div>
          </div>
          <label htmlFor="Country" className="label"></label>

          <input type="text" id="country"  placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
        </div>
        {/* **************************************************************** */}
        <div className="city-state-container">
          <div className="city-state-input-box">
            <div className="state">
              <div className="error-container">
                <p>City</p>
                {validationObj.city && <p className="errors">{validationObj.city}</p>}
              </div>
              <input type="text" id="state" placeholder="State"  value={state} onChange={(e) => setState(e.target.value)} />
            </div>
            <div className="city">
              <div className="error-container">
                <p>State</p>
                {validationObj.state && <p className="errors">{validationObj.state}</p>}
              </div>
              <input type="text" id="city" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
          </div>
        </div>
        {/* **************************************************************** */}

        <div>
          <div className="div-title">Street Address</div>
          <label htmlFor="Address" className="label"></label>
          {}

          <input type="text" id="address" placeholder="Address"  value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        {/* **************************************************************** */}
        <div className="lat-lng-container">
          <div className="lat-lng-input-box">
            <div className="latitude">
              <div className="error-container">
                <p>latitude</p>
                {validationObj.lat && <p className="errors">{validationObj.lat}</p>}
              </div>
              <input type="text" id="lat" placeholder="latitude" value={lat} onChange={(e) => setLat(e.target.value)} />
            </div>
            <div className="Longitude">
              <div className="error-container">
                <p>Longitude</p>
                {validationObj.lng && <p className="errors">{validationObj.lng}</p>}
              </div>
              <input type="text" id="lng" placeholder="Longitude" value={lng} onChange={(e) => setLng(e.target.value)} />
            </div>
          </div>
        </div>
        {/* **************************************************************** */}
        <div className={formType === 'Create' ? 'create-description-textarea' : 'edit-description-textarea'}>
          <div className="div-title">Describe your place to guests</div>
          <label htmlFor="description"></label>
          <p> mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood</p>
          <textarea
            type="text"
            id="description"
            placeholder="Please write at least 30 characters"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={formType === 'Edit' ? 'edit-form-textarea' : ''}
          />
        </div>
        <div>
          <div className="div-title">Create a title for your spot</div>
          <label htmlFor="Name" className="label"></label>
          <input type="text" id="name" placeholder="Name of your spot" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <div className="div-title">Set a base price for your spot</div>
          <label htmlFor="Price" className="label"></label>
          <div className="price-dollar-sign">
            <div>$</div>
            <input type="text" id="price" placeholder="Price per night (USD)" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
        </div>
        {formType === 'Create' && (
          <div className="form-image-input">
            <div>
              <label htmlFor="previewImage"></label>
              <input
                type="url"
                id="imageUrl1"
                value={previewImage}
                placeholder="Preview Image URL"
                onChange={(e) => {
                  setPreviewImage(e.target.value);
                  clearImageError('previewImage');
                }}
              />
              {validationObj.previewImage && <p className="errors">{validationObj.previewImage}</p>}
            </div>
            <div>
              <label htmlFor="imageUrl2"></label>
              <input
                type="url"
                id="imageUrl2"
                value={imageUrl2}
                placeholder="Image URL"
                onChange={(e) => {
                  setImageUrl2(e.target.value);
                  clearImageError('imageUrl2');
                }}
              />
              {/* {validationObj.imageUrl2 && <p className="errors">{validationObj.imageUrl2}</p>} */}
            </div>
            <div>
              <label htmlFor="imageUrl3"></label>
              <input
                type="url"
                id="imageUrl3"
                value={imageUrl3}
                placeholder="Image URL"
                onChange={(e) => {
                  setImageUrl3(e.target.value);
                  clearImageError('imageUrl3');
                }}
              />
              {/* {validationObj.imageUrl3 && <p className="errors">{validationObj.imageUrl3}</p>} */}
            </div>
            <div>
              <label htmlFor="imageUrl4"></label>
              <input
                type="url"
                id="imageUrl4"
                value={imageUrl4}
                placeholder="Image URL"
                onChange={(e) => {
                  setImageUrl4(e.target.value);
                  clearImageError('imageUrl4');
                }}
              />
              {/* {validationObj.imageUrl4 && <p className="errors">{validationObj.imageUrl4}</p>} */}
            </div>
            <div>
              <label htmlFor="imageUrl5"></label>
              <input
                type="url"
                id="imageUrl5"
                value={imageUrl5}
                placeholder="Image URL"
                onChange={(e) => {
                  setImageUrl5(e.target.value);
                  clearImageError('imageUrl5');
                }}
              />
              {/* {validationObj.imageUrl5 && <p className="errors">{validationObj.imageUrl5}</p>} */}
            </div>
          </div>
        )}
        <button className="spot-form-btn" type="submit" disabled={Object.keys(validationObj).length > 0}>
          Submit
        </button>
      </form>
    </div>
  );
              }
