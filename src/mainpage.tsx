import image from './assets/background.jpg'

const MainPage = () => {
    return (
        <div>
            <span style={{ backgroundImage: `url(${image})`, display: 'block', height: '100vh', backgroundSize: 'cover' }} />
        </div>
    )
};
export default MainPage;
