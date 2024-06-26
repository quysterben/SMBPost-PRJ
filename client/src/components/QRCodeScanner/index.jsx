import React, { useEffect } from 'react';
import { Html5QrcodeScanType, Html5QrcodeScanner } from 'html5-qrcode';

import PropTypes from 'prop-types';
QRCodeScanner.propTypes = {
  setResult: PropTypes.func.isRequired,
  isResetScanner: PropTypes.bool
};

function QRCodeScanner({ setResult, isResetScanner }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'reader',
      {
        qrbox: {
          width: 225,
          height: 225
        },
        fps: 10,
        supportedScanTypes: [
          Html5QrcodeScanType.SCAN_TYPE_FILE,
          Html5QrcodeScanType.SCAN_TYPE_CAMERA
        ]
      },
      false
    );

    const onScanSuccess = (scanData) => {
      try {
        setResult(scanData);
        scanner.clear();
      } catch (error) {
        throw new Error('Invalid QR code.');
      }
    };

    const onScanError = (err) => {
      console.error(err);
    };
    scanner.render(onScanSuccess, onScanError);

    return () => {
      scanner.clear();
    };
  }, [isResetScanner]);

  return <div id="reader" style={{ width: 400 }} />;
}

export default QRCodeScanner;
