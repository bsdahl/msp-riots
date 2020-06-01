import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import _get from 'lodash/get';
import places from './places.json';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import './index.css';

const MAPS_KEY = process.env['REACT_APP_MAPS_KEY'];

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 44.9778,
  lng: -93.265,
};

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  margin: 0;
  padding: 0;
  width: 100vw;
`;

function App() {
  return (
    <LoadScript googleMapsApiKey={MAPS_KEY} libraries={['places']}>
      <Flex>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
          {places.map((place, index) => (
            <Location place={place} key={index} />
          ))}
        </GoogleMap>
        <h3>
          Source:{' '}
          <a href="https://bringmethenews.com/minnesota-news/a-list-of-the-buildings-damaged-looted-in-minneapolis-riots">
            https://bringmethenews.com/minnesota-news/a-list-of-the-buildings-damaged-looted-in-minneapolis-riots
          </a>
        </h3>
      </Flex>
    </LoadScript>
  );
}

export default App;

const Location = (props) => {
  const [open, setOpen] = useState(false);
  const handleToggleOpen = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const handleCloseCall = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const location = _get(props.place, 'place.result.geometry.location');

  if (location === undefined) {
    return null;
  }

  let icon;

  if (props.place.description && props.place.description.includes('fire')) {
    icon = FireIcon;
  }

  return (
    <Marker
      title={props.place.description}
      position={location}
      onClick={handleToggleOpen}
      onMouseOver={handleToggleOpen}
      onMouseOut={handleCloseCall}
      icon={icon}
    >
      {open && (
        <InfoWindow onCloseClick={handleCloseCall}>
          <>
            <h3>{props.place.query}</h3>
            <p>{props.place.description}</p>
          </>
        </InfoWindow>
      )}
    </Marker>
  );
};

const FireIcon =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEHUlEQVRYhaWXX2hbVRzHPye5SbramrZupURMtjBoVwR9ELfiJh2ibMoeRisrgz5JH+ZA0YeJ4IMKKhUH/nmQDhUfBlafpsIepiDI/tQhOuZspa6X3NusrV3XNtZim+Tenw+5W5vk5t6b+XtJcs7vfL+f+zvn5JyrqCPSyVQSGAD2A91Au9M1D4wDPwCjummYQTVVHcbvAANKqZBXrojYwCjwahAQX4B0MnUUGFFKNQWB3QTyDzCkm8aoV17Yx/xlxzxaKyfeKKwXqp/DGdPfGm9ZWcrlLtUaX7Oc6WTqqFKcVMqrSMLbRwo1e52xJ50qBgdIJ1PbgRG/GXp8l01vt819TeIHMeJoBgMAhv3mfFuz8EZfgZCCfV22J6ijNRwIIJ1MpVH0ewk2xYRTQ3k6Wkq/e7stTwAn+tPJVNoXABhQeG+1N58t0JXYKPu+TpuGSO1pAHC270AQgCe8hLoSNgceKi95Ywz27LRpbhC0kCdIlbYbwINeCr27bNw2Rus9wpEei8c6PddDlXYZwI5UCmCrl8L9bdVPKAL6fIjBvUX6HvVcD1t3PLC9NoASAXB9hNtbza3Ak7OK408VaY/D/u7SVGzR3KdCqfL2MgDdNAEybgOP7c7z9MMW2Vul+ovAFaP0fWeH3NmKWhi6EsILu9fdZGZ006gN4MRFt5ErepHXDhcoOBWenFW8dSYCQLhC5fX+As3iWshfKhvcAL52G3ljyqalUThxqAjApeshrk0rbixWr8h0uzDxh+sUfBcE4KyILFY2LqwqssaG6PSCAhSTsyWAqb8Uc8ulvvk54Xq2HMw5ps/4AuimsQZ8Xtl+U9P4+fxGWRtK1ScagcxNxfOfRVhZK5n+eM7iVrjqoP1eN42sL4ATH4hIvgwsFuWnCzYzZgmiM1H6fPdbjUPvRZnLKRKtQmbK5vIFm2wkUqn5kZuRK4Bzkzm9ue3fUIix6BY++dAim7HZ22mjhYTJ2RBFS/Fcr8XqonD64yLj0RhroQ1pEbkGnHXzqnkhaY23XAGOKaW0222r4TAZS2P8vEVT3mIlojG9HGLPDosD29b58tMivxai/BmLUfF3eVw3jd/dfDwP/HQyNayUOuHW12jbRETIhcO0FYvELZsFLcxKxdyLyJiCnqmK/R8U4F5gQimV8MqrFc7K79FN43KtHM9jVzeNv4GX7sbciVNe5r4AAFoh9pWIfFOvs4hkgVf88oK+FySA35RSbQHNbeCgbhrn/HJ9KwCgm8YMMOR+FrrG+0HMwee9YHMs5XITrfGWDqXUI155InIRGFzK5QJdFANVYCPUiyIy5mGeBfp008jXyvlfALqZyQOHRaTqnU9EloFndNOYq0ezzgqAY/CkiNwxcswP6qZxtV69QLvALZw7/heABgzqpjF+Nzr/AV/ZkEb25RxzAAAAAElFTkSuQmCC';
