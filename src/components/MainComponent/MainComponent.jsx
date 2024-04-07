import axios from 'axios';

import React, { useState } from 'react';

import './mainComponent.css';

export const MainComponent = () => {
  const [username1, setUsername1] = useState('');
  const [username2, setUsername2] = useState('');
  const [user1Data, setUser1Data] = useState(null);
  const [user2Data, setUser2Data] = useState(null);
  const [error1, setError1] = useState(false);
  const [error2, setError2] = useState(false);
  const [battleStarted, setBattleStarted] = useState(false);

  const fetchData = async (username, setUser, setError) => {
    try {
      const response = await axios.get(`https://api.github.com/users/${username}`);
      setUser(response.data);
      setError(false);
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  const handleBattle = async () => {
    setBattleStarted(true);
    await fetchData(username1, setUser1Data, setError1);
    await fetchData(username2, setUser2Data, setError2);
  };

  const handleRestart = () => {
    setUsername1('');
    setUsername2('');
    setUser1Data(null);
    setUser2Data(null);
    setError1(false);
    setError2(false);
    setBattleStarted(false);
  };

  const renderUserData = (userData, error) => {
    if (error) {
      return <p>Username not exist</p>;
    }
    if (userData) {
      return (
        <div>
          <img src={userData.avatar_url} alt={userData.login} />
          <p>{userData.login}</p>
        </div>
      );
    }
    return null;
  };

  const renderResult = () => {
    if (user1Data && user2Data) {
      const user1Score = user1Data.followers + user1Data.public_repos;
      const user2Score = user2Data.followers + user2Data.public_repos;
      if (user1Score > user2Score) {
        return (
          <>
            <p>Winner 🥳</p>
            <p>Loser 🥵</p>
          </>
        );
      } else if (user1Score < user2Score) {
        return (
          <>
            <p>Loser 🥵</p>
            <p>Winner 🥳</p>
          </>
        );
      } else {
        return <p>It's a tie!</p>;
      }
    }
    return null;
  };

  return (
    <>
      <div className="wrapper1">
        <div className="form">
          <label>hahah</label>
          <input
            type="text"
            value={username1}
            onChange={(e) => setUsername1(e.target.value)}
            placeholder="Enter username"
          />
          <button className="submit-btn" onClick={() => fetchData(username1, setUser1Data, setError1)}>
            Submit
          </button>
          {renderUserData(user1Data, error1)}
        </div>
        <div className="form">
          <label>hahah</label>
          <input
            type="text"
            value={username2}
            onChange={(e) => setUsername2(e.target.value)}
            placeholder="Enter username"
          />
          <button className="submit-btn" onClick={() => fetchData(username2, setUser2Data, setError2)}>
            Submit
          </button>
          {renderUserData(user2Data, error2)}
        </div>
      </div>

      <div className="wrapper2">
        {!battleStarted && <button onClick={handleBattle}>Battle!</button>}
        {battleStarted && renderResult()}
        <button onClick={handleRestart}>Restart</button>
      </div>
    </>
  );
};
