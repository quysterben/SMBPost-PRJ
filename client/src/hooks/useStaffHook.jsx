import { create } from 'zustand';

import requestAPI from '../utils/fetchAPI';

const useUserHook = create((set) => ({
  userDatas: [],
  getUserDatas: async () => {
    const res = await requestAPI('user', 'GET');
    return set({
      userDatas: res.data.users
    });
  }
}));

export default useUserHook;
