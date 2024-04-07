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
  const [battleResult, setBattleResult] = useState('');

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
    calculateBattleResult();
  };

  const calculateBattleResult = () => {
    if (user1Data && user2Data) {
      const user1Score = user1Data.followers + user1Data.public_repos;
      const user2Score = user2Data.followers + user2Data.public_repos;
      if (user1Score > user2Score) {
        setBattleResult(user1Data.login);
      } else if (user1Score < user2Score) {
        setBattleResult(user2Data.login);
      } else {
        setBattleResult("It's a tie!");
      }
    }
  };

  const handleRestart = () => {
    setUsername1('');
    setUsername2('');
    setUser1Data(null);
    setUser2Data(null);
    setError1(false);
    setError2(false);
    setBattleStarted(false);
    setBattleResult('');
  };

  const handleReset = () => {
    setUser1Data(null);
    setUser2Data(null);
    setError1(false);
    setError2(false);
  };

  const renderUserData = (userData, error, isWinner) => {
    if (error) {
      return <p>Username not exist</p>;
    }
    if (userData) {
      return (
        <div className="wrapper4">
          <div className="wrapper3">
            {isWinner && <p className="winnerInfo">WINNER</p>}
            {battleResult === "It's a tie!" && <p className="tieInfo">It's a tie!</p>}
            {!isWinner && battleStarted && battleResult !== "It's a tie!" && <p className="loserInfo">LOSER</p>}
            <img width="250px" height="250px" src={userData.avatar_url} alt={userData.login} />
            <p>{userData.login}</p>
            {battleStarted && (
              <>
                <p>Followers: {userData.followers}</p>
                <p>Repositories stars: {userData.public_repos}</p>
                <p>Total score: {userData.followers + userData.public_repos}</p>
              </>
            )}
          </div>
          {!battleStarted && <button onClick={handleReset}>Reset</button>}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <h1>Let's Get Ready to Rumble</h1>
      <div className="wrapper1">
        {!user1Data && (
          <div className="form">
            <label>Choose Player 1 username:</label>
            <input
              type="text"
              value={username1}
              onChange={(e) => setUsername1(e.target.value)}
              placeholder="Enter username"
            />
            <button className="submit-btn" onClick={() => fetchData(username1, setUser1Data, setError1)}>
              Submit
            </button>
          </div>
        )}
        {!user2Data && (
          <div className="form">
            <label>Choose Player 2 username:</label>
            <input
              type="text"
              value={username2}
              onChange={(e) => setUsername2(e.target.value)}
              placeholder="Enter username"
            />
            <button className="submit-btn" onClick={() => fetchData(username2, setUser2Data, setError2)}>
              Submit
            </button>
          </div>
        )}
      </div>

      <div className="userData">
        {user1Data && renderUserData(user1Data, error1, user1Data.login === battleResult)}
        {user2Data && renderUserData(user2Data, error2, user2Data.login === battleResult)}
      </div>

      <div className="wrapper2">
        {user1Data && user2Data && !battleStarted && <button onClick={handleBattle}>Battle!</button>}
        {battleStarted && <button onClick={handleRestart}>Restart</button>}
      </div>
    </>
  );
};
