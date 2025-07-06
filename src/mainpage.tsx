import image from './assets/background.jpg';
import { apiFetch } from './api';
import { useAuth } from './AuthContext';

const MainPage = () => {
    const { tokens } = useAuth();

  const handleTrigger = async () => {

    try {
      await apiFetch('azure-sync/trigger', {
        method: 'POST',
      },tokens);
    //   alert('Azure sync initiated!');
    } catch (error) {
      console.error('Azure sync failed:', error);
    //   alert('Azure sync failed');
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100%',
        position: 'relative',
      }}
    >
      <button
        className="trigger"
        onClick={() =>handleTrigger()}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          height: '3vh',
          width: '6vw',
          transform: 'translate(-50%, -50%)',
          cursor: 'pointer',
        }}
      >
        Trigger
      </button>
    </div>
  );
};

export default MainPage;
