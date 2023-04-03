import React, { useState, useEffect } from 'react';
import { StateMachineProvider, createStore } from 'little-state-machine'; // Para manejar estados globales, como Redux, pero más simple: https://github.com/beekai-oss/little-state-machine
import { Progress, message } from 'antd';
import axios from '../../../../settings/axiosConfig.js';

// Importamos cada paso del registro
import Step1_AccountDetails from './Step1_AccountDetails'; // Paso 1
import Step2_BasicInformation from './Step2_BasicInformation'; // Paso 2
import Step3_SiteInformation from './Step3_SiteInformation'; // Paso 3
import Step4_SitePhotos from './Step4_SitePhotos'; // Paso 3
import Step5_MoreInfoSite from './Step5_MoreInfoSite'; // Paso 

import Stepper from './AddOwner.style';

createStore({}); // Siempre hay que crearlo para que pueda leer el estado guardado en la sessionStorage

// Descripción:
// Componente de registro de usuario, donde controlamos los pasos de registro que debe completar el que va el usuario
// y desplegamos la respectiva pantalla de acuerdo al paso en el que se encuentra (solo son 2 pasos)
const AddOwner = () => {

  // Para ajustar las opciones disponibles
  const [availableElements, setAvailableElements] = useState([]);
  const [availableLocalities, setAvailableLocalities] = useState([]);
  const [availableNeighborhoods, setAvailableNeighborhoods] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);

  // Se ejecuta cada vez que se modifica el valor de count
  useEffect(() => {
    message.destroy()
    const blankMessage = ( // Solución para el navbar de la página no oculte el mensaje desplegado, ya que no cogen los estilos de la componente mensaje (solución chambona pero fue la que funcionó)
      <>
        <br />
        <br />
      </>
    );
    message.info({ content: blankMessage, duration: 20 });
    
    axios.get(`${process.env.REACT_APP_HOST_BACK}/elements`)
      .then((res) => {
        setAvailableElements(res.data);
      }).catch((error) => {
        // message.info({ content: blankMessage, duration: 5 });
        message.error('No se pudieron cargar los elementos inclusivos disponibles', 5);
        // console.error(error)
      });


    axios.get(`${process.env.REACT_APP_HOST_BACK}/getLocations`)
      .then((res) => {
        setAvailableLocalities(res.data);
      }).catch((error) => {
        // message.info({ content: blankMessage, duration: 5 });
        message.error('No se pudieron cargar las localidades disponibles', 5);
        // console.error(error);
      });


    axios.get(`${process.env.REACT_APP_HOST_BACK}/getNeighborhoods`)
      .then((res) => {
        setAvailableNeighborhoods(res.data);
      }).catch((error) => {
        // message.info({ content: blankMessage, duration: 5 });
        message.error('No se pudieron cargar los barrios disponibles', 5);
        // console.error(error)
      });

    axios.get(`${process.env.REACT_APP_HOST_BACK}/getCategories`)
      .then((res) => {
        setAvailableCategories(res.data);
      }).catch((error) => {
        // message.info({ content: blankMessage, duration: 5 });
        message.error('No se pudieron cargar las categorías disponibles', 5);
        // console.error(error)
      });

  }, []);

  let stepComponent; // Para ajustar el paso del registro en el que va el usuario

  const [step, setStep] = useState(1); // Paso = Pantalla de registro

  switch (step) {
    case 1:
      stepComponent = <Step1_AccountDetails setStep={setStep} />;
      break;

    case 2:
      stepComponent = <Step2_BasicInformation setStep={setStep} />;
      break;

    case 3:
      stepComponent = <Step3_SiteInformation setStep={setStep} availableCategories={availableCategories} availableElements={availableElements} />;
      break;

    case 4:
      stepComponent = <Step4_SitePhotos setStep={setStep} />;
      break;

    case 5:
      stepComponent = <Step5_MoreInfoSite setStep={setStep} availableLocalities={availableLocalities} availableNeighborhoods={availableNeighborhoods} />;
      break;

    default:
      stepComponent = null;
  }

  return (
    <StateMachineProvider> {/* Se usa para recordar la información ingresada por el usuario entre pasos */}
      <Stepper>
        <Progress // Esta es la barra de progreso de antd
          className="stepper-progress"
          percent={step * 20}
          showInfo={false}
        />
        {stepComponent}
      </Stepper>
    </StateMachineProvider>
  );
};

export default AddOwner;