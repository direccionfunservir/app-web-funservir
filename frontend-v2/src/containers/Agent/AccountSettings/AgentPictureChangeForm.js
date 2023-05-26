import React, { useContext, useEffect, useState } from 'react';
import { Button, Divider } from 'antd';
import { useForm } from 'react-hook-form';
import ImageUploader from 'components/UI/ImageUploader/ImageUploader';
import Heading from 'components/UI/Heading/Heading';
import { AgentPictureUploader, FormTitle } from './AccountSettings.style';
import { AuthContext } from 'context/AuthProvider';

export default function AgentPictureChangeForm() {

  const { user } = useContext(AuthContext);

  const [coverPicture, setCoverPicture] = useState([]);
  const [profilePicture, setProfilePicture] = useState([]);

  const {
    handleSubmit,
  } = useForm();

  useEffect(() => {
    const initializeImages = () => {
      if (user && user.coverPicture) {
        setCoverPicture([
          {
            status: 'done',
            url: user.coverPicture,
          },
        ]);
      }

      if (user && user.profilePicture) {
        setProfilePicture([
          {
            status: 'done',
            url: user.profilePicture,
          },
        ]);
      }
    };

    initializeImages();
  }, [user]);

  const onSubmit = async () => {
    console.log("data1: ", coverPicture)
    console.log("data2: ", profilePicture)
  }

  return (
    <AgentPictureUploader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormTitle>Imágenes de perfil</FormTitle>
        <Heading content="Imagen de portada" as="h4" />
        <ImageUploader fileList={coverPicture} setImage={setCoverPicture} />
        <Divider />
        <Heading content="Imagen de perfil" as="h4" />
        <ImageUploader fileList={profilePicture} setImage={setProfilePicture} />

        <div className="submit-container">
          <Button htmlType="submit" type="primary">
            Guardar cambios
          </Button>
        </div>
      </form>
    </AgentPictureUploader>
  );
}