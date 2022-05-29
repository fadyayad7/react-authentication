import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useToken, useUser } from '../auth/AuthHooks';
import { Api } from '../util/Api';

export const UserInfoPage = () => {
    const user = useUser();
    const [, setToken] = useToken();

    const {id, email, info} = user;

  
    const history = useHistory();


    const [favoriteFood, setFavoriteFood] = useState(info?.favoriteFood ?? '');
    const [hairColor, setHairColor] = useState(info?.hairColor ?? '');
    const [bio, setBio] = useState(info?.bio ?? '');

    
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    useEffect(() => {
        if (showSuccessMessage || showErrorMessage) {
            setTimeout(() => {
                setShowSuccessMessage(false);
                setShowErrorMessage(false);
            }, 3000);
        }
    }, [showSuccessMessage, showErrorMessage]);

    const saveChanges = async () => {
        Api.updateUserInfo(id, {favoriteFood, hairColor, bio})
            .then(res => {
                setToken(res.data.token);
                setShowSuccessMessage(true);
            })
            .catch((err) => setShowErrorMessage(true));
    }

    const logOut = () => {
        localStorage.removeItem('token');
        history.push('/login');
    }
    
    const resetValues = () => {
        setFavoriteFood(info.favoriteFood);
        setHairColor(info.hairColor);
        setBio(info.bio);
    }
    
    return (
        <div className="content-container">
            <h1>Info for {email}</h1>
            {showSuccessMessage && <div className="success">Successfully saved user data!</div>}
            {showErrorMessage && <div className="fail">Uh oh... something went wrong and we couldn't save changes</div>}
            <label>
                Favorite Food:
                <input
                    onChange={e => setFavoriteFood(e.target.value)}
                    value={favoriteFood} />
            </label>
            <label>
                Hair Color:
                <input
                    onChange={e => setHairColor(e.target.value)}
                    value={hairColor} />
            </label>
            <label>
                Bio:
                <input
                    onChange={e => setBio(e.target.value)}
                    value={bio} />
            </label>
            <hr />
            <button onClick={saveChanges}>Save Changes</button>
            <button onClick={resetValues}>Reset Values</button>
            <button onClick={logOut}>Log Out</button>
        </div>
    );
}