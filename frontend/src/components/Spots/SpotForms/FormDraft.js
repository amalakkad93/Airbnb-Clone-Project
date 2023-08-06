import {useState, useEffect} from 'react';
import {useSelector, useDispatch, createDispatchHook} from 'react-redux';
import {useNavigate, useHistory, useParams} from 'react-router-dom';
import {getSpotDetailThunk} from '../../../store/spots';
import {createSpotThunk} from '../../../store/spots';
// import "../spots.css";

export default function SpotForm({formType, spotId, spot}) {
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

  const [errors, setErrors] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [imageUrl2, setImageUrl2] = useState("");
  const [imageUrl3, setImageUrl3] = useState("");
  const [imageUrl4, setImageUrl4] = useState("");
  const [imageUrl5, setImageUrl5] = useState("");
  // const navigate = useNavigate();
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newSpot = { address, city, state, country, lat, lng, name, description, price};
    const newSpotImage = [
      {
        url: previewImage,
        preview: true
      },
      {
        url: imageUrl2,
        preview: false
      },
      {
        url: imageUrl3,
        preview: false
      },
      {
        url: imageUrl4,
        preview: false
      },
      {
        url: imageUrl5,
        preview: false
      }
    ]

    if(formType === "Create") {
      const newlyCreateSpot = await dispatch(createSpotThunk(newSpot, newSpotImage, sessionUser));
      if(newlyCreateSpot) {
        history(`/spots/${newlyCreateSpot.id}`)
      }
  }
}
useEffect(() => {
  if(formType === "Edit") {
    dispatch(getSpotDetailThunk(spotId))
    .then((data) => {
      console.log("data", data)
      setAddress(data.address)
      setCity(data.city)
      setState(data.state)
      setCountry(data.country)
      setLat(data.lat)
      setLng(data.lng)
      setName(data.name)
      setDescription(data.description)
      setPrice(data.price)
    });
  }
},[formType])

  return (
    <div className="form-container">
      <form
      className={formType === "Create" ? "create-form-inner-container" :
      "edit-form-inner-container"}
      onSubmit={handleSubmit}
      >
        <h1>{formType === "Create" ? "Create Spot Form" : "Edit Spot Form"}</h1>
        <div>
          <label
          htmlFor="Country"
          className="label"
          >Country</label>

            <input
            type="text"
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            />
        </div>
        {formType === "Create" &&
        <div className="form-image-input">
          <div>
            <label htmlFor="imageUrl1">Preview Image</label>
            <input
            type="url"
            id="imageUrl1"
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="imageUrl2">Image Url2</label>
            <input
            type="url"
            id="imageUrl2"
            value={imageUrl2}
            onChange={(e) => setImageUrl2(e.target.value)}
            />
            </div>
          <div>
            <label htmlFor="imageUrl3">Image Url3</label>
            <input
            type="url"
            id="imageUrl3"
            value={imageUrl3}
            onChange={(e) => setImageUrl3(e.target.value)}
            />
            </div>
          <div>
            <label htmlFor="imageUrl4">Image Url4</label>
            <input
            type="url"
            id="imageUrl4"
            value={imageUrl4}
            onChange={(e) => setImageUrl4(e.target.value)}
            />
            </div>
          <div>
            <label htmlFor="imageUrl5">Image Url5</label>
            <input
            type="url"
            id="imageUrl5"
            value={imageUrl5}
            onChange={(e) => setImageUrl5(e.target.value)}
            />
            </div>

        </div>
        }
        <div className={formType === "Create" ?
        "create-description-textarea" :
        "edit-description-textarea"}>
          <label htmlFor="description">Describe your place to guests</label>
          <textarea
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={formType === "Edit" ?
          "edit-form-textarea" : ""}
          />
        </div>
        <button
        className='spot-form-btn'
        type="submit"
        >{formType === "Create" ? "Create Sopt" : "Edit Spot"}</button>
      </form>

    </div>
  )

}
