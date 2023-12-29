import '@pages/popup/Popup.css';
import useStorage from '@root/src/shared/hooks/useStorage';
import userStorage from '@root/src/shared/storages/userStorage';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import withSuspense from '@src/shared/hoc/withSuspense';

const Popup = () => {
  const { user } = useStorage(userStorage);

  return (
    <div className="flex flex-col w-full h-full p-8 bg-twitch-background text-white">
      {user ? (
        <div className="flex flex-col items-center justify-center w-full h-full text-xl">
          Hello <span className="text-twitch">{user?.login}</span>
          <button className="hover:text-red-400" onClick={() => userStorage.signOut()}>
            Logout ?
          </button>
        </div>
      ) : (
        <button onClick={() => chrome.runtime.sendMessage({ type: 'login' })}>Login</button>
      )}
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Ooops, Error Occured </div>);
