import { useState, useEffect } from "react";
import "./Probar.css";
import { useNavigate,useParams } from "react-router-dom";
import returnImg from "../../img/return.svg";
import home from "../../img/home.svg";
import photo from "../../img/photo.svg";
import profile from "../../img/profile.svg";
import messi from '../../img/messi.jpg'
const Probar = () => {
  const navigateTo = useNavigate();
  const { img } = useParams();
  const urlCodificada = encodeURIComponent(img);
  const [stream, setStream] = useState(null);
  const handleTakePic = () => {
    if (stream) {
        const video = document.querySelector('.takePicture');
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        navigateTo(`/result/${urlCodificada}}`, { state: { imageUrl: canvas.toDataURL() } });
      }
  };

  const handleHomeClick = () => {
    navigateTo("/inicio");
  };

  const handleProfileClick = () => {
    navigateTo("/search");
  };

  // Función para iniciar la cámara
  useEffect(() => {
    const iniciarCamara = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(stream);
      } catch (error) {
        console.error("Error al acceder a la cámara:", error);
      }
    };

    iniciarCamara(); // Llama a iniciarCamara() después de que el componente se monte

    // Limpia la función de limpieza para detener la cámara cuando el componente se desmonta
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); // El segundo argumento del useEffect es un array vacío para que se ejecute solo una vez después de que el componente se monte

  return (
    <>
      <section id="Probar">
        <h1>Probar Prenda</h1>
        <video
            autoPlay
            playsInline
            className="takePicture"
            ref={(video) => {
              if (video) video.srcObject = stream;
            }}
          />
        <div className="pictureOptions">
          <img src={messi} alt="" />
          <img src={returnImg} alt="" />
        </div>
      </section>
      <nav id="NavProbar">
        <div className="home" onClick={handleHomeClick}>
          <img src={home} alt="" />
          <h4>Home</h4>
        </div>
        <div className="search" onClick={handleTakePic}>
          <img src={photo} alt="" />
        </div>
        <div className="profile" onClick={handleProfileClick}>
          <img src={profile} alt="" />
          <h4>Profile</h4>
        </div>
      </nav>
    </>
  );
};

export default Probar;
