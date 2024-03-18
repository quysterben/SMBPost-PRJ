import { useEffect } from 'react';

import requestAPI from '../../utils/fetchAPI';

export default function Login() {
  useEffect(() => {
    const fetchAPI = async () => {
      const result = await requestAPI('', 'GET', null);
      console.log(result);
    };
    fetchAPI();
  }, []);

  return <div>Login123</div>;
}
