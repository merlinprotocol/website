import { useState, useEffect } from 'react';
import { getWhiteList } from '@/servers';

export default () => {
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    getWhiteList()
      .then((response: any) => {
        if (response?.code === 0) {
          setList(response.data.accounts);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return list;
};
