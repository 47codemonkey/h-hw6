import { useMainComponent } from './hook';

import './mainComponent.css';

export const MainComponent = () => {
  const {
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
  } = useMainComponent();

  return (
    <>
      <h1>Let's Get Ready to Rumble</h1>
      <div className="wrapper1">
        {!userOneData && (
          <form
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              fetchData(usernameOne, setUserOneData, setErrorOne);
            }}
          >
            <label>Choose Player 1 username:</label>
            <input
              type="text"
              value={usernameOne}
              onChange={(e) => setUsernameOne(e.target.value)}
              placeholder="Enter username"
              required
            />
            <button className="submit-btn" type="submit">
              Submit
            </button>
          </form>
        )}
        {!userTwoData && (
          <form
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              fetchData(usernameTwo, setUserTwoData, setErrorTwo);
            }}
          >
            <label>Choose Player 2 username:</label>
            <input
              type="text"
              value={usernameTwo}
              onChange={(e) => setUsernameTwo(e.target.value)}
              placeholder="Enter username"
              required
            />
            <button className="submit-btn" type="submit">
              Submit
            </button>
          </form>
        )}
      </div>

      <div className="userData">
        {userOneData && renderUserData(userOneData, errorOne)}
        {userTwoData && renderUserData(userTwoData, errorTwo)}
      </div>

      <div className="wrapper2">
        {userOneData && userTwoData && !battleStarted && (
          <button type="button" onClick={handleBattle}>
            Battle!
          </button>
        )}
        {battleStarted && (
          <button type="button" onClick={handleRestart}>
            Restart
          </button>
        )}
      </div>
    </>
  );
};
