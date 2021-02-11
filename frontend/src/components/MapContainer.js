import React from 'react';

const MapContainer = () => { 
  
  return (
    <div>
        <iframe className="google-map"
        title="google-map"
        frameborder="0" 
        allowfullscreen="" 
        aria-hidden="false"
        tabindex="0"
        width="100%"
        height="600"
        style={{border:0}}
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3123.874512349007!2d23.595998714831378!3d38.46745827977762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a117a25e2d9ec9%3A0x819b9a3dcc8787c3!2zzpHOss6szr3PhM-Jzr0gNjksIM6nzrHOu866zq_OtM6xIDM0MSAwMA!5e0!3m2!1sel!2sgr!4v1594288259340!5m2!1sel!2sgr" ></iframe>
    </div>
  )
}
export default MapContainer;