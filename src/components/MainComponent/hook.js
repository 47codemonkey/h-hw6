import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const useMainComponent = () => {
  const [usernameOne, setUsernameOne] = useState('');
  const [usernameTwo, setUsernameTwo] = useState('');
  const [userOneData, setUserOneData] = useState(null);
  const [userTwoData, setUserTwoData] = useState(null);
  const [errorOne, setErrorOne] = useState(false);
  const [errorTwo, setErrorTwo] = useState(false);
  const [battleStarted, setBattleStarted] = useState(false);
  const [battleResult, setBattleResult] = useState('');

  useEffect(() => {
    const renderWinnerLabel = (user, isWinner) => {
      if (user && isWinner) {
        return <p className="winnerInfo">Winner</p>;
      } else if (user && !isWinner && battleStarted && battleResult !== "It's a tie!") {
        return <p className="loserInfo">Loser</p>;
      }
      return null;
    };

    setUserOneData((prevState) => {
      if (prevState) {
        return { ...prevState, winnerLabel: renderWinnerLabel(prevState, prevState.login === battleResult) };
      }
      return prevState;
    });

    setUserTwoData((prevState) => {
      if (prevState) {
        return { ...prevState, winnerLabel: renderWinnerLabel(prevState, prevState.login === battleResult) };
      }
      return prevState;
    });
  }, [battleResult, battleStarted]);

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
    try {
      const [userOneResponse, userTwoResponse] = await Promise.all([
        axios.get(`https://api.github.com/users/${usernameOne}`),
        axios.get(`https://api.github.com/users/${usernameTwo}`),
      ]);

      setUserOneData(userOneResponse.data);
      setUserTwoData(userTwoResponse.data);
      setErrorOne(false);
      setErrorTwo(false);

      calculateBattleResult();
    } catch (error) {
      console.error(error);
      setErrorOne(true);
      setErrorTwo(true);
    }
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

  const renderUserData = (userData, error) => {
    if (error) {
      return <p>Username not exist</p>;
    }
    if (userData) {
      return (
        <form className="wrapper4" onSubmit={(e) => e.preventDefault()}>
          <div className="wrapper3">
            {userData.winnerLabel}
            {battleResult === "It's a tie!" && <p className="tieInfo">It's a tie!</p>}
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
          {!battleStarted && (
            <button type="button" onClick={handleReset}>
              Reset
            </button>
          )}
        </form>
      );
    }
    return null;
  };

  return {
    usernameOne,
    setUsernameOne,
    usernameTwo,
    setUsernameTwo,
    userOneData,
    setUserOneData,
    userTwoData,
    setUserTwoData,
    errorOne,
    setErrorOne,
    errorTwo,
    setErrorTwo,
    battleStarted,
    fetchData,
    renderUserData,
    handleRestart,
    handleBattle,
  };
};
