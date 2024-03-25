import { create } from 'zustand';

const useContractHook = create((set) => ({
  contract: null,
  provider: null,
  web3: null,
  account: '',
  setContract: (newData) => {
    return set({
      contract: newData.contract,
      provider: newData.provider,
      web3: newData.web3
    });
  },
  setAccount: (newAccount) => {
    return set({
      account: newAccount
    });
  }
}));

export default useContractHook;
