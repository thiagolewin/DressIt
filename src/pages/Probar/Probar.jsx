import { useState, useEffect } from "react";
import { Fragment } from "react";
import "./Probar.css";
import { useNavigate,useParams } from "react-router-dom";
import returnImg from "../../img/return.svg";
import home from "../../img/home.svg";
import photo from "../../img/photo.svg";
import profile from "../../img/profile.svg";
import subir from '../../img/subir.png'
const Probar = () => {
  const navigateTo = useNavigate();
  const { img } = useParams();
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [file,setFile] = useState(null)
  const [stream, setStream] = useState(null);
  const selectedHandler = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Leer el archivo y establecer la URL de la imagen para la vista previa
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);

      let video = document.querySelector("video");
      if (video) {
        video.style.display = "none";
      }
    }
  };
  const handleHomeClick = () => {
    navigateTo("/inicio");
  };
  const sendHandler = async  ()=> {
    if(!file) {
      alert('Debes escoger un archivo')
      return
    } 
    const formData = new FormData();
    formData.append('background_url', file); // imageFile es el archivo que quieres subir
    formData.append('garment_url', img);

    fetch("https://dressitnode-uq2eh73iia-uc.a.run.app/api/image/post", {
      method: "POST",
      mode: 'no-cors',
      body: formData
  }).then(res => {
    const blob = res.blob();
    const url = URL.createObjectURL(blob);
    console.log(url)
    console.log(response)
    console.log(blob)
    setImagePreviewUrl(url);
  })

}

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
    {imagePreviewUrl && <img src={imagePreviewUrl} className="ImagenPrenda" />}
        <div className="pictureOptions">
          <div className="contenedor">
          <img src={subir} alt="" />
          <input type="file" className="form-control" onChange={selectedHandler}/>
          </div>
          <div className="contenedor">
          <img src={returnImg} alt="" />
          </div>

        </div>
      </section>
      <nav id="NavProbar">
        <div className="home" onClick={handleHomeClick}>
          <img src={home} alt="" />
          <h4>Home</h4>
        </div>
        <div className="search">
          <img src={photo} alt="" onClick={sendHandler}/>
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
