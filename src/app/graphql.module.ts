import {NgModule} from '@angular/core';
import {APOLLO_OPTIONS} from 'apollo-angular';
import {ApolloClientOptions, ApolloLink, InMemoryCache} from '@apollo/client/core';
import {HttpLink} from 'apollo-angular/http';
import { backendRootUrl } from './global-variables';

import { setContext } from '@apollo/client/link/context';

const uri = `${backendRootUrl}/editor-api/graphql`; // graphQL backend endpoint

// Strip __typename from variables
// (source and context here: 
// https://github.com/apollographql/apollo-client/issues/1913#issuecomment-425281027)

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  // based on https://apollo-angular.com/docs/recipes/authentication/
  const auth = setContext((operation, context) => {
    // can't rely on ngx-cookie-service here since things aren't happening inside of
    // of a class. instead, using guidance for extracting cookie values from
    // https://developer.mozilla.org/docs/Web/API/Document/cookie
    let token: string | null = null;

    const tokenRow: string | undefined = document.cookie
    .split('; ')
    .find(row => row.startsWith('editor-api-token'))
    if (tokenRow) {
      token = tokenRow.split('=')[1];
    }

    if (token === null) {
      return {};
    } else {
      return {
        headers: {
          'x-access-token': token
        }
      };
    }
  });

  const link = ApolloLink.from([auth, httpLink.create({ uri })]);
  const cache = new InMemoryCache();

  return {
    link,
    cache,
  };
}

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
