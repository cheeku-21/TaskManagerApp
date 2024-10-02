// pages/_app.js
import '../styles/styles.css'; // Import the global CSS file
import React from 'react';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
