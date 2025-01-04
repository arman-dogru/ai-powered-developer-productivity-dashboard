import React, { useContext } from 'react';
import { UserContext } from '../../UserContext';

const Profile = () => {
  const { user } = useContext(UserContext);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ margin: '20px' }}>
      <h1>Your Profile</h1>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Display Name:</strong> {user.displayName}</p>
      <p><strong>GitHub Profile:</strong> <a href={user.profileUrl} target="_blank" rel="noopener noreferrer">{user.profileUrl}</a></p>
      <div>
        <strong>Photos:</strong>
        {user.photos && user.photos.map((url, index) => (
          <img key={index} src={url} alt="avatar" style={{ width: '50px', margin: '5px' }} />
        ))}
      </div>
    </div>
  );
};

export default Profile;