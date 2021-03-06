import { useState, useEffect } from 'react';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

// const APIURL = 'https://api.thegraph.com/subgraphs/name/merlinprotocoldev/launchpad';
const APIURL = 'http://8.210.141.80:8000/subgraphs/name/davekaj/launchpad/graphql';

const tokensQuery = `
  query MyQuery {
    whitelists(first: 10) {
      nft
    }
  }
`;

const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});

export default () => {
  const [list, setList] = useState<any[]>([process.env.NFT_CONTRACT_ADDRESS]);

  useEffect(() => {
    // TODO
    init();
  }, []);

  const init = async () => {
    client
      .query({
        query: gql(tokensQuery),
      })
      .then((data) => {
        const whitelists = data?.data?.whitelists?.map((item: any) => item.nft);

        setList(whitelists);
      })
      .catch((err) => {
        console.log('Error fetching data: ', err);
      });
  };

  return list;
};
