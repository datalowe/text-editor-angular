import { gql } from "apollo-angular";

export const GQL_GET_EDITORS = gql`
  query GetEditors {
    editors {
      id
      username
    }
  }
`;

export const GQL_GET_ALL_DOCUMENTS = gql`
  query GetDocuments {
    documents {
      id
      title
      body
      owner {
          id
          username
      }
      editors {
          id
          username
      }
    }
  }
`;

export const GQL_CREATE_NEW_DOCUMENT = gql`
    mutation CreateNewDocument(
        $title: String!
        $body: String!
        $ownerId: String!
    ) {
        createDocument(
            title: $title
            body: $body
            ownerId: $ownerId
        )
    }
`;

export const GQL_UPDATE_DOCUMENT = gql`
    mutation UpdateDocument(
        $id: String!
        $title: String!
        $body: String!
        $ownerId: String!
        $editorIds: [String]!
    ) {
        updateDocument(
            id: $id
            title: $title
            body: $body
            ownerId: $ownerId
            editorIds: $editorIds
        )
    }
`;