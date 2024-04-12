import { useEffect, useState } from 'react';

import { Button, Container } from '@mui/material';
import { blue, green, grey } from '@mui/material/colors';

import Web3 from 'web3';
import Swal from 'sweetalert2';

import useContractHook from '../../../hooks/useContractHook';

export default function MetaMaskBtn() {
  const [connected, setConnected] = useState(false);

  const contract = useContractHook((state) => state.contract);
  const account = useContractHook((state) => state.account);
  const setAccount = useContractHook((state) => state.setAccount);
  useEffect(() => {
    console.log(contract, account);
    if (contract && account !== '' && account !== undefined) {
      console.log(contract, account);
      setConnected(true);
    } else {
      setConnected(false);
    }
  }, [contract, account]);

  const connectMetamask = async () => {
    //check metamask is installed
    if (window.ethereum) {
      // instantiate Web3 with the injected provider
      const web3 = new Web3(window.ethereum);

      try {
        //request user to connect accounts (Metamask will prompt)
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          text: 'Login to Metamask and give permission to this website to access your account.'
        });
      }

      //get the connected accounts
      const accounts = await web3.eth.getAccounts();
      //set the connected account to the state
      setAccount(accounts[0]);

      //show the first connected account in the react page
      setConnected(true);
    } else {
      alert('Please download metamask');
    }
  };

  return (
    <Container
      sx={{
        mb: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '24px'
      }}
    >
      {connected && account ? (
        <Container>
          <Button
            size="medium"
            disabled
            variant="contained"
            sx={{ width: '100%', bgcolor: green[100], fontSize: '12px' }}
          >
            {account.slice(0, 16) + '...'}
          </Button>
        </Container>
      ) : (
        <Container>
          <Button
            sx={{
              width: '100%',
              bgcolor: blue[400],
              ':hover': {
                bgcolor: blue[600]
              },
              fontSize: '10px'
            }}
            size="medium"
            variant="contained"
            onClick={connectMetamask}
          >
            Connect to MetaMask
          </Button>
        </Container>
      )}
      <hr
        style={{
          width: '100%',
          borderColor: grey[50]
        }}
      />
    </Container>
  );
}
