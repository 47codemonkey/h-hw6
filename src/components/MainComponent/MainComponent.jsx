import React, { useState } from 'react';

import axios from 'axios';

import './mainComponent.css';

export const MainComponent = () => {
  const [usernameOne, setUsernameOne] = useState('');
  const [usernameTwo, setUsernameTwo] = useState('');
  const [userOneData, setUserOneData] = useState(null);
  const [userTwoData, setUserTwoData] = useState(null);
  const [errorOne, setErrorOne] = useState(false);
  const [errorTwo, setErrorTwo] = useState(false);
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
    await fetchData(usernameOne, setUserOneData, setErrorOne);
    await fetchData(usernameTwo, setUserTwoData, setErrorTwo);
    calculateBattleResult();
  };

  const calculateBattleResult = () => {
    if (userOneData && userTwoData) {
      const userOneScore = userOneData.followers + userOneData.public_repos;
      const userTwoScore = userTwoData.followers + userTwoData.public_repos;
      if (userOneScore > userTwoScore) {
        setBattleResult(userOneData.login);
      } else if (userOneScore < userTwoScore) {
        setBattleResult(userTwoData.login);
      } else {
        setBattleResult("It's a tie!");
      }
    }
  };

  const handleRestart = () => {
    setUsernameOne('');
    setUsernameTwo('');
    setUserOneData(null);
    setUserTwoData(null);
    setErrorOne(false);
    setErrorTwo(false);
    setBattleStarted(false);
    setBattleResult('');
  };

  const handleReset = () => {
    setUserOneData(null);
    setUserTwoData(null);
    setErrorOne(false);
    setErrorTwo(false);
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
        {!userOneData && (
          <div className="form">
            <label>Choose Player 1 username:</label>
            <input
              type="text"
              value={usernameOne}
              onChange={(e) => setUsernameOne(e.target.value)}
              placeholder="Enter username"
            />
            <button className="submit-btn" onClick={() => fetchData(usernameOne, setUserOneData, setErrorOne)}>
              Submit
            </button>
          </div>
        )}
        {!userTwoData && (
          <div className="form">
            <label>Choose Player 2 username:</label>
            <input
              type="text"
              value={usernameTwo}
              onChange={(e) => setUsernameTwo(e.target.value)}
              placeholder="Enter username"
            />
            <button className="submit-btn" onClick={() => fetchData(usernameTwo, setUserTwoData, setErrorTwo)}>
              Submit
            </button>
          </div>
        )}
      </div>

      <div className="userData">
        {userOneData && renderUserData(userOneData, errorOne, userOneData.login === battleResult)}
        {userTwoData && renderUserData(userTwoData, errorTwo, userTwoData.login === battleResult)}
      </div>

      <div className="wrapper2">
        {userOneData && userTwoData && !battleStarted && <button onClick={handleBattle}>Battle!</button>}
        {battleStarted && <button onClick={handleRestart}>Restart</button>}
      </div>
    </>
  );
};
